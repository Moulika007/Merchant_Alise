import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import routes from './src/routes/index.js';
import { initializeDemandMonitoring } from './src/services/demandMonitor.js';
import { startSurgeSimulation, recordActivity } from './src/services/surgeAnalyzer.js';
import { initSurgeEngine, recordBuyerAction } from './surgeEngine.js';
import aiRoutes from './src/routes/aiRoutes.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true
    },
    transports: ['websocket', 'polling']
});

// Initialize demand monitoring (from eCom_Merged)
const demandMonitor = initializeDemandMonitoring(io);

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => res.send('ViralPulse API is running'));
app.use('/api', routes);
app.use('/api/ai', aiRoutes);

// Initialize Redis Surge Engine (from indhu)
initSurgeEngine(io);

// Enhanced Socket.io for real-time recommendations and indhu actions
io.on('connection', (socket) => {
    console.log('User connected to real-time analytics');

    socket.on('order-placed', (data) => {
        demandMonitor.updateDemand(data.productId, data.quantity);
        socket.broadcast.emit('inventory-update', data);
    });

    socket.on('request-recommendations', (productData) => {
        socket.emit('recommendations-ready', {
            productId: productData.productId,
            timestamp: new Date().toISOString()
        });
    });

    // Listen for real-time activity (search, view, etc.) (from eCom_Merged)
    socket.on('record-activity', (data) => {
        recordActivity(data);
    });

    // Listen for buyer actions from the Store Context (from indhu)
    socket.on('buyer_action', async (data) => {
        console.log('📥 Socket Received: buyer_action', data);
        if (data && data.productId && data.type && data.city) {
            await recordBuyerAction(data.productId, data.type, data.city, data.qty || 1, data.productName);
        }
    });

    socket.on('disconnect', () => console.log('User disconnected'));
});

// Start Surge Simulation (from eCom_Merged)
startSurgeSimulation(io);

const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

const startServer = async () => {
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in the backend environment.');
    }

    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('MongoDB connected successfully');

        server.listen(PORT, () => {
            console.log(`Enhanced Analytics Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
});

startServer();