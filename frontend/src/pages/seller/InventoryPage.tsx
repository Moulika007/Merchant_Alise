import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { Plus, Package, TrendingUp, AlertCircle, Edit, MoreVertical } from 'lucide-react';
import { Product } from '../../mockData';

export default function InventoryPage() {
    const { products, addProduct, editProduct, restockProduct } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [restockingId, setRestockingId] = useState<string | null>(null);
    const [restockAmount, setRestockAmount] = useState<number>(10);

    // Form State
    const [formData, setFormData] = useState<Partial<Product>>({});
    const [imagesInput, setImagesInput] = useState('');
    const [sizesInput, setSizesInput] = useState('');

    const openAddModal = () => {
        setModalMode('add');
        setFormData({ name: '', brand: '', price: 0, discount: 0, category: 'Fashion', subcategory: 'General', stock: 10, image: '', description: '' });
        setImagesInput('');
        setSizesInput('');
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setModalMode('edit');
        setFormData(product);
        setImagesInput(product.images ? product.images.join(', ') : product.image);
        setSizesInput(product.sizes ? product.sizes.join(', ') : '');
        setIsModalOpen(true);
    };

    const handleRestock = (id: string) => {
        restockProduct(id, restockAmount);
        setRestockingId(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const imageArray = imagesInput.split(',').map(s => s.trim()).filter(Boolean);
        const mainImage = imageArray.length > 0 ? imageArray[0] : (formData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800');
        const sizesArray = sizesInput.split(',').map(s => s.trim()).filter(Boolean);

        const updates: Partial<Product> = {
            ...formData,
            price: Number(formData.price) || 0,
            discount: Number(formData.discount) || 0,
            stock: Number(formData.stock) || 0,
            image: mainImage,
            images: imageArray.length > 0 ? imageArray : [mainImage],
            sizes: sizesArray.length > 0 ? sizesArray : undefined
        };

        if (modalMode === 'add') {
            const p: Product = {
                id: `p-${Date.now()}`,
                name: updates.name || 'Untitled',
                brand: updates.brand || 'Merchant Aisle',
                price: updates.price || 0,
                discount: updates.discount || 0,
                rating: 5,
                image: mainImage,
                images: updates.images,
                sizes: updates.sizes,
                category: updates.category || 'General',
                subcategory: updates.subcategory || 'General',
                description: updates.description || '',
                stock: updates.stock || 0,
                isTrending: false,
                isLowStock: (updates.stock || 0) < 10,
                salesHistory: [],
                priceHistory: [{ date: new Date().toISOString(), price: updates.price || 0 }],
                aiInsights: 'New product added. Monitor initial sales velocity.'
            };
            addProduct(p);
        } else {
            if (formData.id) {
                editProduct(formData.id, updates);
            }
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary font-outfit">Inventory Management</h1>
                    <p className="text-accent mt-1">Track stock levels and edit your product catalogue.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
                >
                    <Plus size={18} /> Add Product
                </button>
            </div>

            {/* Inventory Data Table */}
            <div className="bg-white border border-border rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted border-b border-border text-xs uppercase tracking-widest text-accent font-bold">
                                <th className="p-4 pl-6 font-semibold">Product</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Stock</th>
                                <th className="p-4 font-semibold">Price / Sale</th>
                                <th className="p-4 pr-6 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-border">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-muted/50 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-muted flex-shrink-0 overflow-hidden border border-border">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-primary truncate max-w-[250px]">{product.name}</p>
                                                <p className="text-xs text-accent mt-0.5">{product.brand}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-2 items-start">
                                            {product.isLowStock && (
                                                <span className="bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm">
                                                    <AlertCircle size={12} /> Low Stock
                                                </span>
                                            )}
                                            {product.isTrending && (
                                                <span className="bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm">
                                                    <TrendingUp size={12} /> Prime Pick
                                                </span>
                                            )}
                                            {!product.isLowStock && !product.isTrending && (
                                                <span className="text-accent text-xs font-medium bg-muted px-2.5 py-1 rounded-md border border-border/50">Standard</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-semibold text-primary">
                                        <div className="flex items-center gap-2">
                                            <Package size={14} className="text-accent" /> {product.stock} units
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-primary">
                                        <div className="flex flex-col">
                                            {product.discount && product.discount > 0 ? (
                                                <>
                                                    <span className="text-xs text-accent line-through">₹{product.price.toLocaleString('en-IN')}</span>
                                                    <span className="text-green-600 font-bold">
                                                        ₹{Math.round(product.price * (1 - product.discount / 100)).toLocaleString('en-IN')}
                                                    </span>
                                                </>
                                            ) : (
                                                <span>₹{product.price.toLocaleString('en-IN')}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        {restockingId === product.id ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <input
                                                    type="number"
                                                    value={restockAmount}
                                                    onChange={e => setRestockAmount(Number(e.target.value))}
                                                    className="w-16 text-sm border border-border rounded-md px-2 py-1 outline-none text-center"
                                                    min="1"
                                                />
                                                <button onClick={() => handleRestock(product.id)} className="text-xs font-bold bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary/90">Save</button>
                                                <button onClick={() => setRestockingId(null)} className="text-xs font-bold bg-muted text-accent px-3 py-1.5 rounded-md hover:text-primary">X</button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setRestockingId(product.id)} className="text-xs font-semibold text-primary border border-border bg-white px-3 py-1.5 rounded-lg hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                                                    Restock
                                                </button>
                                                <button onClick={() => openEditModal(product)} className="text-xs font-semibold text-white border border-transparent bg-primary px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1">
                                                    <Edit size={12} /> Edit
                                                </button>
                                                <button className="text-accent hover:text-primary transition-colors p-1">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit Product Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-border flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/50">
                                <h2 className="text-xl font-bold text-primary font-outfit">
                                    {modalMode === 'add' ? 'Add New Product' : 'Edit Product'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-accent hover:text-primary w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors">✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2 sm:col-span-1 space-y-1.5">
                                        <label className="text-xs font-bold text-accent uppercase tracking-widest">Product Name</label>
                                        <input required type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="e.g. Ergonomic Keyboard" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1 space-y-1.5">
                                        <label className="text-xs font-bold text-accent uppercase tracking-widest">Brand</label>
                                        <input required type="text" value={formData.brand || ''} onChange={e => setFormData({ ...formData, brand: e.target.value })} className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="e.g. Keychron" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1 space-y-1.5">
                                        <label className="text-xs font-bold text-accent uppercase tracking-widest">List Price (₹)</label>
                                        <input required type="number" min="0" value={formData.price || 0} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="0.00" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1 space-y-1.5">
                                        <label className="text-xs font-bold text-accent uppercase tracking-widest">Discount (%)</label>
                                        <input type="number" min="0" max="100" value={formData.discount || 0} onChange={e => setFormData({ ...formData, discount: Number(e.target.value) })} className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="0" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1 space-y-1.5">
                                        <label className="text-xs font-bold text-accent uppercase tracking-widest">Initial Stock</label>
                                        <input required type="number" min="0" value={formData.stock || 0} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="0" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1 space-y-1.5">
                                        <label className="text-xs font-bold text-accent uppercase tracking-widest">Sizes (Comma Separated)</label>
                                        <input type="text" value={sizesInput} onChange={e => setSizesInput(e.target.value)} className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" placeholder="e.g. S, M, L, XL" />
                                    </div>
                                    <div className="col-span-2 space-y-1.5">
                                        <label className="text-xs font-bold text-accent uppercase tracking-widest">Image URLs (Comma Separated)</label>
                                        <textarea required rows={2} value={imagesInput} onChange={e => setImagesInput(e.target.value)} className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none" placeholder="https://image1.jpg, https://image2.jpg..." />
                                    </div>
                                    <div className="col-span-2 space-y-1.5">
                                        <label className="text-xs font-bold text-accent uppercase tracking-widest">Description</label>
                                        <textarea required rows={4} value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Provide a detailed description..." />
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-border flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-semibold text-primary rounded-xl hover:bg-muted transition-colors">Cancel</button>
                                    <button type="submit" className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-sm">
                                        {modalMode === 'add' ? 'Add to Catalogue' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
