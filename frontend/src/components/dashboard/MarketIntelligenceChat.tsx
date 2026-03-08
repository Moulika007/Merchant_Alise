import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, Maximize2, Minimize2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

interface MarketIntelligenceChatProps {
    surgeContext: any;
    initialMessage?: string;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const MarketIntelligenceChat: React.FC<MarketIntelligenceChatProps> = ({ surgeContext, initialMessage }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<any>(null);

    useEffect(() => {
        if (initialMessage && messages.length === 0) {
            const systemContext = `You are the Market Specialist AI for Merchant Aisle, an e-commerce seller dashboard. 
Your role is to provide actionable, data-driven advice about demand surges, inventory management, pricing strategy, and regional sales patterns in India.
Keep responses concise, insightful, and seller-focused — like a real market analyst. 

Current surge context: ${JSON.stringify(surgeContext, null, 2)}`;

            // Initialize Gemini chat with system context
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
            chatRef.current = model.startChat({
                history: [
                    {
                        role: 'user',
                        parts: [{ text: systemContext }]
                    },
                    {
                        role: 'model',
                        parts: [{ text: `Understood. I'm your Market Specialist, ready to help with surge analysis and inventory strategy. ${initialMessage}` }]
                    }
                ]
            });

            setMessages([
                {
                    id: '1',
                    text: initialMessage,
                    sender: 'bot',
                    timestamp: new Date()
                },
                {
                    id: '2',
                    text: "I am your Merchant Aisle Market Specialist powered by Gemini AI. Do you have any specific questions about this surge or how to optimize your inventory?",
                    sender: 'bot',
                    timestamp: new Date()
                }
            ]);
        }
    }, [initialMessage, messages.length, surgeContext]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userText = input.trim();
        const userMsg: Message = {
            id: Date.now().toString(),
            text: userText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // If chat session doesn't exist, create one
            if (!chatRef.current) {
                const contextSummary = surgeContext
                    ? `City: ${surgeContext.city || 'Unknown'}, Product: ${surgeContext.productName || 'Unknown'}, Demand Score: ${surgeContext.demandScore || 'N/A'}`
                    : 'General e-commerce seller questions for an Indian marketplace.';

                const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
                chatRef.current = model.startChat({
                    history: [
                        {
                            role: 'user',
                            parts: [{ text: `You are the Market Specialist AI for Merchant Aisle. Provide concise, actionable seller advice about e-commerce demand surges and inventory in India. Context: ${contextSummary}` }]
                        },
                        {
                            role: 'model',
                            parts: [{ text: `Ready to help with market intelligence and inventory strategy!` }]
                        }
                    ]
                });
            }

            const result = await chatRef.current.sendMessage(userText);
            const reply = result.response.text();

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: reply,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error: any) {
            console.error('Gemini Chat Error:', error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: `⚠️ Could not reach Gemini AI: ${error?.message || 'Unknown error'}. Please check your API key.`,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            layout
            className={`flex flex-col bg-white border border-border shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'h-[600px]' : 'h-[500px]'}`}
        >
            {/* Header */}
            <div className="p-4 bg-primary text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                        <Sparkles size={18} className="text-white" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm leading-tight font-outfit">Market Specialist</h4>
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-[10px] text-white/70 font-medium">Gemini AI Online</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/30">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`shrink-0 p-2 rounded-xl shadow-sm ${msg.sender === 'bot' ? 'bg-primary text-white' : 'bg-white text-primary border border-border'}`}>
                                {msg.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
                            </div>
                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${msg.sender === 'bot'
                                ? 'bg-white text-primary rounded-tl-none'
                                : 'bg-primary text-white rounded-tr-none'
                                }`}>
                                {msg.text}
                                <div className={`text-[9px] mt-2 opacity-50 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <div className="shrink-0 p-2 rounded-xl bg-primary text-white">
                            <Bot size={16} />
                        </div>
                        <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                            <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 bg-white border-t border-border shrink-0">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about inventory, trends, or strategy..."
                        className="w-full bg-muted border border-border rounded-2xl px-5 py-3.5 pr-14 text-sm focus:outline-none focus:border-primary transition-all font-medium"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:scale-95 shadow-lg"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <p className="text-[10px] text-center text-accent mt-3 font-medium">
                    Powered by Google Gemini AI · Real-time market intelligence
                </p>
            </div>
        </motion.div>
    );
};

export default MarketIntelligenceChat;
