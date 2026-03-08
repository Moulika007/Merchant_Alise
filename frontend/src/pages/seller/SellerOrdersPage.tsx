import { useStore, Order } from '../../context/StoreContext';
import { Package, Clock, CheckCircle2, Truck, ArrowRight, Zap, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Pending': return <Clock size={14} className="text-amber-500" />;
        case 'Processing': return <Package size={14} className="text-blue-500" />;
        case 'Shipped': return <Truck size={14} className="text-indigo-500" />;
        case 'Delivered': return <CheckCircle2 size={14} className="text-emerald-500" />;
        default: return <Clock size={14} />;
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

const nextStatus = (current: Order['status']): Order['status'] | null => {
    if (current === 'Pending') return 'Processing';
    if (current === 'Processing') return 'Shipped';
    if (current === 'Shipped') return 'Delivered';
    return null;
};

export default function SellerOrdersPage() {
    const { orders, updateOrderStatus, products } = useStore();

    const pendingCount = orders.filter(o => o.status === 'Pending').length;
    const processingCount = orders.filter(o => o.status === 'Processing').length;
    const shippedCount = orders.filter(o => o.status === 'Shipped').length;
    const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary font-outfit">Order Fulfillment</h1>
                <p className="text-accent mt-1">Manage and progress your incoming customer orders.</p>
            </div>

            {/* Status summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Pending', count: pendingCount, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
                    { label: 'Processing', count: processingCount, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
                    { label: 'Shipped', count: shippedCount, bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' },
                    { label: 'Delivered', count: deliveredCount, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
                ].map(s => (
                    <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4`}>
                        <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">{s.label}</p>
                        <p className={`text-3xl font-bold ${s.text}`}>{s.count}</p>
                        <p className="text-xs text-accent mt-1 font-medium">orders</p>
                    </div>
                ))}
            </div>

            {/* Orders table */}
            {orders.length === 0 ? (
                <div className="bg-white border border-border rounded-3xl p-12 text-center flex flex-col items-center">
                    <div className="bg-muted p-4 rounded-full mb-4"><Package size={32} className="text-accent" /></div>
                    <h2 className="text-xl font-bold text-primary mb-2">No orders right now</h2>
                    <p className="text-accent">When a customer places an order, it will appear here.</p>
                </div>
            ) : (
                <div className="bg-white border border-border rounded-3xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted border-b border-border text-xs uppercase tracking-widest text-accent font-bold">
                                    <th className="p-4 pl-6">Order ID &amp; Date</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Items &amp; Demand Signal</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 pr-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-border">
                                {orders.map((order, index) => {
                                    const itemSignals = order.items.map(i => {
                                        const p = products.find(pr => pr.id === i.product.id);
                                        return {
                                            name: i.product.name,
                                            signal: p?.isTrending ? 'trending' : p?.isLowStock ? 'lowstock' : null,
                                        };
                                    });
                                    return (
                                        <motion.tr
                                            key={order.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-muted/50 transition-colors"
                                        >
                                            <td className="p-4 pl-6 align-top">
                                                <p className="font-bold text-primary mb-1">{order.id}</p>
                                                <p className="text-xs text-accent font-medium">{new Date(order.date).toLocaleDateString('en-IN')}</p>
                                            </td>
                                            <td className="p-4 align-top max-w-[180px]">
                                                <p className="font-semibold text-primary mb-1 truncate">Buyer</p>
                                                <p className="text-xs text-accent truncate">{order.shippingAddress}</p>
                                            </td>
                                            <td className="p-4 align-top">
                                                <p className="font-semibold text-primary mb-1">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                                                <div className="space-y-0.5">
                                                    {itemSignals.slice(0, 2).map((d, i) => (
                                                        <div key={i} className="flex items-center gap-1.5 text-xs">
                                                            <span className="text-accent truncate max-w-[100px]">{d.name}</span>
                                                            {d.signal === 'trending' && (
                                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 flex items-center gap-0.5 shrink-0">
                                                                    <Zap size={9} />Trending
                                                                </span>
                                                            )}
                                                            {d.signal === 'lowstock' && (
                                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-50 text-red-600 flex items-center gap-0.5 shrink-0">
                                                                    <AlertTriangle size={9} />Low Stock
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                    {order.items.length > 2 && <p className="text-xs text-accent">+{order.items.length - 2} more</p>}
                                                </div>
                                            </td>
                                            <td className="p-4 align-top font-bold text-primary">₹{order.total.toLocaleString('en-IN')}</td>
                                            <td className="p-4 align-top">
                                                <div className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border flex w-fit items-center gap-1.5 shadow-sm ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}{order.status}
                                                </div>
                                            </td>
                                            <td className="p-4 pr-6 text-right align-top">
                                                {nextStatus(order.status) ? (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, nextStatus(order.status)!)}
                                                        className="text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1 ml-auto"
                                                    >
                                                        Mark {nextStatus(order.status)} <ArrowRight size={12} />
                                                    </button>
                                                ) : (
                                                    <span className="text-xs font-bold text-accent px-3 py-1.5 flex items-center justify-end gap-1">
                                                        Completed <CheckCircle2 size={12} className="text-emerald-500" />
                                                    </span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
