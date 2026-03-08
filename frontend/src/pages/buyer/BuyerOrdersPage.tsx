import { useStore } from '../../context/StoreContext';
import { Package, Clock, CheckCircle2, Truck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BuyerOrdersPage() {
    const { orders } = useStore();

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Pending': return <Clock size={16} className="text-amber-500" />;
            case 'Processing': return <Package size={16} className="text-blue-500" />;
            case 'Shipped': return <Truck size={16} className="text-indigo-500" />;
            case 'Delivered': return <CheckCircle2 size={16} className="text-emerald-500" />;
            default: return <Clock size={16} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Shipped': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'Delivered': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="pt-24 pb-32 min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-primary mb-4 font-outfit">Order History</h1>
                    <p className="text-accent text-lg">Track your recent purchases and view details.</p>
                </div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-muted rounded-3xl p-12 text-center flex flex-col items-center justify-center border border-border"
                    >
                        <div className="bg-white p-6 rounded-full mb-6 relative">
                            <Package size={48} className="text-accent" />
                            <div className="absolute top-4 right-4 bg-primary text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-md">0</div>
                        </div>
                        <h2 className="text-2xl font-bold text-primary mb-4">No active orders</h2>
                        <p className="text-accent mb-8 max-w-md">You haven't placed any orders yet. Discover our latest trending items and upgrade your setup.</p>
                        <Link to="/" className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-colors inline-flex items-center gap-2">
                            Start Shopping <ArrowRight size={16} />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={order.id}
                                className="bg-white border border-border rounded-3xl overflow-hidden hover:border-black/20 transition-colors"
                            >
                                {/* Order Header */}
                                <div className="bg-muted px-6 py-4 flex flex-wrap gap-4 items-center justify-between border-b border-border">
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase tracking-widest text-accent font-bold mb-1">Order Placed</span>
                                        <span className="text-sm font-semibold">{new Date(order.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase tracking-widest text-accent font-bold mb-1">Total</span>
                                        <span className="text-sm font-semibold">₹{order.total.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase tracking-widest text-accent font-bold mb-1">Ship To</span>
                                        <span className="text-sm font-semibold text-primary truncate max-w-[200px]">{order.shippingAddress}</span>
                                    </div>
                                    <div className="flex flex-col items-end flex-grow">
                                        <span className="text-xs text-accent font-medium mb-1">Order # {order.id}</span>
                                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 shadow-sm ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {order.items.map((item, i) => (
                                            <div key={`${order.id}-${i}`} className="flex gap-6 items-center">
                                                <div className="w-20 h-20 bg-muted rounded-xl flex-shrink-0 overflow-hidden border border-border">
                                                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-primary mb-1">{item.product.name}</h4>
                                                    <p className="text-sm text-accent font-medium mb-2">{item.product.brand}</p>
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <span className="text-accent bg-muted px-2 py-0.5 rounded-md font-medium">Qty: {item.quantity}</span>
                                                        <span className="font-bold text-primary">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                                                    </div>
                                                </div>
                                                <div className="hidden sm:block">
                                                    <Link to="/" className="text-sm font-semibold text-primary border border-border px-4 py-2 rounded-lg hover:bg-muted transition-colors">
                                                        Buy it again
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
