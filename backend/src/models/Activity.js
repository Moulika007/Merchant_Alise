import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['search', 'view', 'cart_add'],
        required: true
    },
    category: String,
    location: String,
    productId: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Index for fast time-based queries
activitySchema.index({ timestamp: -1 });

export const Activity = mongoose.model('Activity', activitySchema);
