import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { mockCategories, Product } from '../../mockData';
import { Plus, X, Package, TrendingUp, TrendingDown, BarChart3, Zap, ShoppingBag, Star, AlertTriangle, ShoppingCart, ClipboardCheck, MapPin, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────── Add Product Modal ─────────── */
const EMPTY_FORM = {
    name: '', brand: '', price: '', stock: '',
    category: mockCategories[0].name,
    subcategory: mockCategories[0].subcategories[0],
    description: '', image: '', tag: '',
};

function AddProductModal({ onClose }: { onClose: () => void }) {
    const { addProduct } = useStore();
    const [form, setForm] = useState(EMPTY_FORM);
    const [error, setError] = useState('');

    const selectedCat = mockCategories.find(c => c.name === form.category);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.brand || !form.price || !form.stock || !form.description) {
            setError('Please fill in all required fields.');
            return;
        }
        const price = parseFloat(form.price);
        const stock = parseInt(form.stock, 10);
        if (isNaN(price) || isNaN(stock)) { setError('Price and Stock must be valid numbers.'); return; }

        const newProduct: Product = {
            id: `p${Date.now()}`,
            name: form.name,
            brand: form.brand,
            price,
            stock,
            category: form.category,
            subcategory: form.subcategory,
            description: form.description,
            image: form.image || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800`,
            images: [],
            tag: form.tag || undefined,
            rating: 0,
            discount: 0,
            isTrending: false,
            isLowStock: stock < 10,
            salesHistory: [],
            priceHistory: [{ date: new Date().toISOString().split('T')[0], price }],
            aiInsights: 'New product — no insights available yet.',
        };
        addProduct(newProduct);
        onClose();
    };

    const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
        <div>
            <label className="block text-xs font-bold text-accent uppercase tracking-widest mb-1.5">{label}</label>
            <input
                type={type}
                value={form[key]}
                placeholder={placeholder}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm text-primary outline-none focus:border-primary transition-colors"
            />
        </div>
    );

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-border"
                initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary text-white p-2 rounded-xl"><Plus size={16} /></div>
                        <div>
                            <h2 className="font-bold text-primary font-outfit">Add New Product</h2>
                            <p className="text-xs text-accent">Fill in details to list your product</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors text-accent hover:text-primary">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {field('Product Name *', 'name', 'text', 'e.g. Wireless Earbuds Pro')}
                        {field('Brand *', 'brand', 'text', 'e.g. SonicAura')}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {field('Price (₹) *', 'price', 'number', '0')}
                        {field('Stock *', 'stock', 'number', '0')}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-accent uppercase tracking-widest mb-1.5">Category</label>
                            <select
                                value={form.category}
                                onChange={e => setForm(f => ({ ...f, category: e.target.value, subcategory: mockCategories.find(c => c.name === e.target.value)?.subcategories[0] || '' }))}
                                className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm text-primary outline-none focus:border-primary"
                            >
                                {mockCategories.map(c => <option key={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-accent uppercase tracking-widest mb-1.5">Subcategory</label>
                            <select
                                value={form.subcategory}
                                onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))}
                                className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm text-primary outline-none focus:border-primary"
                            >
                                {selectedCat?.subcategories.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    {field('Image URL (optional)', 'image', 'url', 'https://...')}
                    {field('Tag (optional)', 'tag', 'text', 'e.g. Trending, New, Bestseller')}
                    <div>
                        <label className="block text-xs font-bold text-accent uppercase tracking-widest mb-1.5">Description *</label>
                        <textarea
                            rows={3} value={form.description}
                            placeholder="Short product description..."
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm text-primary outline-none focus:border-primary transition-colors resize-none"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 border border-border text-accent font-bold py-3 px-6 rounded-xl hover:bg-muted transition-colors text-sm">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors shadow-sm text-sm flex items-center justify-center gap-2">
                            <Plus size={16} /> List Product
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

/* ─────────── Demand Card ─────────── */
function DemandCard({ product, isPredicted }: { product: Product; isPredicted?: boolean }) {
    const lastTwo = product.salesHistory.slice(-2);
    const trend = lastTwo.length === 2 ? lastTwo[1].sales - lastTwo[0].sales : 0;
    const totalSales = product.salesHistory.reduce((s, h) => s + h.sales, 0);

    let demandLabel = 'Steady';
    let demandBg = 'bg-gray-100 text-gray-600';
    let icon = <BarChart3 size={12} />;

    if (product.isTrending) { demandLabel = 'Trending'; demandBg = 'bg-amber-50 text-amber-700'; icon = <Zap size={12} />; }
    else if (trend > 5) { demandLabel = 'Rising'; demandBg = 'bg-emerald-50 text-emerald-700'; icon = <TrendingUp size={12} />; }
    else if (trend < -3) { demandLabel = 'Declining'; demandBg = 'bg-red-50 text-red-600'; icon = <TrendingDown size={12} />; }

    const demandPct = Math.min(100, Math.round((totalSales / 300) * 100));

    return (
        <div className="flex items-start gap-3 p-4 rounded-2xl border border-border bg-white hover:shadow-sm transition-shadow">
            <img
                src={product.image} alt={product.name}
                className="w-12 h-12 rounded-xl object-cover border border-border shrink-0"
                onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/48x48/f7f7f5/0f0f0f?text=IMG'; }}
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-bold text-sm text-primary truncate">{product.name}</p>
                    <div className="flex flex-col items-end gap-1">
                        <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0 ${demandBg}`}>
                            {icon}{demandLabel}
                        </span>
                        {isPredicted && (
                            <span className="flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-md shrink-0 bg-primary text-white uppercase tracking-tighter animate-pulse">
                                <Zap size={8} fill="currentColor" /> Predicted
                            </span>
                        )}
                    </div>
                </div>
                <p className="text-xs text-accent mb-2">{product.category} · {product.subcategory}</p>
                <div className="mb-2">
                    <div className="flex justify-between text-[10px] text-accent font-medium mb-1">
                        <span>Demand</span><span>{demandPct}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${product.isTrending ? 'bg-amber-400' : trend > 0 ? 'bg-emerald-500' : trend < 0 ? 'bg-red-400' : 'bg-gray-400'}`}
                            style={{ width: `${demandPct}%` }}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-semibold flex-wrap">
                    <span className="text-primary flex items-center gap-1"><ShoppingBag size={10} /> {totalSales} sold</span>
                    <span className={`flex items-center gap-1 ${product.isLowStock ? 'text-red-500' : 'text-emerald-600'}`}>
                        <Package size={10} /> {product.stock} in stock
                    </span>
                    {product.rating > 0 && (
                        <span className="text-amber-500 flex items-center gap-0.5"><Star size={10} fill="currentColor" /> {product.rating}</span>
                    )}
                    <span className="text-accent ml-auto">₹{product.price.toLocaleString('en-IN')}</span>
                </div>
            </div>
        </div>
    );
}

/* ─────────── Main Page ─────────── */
export default function ProductDemandPage() {
    const { products, cityDemandEvents, predictedSurges } = useStore();
    const [showAdd, setShowAdd] = useState(false);

    const lowStockProducts = products.filter(p => p.isLowStock);

    return (
        <div className="space-y-8 pb-12">
            <AnimatePresence>
                {showAdd && <AddProductModal onClose={() => setShowAdd(false)} />}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary font-outfit">Product Demand</h1>
                    <p className="text-accent mt-1">Track how your products are trending and manage your listings.</p>
                </div>
                <button
                    onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-sm text-sm shrink-0"
                >
                    <Plus size={16} /> Add Product
                </button>
            </div>

            {/* Summary row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Listed', val: products.length, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
                    { label: 'Trending', val: products.filter(p => p.isTrending).length, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
                    { label: 'Low Stock', val: lowStockProducts.length, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
                    { label: 'Healthy Stock', val: products.filter(p => !p.isLowStock).length, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
                ].map(s => (
                    <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4`}>
                        <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">{s.label}</p>
                        <p className={`text-3xl font-bold ${s.text}`}>{s.val}</p>
                    </div>
                ))}
            </div>

            {/* Low stock alert */}
            {lowStockProducts.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex items-start gap-3">
                    <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <span className="font-bold text-red-700">Stock Alert: </span>
                        <span className="text-red-600">
                            {lowStockProducts.map(p => p.name).join(', ')} {lowStockProducts.length === 1 ? 'is' : 'are'} running critically low. Restock via Inventory.
                        </span>
                    </div>
                </div>
            )}

            {/* Product demand grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {products.map((product, i) => {
                    const isPredicted = predictedSurges.some(ps => ps.productId === product.id);
                    return (
                        <motion.div key={product.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                            <DemandCard product={product} isPredicted={isPredicted} />
                        </motion.div>
                    );
                })}
            </div>

            {/* ── Live Buyer Activity Feed ── */}
            <div className="bg-white border border-border rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="font-bold text-primary text-lg font-outfit">Live Buyer Activity</h3>
                        <p className="text-xs text-accent mt-0.5">Real actions from customers — cart additions and orders</p>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                        Live
                    </span>
                </div>

                {cityDemandEvents.length === 0 ? (
                    <div className="text-center py-10 text-accent text-sm">
                        <ShoppingCart size={28} className="mx-auto mb-3 opacity-30" />
                        <p>No buyer activity yet. Activity appears here when customers add to cart or place orders.</p>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {[...cityDemandEvents].reverse().slice(0, 15).map(evt => {
                            const ago = Math.round((Date.now() - new Date(evt.timestamp).getTime()) / 1000);
                            const timeLabel = ago < 60 ? `${ago}s ago` : ago < 3600 ? `${Math.round(ago / 60)}m ago` : `${Math.round(ago / 3600)}h ago`;
                            return (
                                <motion.div
                                    key={evt.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors"
                                >
                                    <div className={`p-2 rounded-lg shrink-0 ${evt.type === 'order' ? 'bg-red-50 text-red-600' :
                                        evt.type === 'cart' ? 'bg-orange-50 text-orange-500' :
                                            'bg-yellow-50 text-yellow-600'
                                        }`}>
                                        {evt.type === 'order' ? <ClipboardCheck size={14} /> :
                                            evt.type === 'cart' ? <ShoppingCart size={14} /> :
                                                <Search size={14} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-primary truncate">{evt.productName}</p>
                                        <div className="flex items-center gap-2 text-xs text-accent font-medium">
                                            <MapPin size={10} />
                                            <span>{evt.city}, {evt.regionName}</span>
                                            <span>·</span>
                                            <span>qty {evt.qty}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${evt.type === 'order' ? 'bg-red-50 text-red-700' :
                                            evt.type === 'cart' ? 'bg-orange-50 text-orange-700' :
                                                'bg-yellow-50 text-yellow-700'
                                            }`}>
                                            {evt.type === 'order' ? '📦 Order' : evt.type === 'cart' ? '🛒 Cart' : '🔍 Search'}
                                        </span>
                                        <p className="text-[10px] text-accent mt-1">{timeLabel}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
