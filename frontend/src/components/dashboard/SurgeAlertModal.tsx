import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SurgeAlert } from '../../hooks/useSocket';

interface SurgeAlertModalProps {
    alert: SurgeAlert | null;
    onClose: () => void;
}

const SurgeAlertModal: React.FC<SurgeAlertModalProps> = ({ alert, onClose }) => {
    const navigate = useNavigate();

    if (!alert) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 bg-black/20 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 50 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-border/50 relative"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-accent hover:text-primary transition-colors p-1 rounded-full z-10 bg-muted/50"
                    >
                        <X size={18} />
                    </button>

                    <div className="p-6 pt-8 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                            <TrendingUp size={32} />
                        </div>

                        <h3 className="text-xl font-bold text-primary font-outfit leading-tight mb-4 px-2">
                            {alert.explanation || "Real-time demand spike detected for your products."}
                        </h3>

                        <button
                            onClick={() => {
                                navigate('/seller/surge-analysis', {
                                    state: {
                                        productName: alert.productName || alert.displayTitle,
                                        location: alert.location
                                    }
                                });
                                onClose();
                            }}
                            className="w-full bg-primary text-white font-bold py-3.5 px-6 rounded-xl hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            Explore Reason <ArrowRight size={18} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SurgeAlertModal;
