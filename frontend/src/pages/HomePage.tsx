import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();
    const { products, searchQuery, activeCategory } = useStore();

    // Filter products based on global search and category
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || p.category === activeCategory || p.subcategory === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="pb-32">
            {/* Main Content Area */}
            <div id="products-section" className="mx-auto px-4 sm:px-8 max-w-7xl mt-24">

                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-primary">
                            {searchQuery ? `Search Results for "${searchQuery}"` : activeCategory !== 'All' ? activeCategory : 'Featured Selection'}
                        </h2>
                        <p className="text-accent mt-2 font-medium">Handpicked items for your lifestyle.</p>
                    </div>
                    {filteredProducts.length > 6 && (
                        <button className="text-sm font-semibold text-primary hover:text-accent flex items-center gap-2 transition-colors">
                            View All <ArrowRight size={16} />
                        </button>
                    )}
                </div>

                {/* Category Pills Block Removed */}
                {/* Notion-style Bento Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="py-20 text-center text-accent">No products found for this search.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.slice(0, 6).map((product, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                key={product.id}
                                onClick={() => navigate(`/product/${product.id}`)}
                                className={`group relative rounded-3xl p-6 flex flex-col overflow-hidden transition-all cursor-pointer ${product.isTrending
                                    ? 'bg-white border-2 border-[#d4af37]/50 hover:border-[#d4af37] shadow-[0_8px_30px_rgba(212,175,55,0.15)]'
                                    : 'bg-white border border-border/50 hover:border-border shadow-sm'
                                    }`}
                            >
                                {product.isTrending && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-r from-[#d4af37] to-[#e6c255] text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-bl-2xl flex items-center gap-1 z-20 shadow-sm">
                                        <Sparkles size={12} /> Prime Pick
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-6 z-10">
                                    <div className="flex-1 pr-4">
                                        <h3 className="font-bold text-lg text-primary leading-tight">{product.name}</h3>
                                        <p className="text-sm text-accent font-medium mt-1">{product.brand}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {product.discount && product.discount > 0 ? (
                                            <>
                                                <span className="bg-red-500 text-white px-2 py-0.5 rounded-md text-xs font-bold shadow-sm whitespace-nowrap">
                                                    {product.discount}% OFF
                                                </span>
                                                <span className="text-accent text-xs line-through font-medium">₹{product.price.toLocaleString('en-IN')}</span>
                                                <span className="bg-white px-3 py-1 rounded-full text-sm font-bold shadow-sm whitespace-nowrap">
                                                    ₹{Math.round(product.price * (1 - product.discount / 100)).toLocaleString('en-IN')}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="bg-white px-3 py-1 rounded-full text-sm font-bold shadow-sm whitespace-nowrap mt-1">
                                                ₹{product.price.toLocaleString('en-IN')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Image with Magnifier Effect (Allbirds inspired) */}
                                <div className="relative flex-1 min-h-[250px] rounded-2xl overflow-hidden cursor-zoom-in">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=random&color=fff&size=400`;
                                        }}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                                    />

                                    {/* Hover overlay hint */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                        <div className="bg-white/90 backdrop-blur-sm text-primary px-4 py-2 rounded-full font-bold text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                            View Details
                                        </div>
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
