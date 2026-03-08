import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartPage() {
    const { cart, removeFromCart, updateCartQuantity, cartTotal, placeOrder } = useStore();
    const navigate = useNavigate();

    const handleCheckout = () => {
        placeOrder("Buyer Default Address - 123 Main St");
        navigate('/buyer/orders');
    };

    return (
        <div className="pt-24 pb-32 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-primary mb-4 font-outfit">Your Bag</h1>
                    <p className="text-accent text-lg">Review your items before checkout.</p>
                </div>

                {cart.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-muted rounded-3xl p-12 text-center flex flex-col items-center justify-center border border-border"
                    >
                        <div className="bg-white p-6 rounded-full mb-6">
                            <ShoppingBag size={48} className="text-accent" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary mb-4">Your bag is empty</h2>
                        <p className="text-accent mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Explore our curated collections to find something you love.</p>
                        <Link to="/" className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                            Return to Storefront <ArrowRight size={16} />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                            <AnimatePresence>
                                {cart.map((item) => (
                                    <motion.div
                                        key={item.product.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                        className="bg-white border border-border rounded-2xl p-4 flex gap-6 relative group"
                                    >
                                        <div className="w-24 h-24 bg-muted rounded-xl flex-shrink-0 overflow-hidden">
                                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-primary text-lg pr-8">{item.product.name}</h3>
                                                <span className="font-bold whitespace-nowrap">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                                            </div>
                                            <p className="text-sm text-accent mb-4">{item.product.brand}</p>

                                            <div className="flex items-center justify-between mt-auto">
                                                <div className="flex items-center bg-muted rounded-lg p-1 border border-border/50">
                                                    <button
                                                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors text-primary"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-10 text-center font-bold text-sm tracking-widest">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors text-primary"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="w-10 h-10 flex items-center justify-center text-accent hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors"
                                                    title="Remove Item"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        <div className="md:col-span-1">
                            <div className="bg-muted p-6 rounded-3xl border border-border sticky top-24">
                                <h3 className="font-bold text-xl mb-6">Order Summary</h3>
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-sm text-accent font-medium">
                                        <span>Subtotal</span>
                                        <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-accent font-medium">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="h-px bg-border/80 w-full my-4" />
                                    <div className="flex justify-between font-bold text-lg text-primary">
                                        <span>Total</span>
                                        <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-primary text-white py-4 flex items-center justify-center gap-2 rounded-xl font-bold hover:bg-primary/90 transition-colors"
                                >
                                    Proceed to Checkout <ArrowRight size={18} />
                                </button>
                                <p className="text-xs text-center text-accent mt-4 font-medium max-w-[200px] mx-auto">
                                    Secure checkout powered by Merchant Aisle. Free shipping on all orders.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
