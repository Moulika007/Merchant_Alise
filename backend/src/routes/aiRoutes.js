import express from 'express';
import { generateChatResponse } from '../services/geminiService.js';

const router = express.Router();

/**
 * @route   POST /api/ai/chat
 * @desc    Get a chatbot response for a specific surge context
 * @access  Public (In production, this should be protected)
 */
router.post('/chat', async (req, res) => {
    const { message, context } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const reply = await generateChatResponse(message, context);
        res.json({ reply });
    } catch (error) {
        console.error('AI Chat Route Error:', error);
        res.status(500).json({ error: 'Failed to generate AI response' });
    }
});

export default router;
