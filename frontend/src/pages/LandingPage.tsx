import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const slides = [
    {
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
        title: 'Minimalist Essentials',
        subtitle: 'Curated for the modern professional. Form meets ultimate function.'
    },
    {
        image: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=2049&auto=format&fit=crop',
        title: 'The New Workspace',
        subtitle: 'Elevate your environment with our latest collection.'
    },
    {
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
        title: 'Audio Perfection',
        subtitle: 'Experience sound like never before with high-fidelity acoustics.'
    }
];

export default function LandingPage() {
    const navigate = useNavigate();
    const { products, setActiveCategory, setSearchQuery } = useStore();
    const [currentSlide, setCurrentSlide] = useState(0);

    // Get 3 attractive/trending products
    const featuredProducts = products.filter(p => p.isTrending).slice(0, 3);
    if (featuredProducts.length < 3) {
        featuredProducts.push(...products.filter(p => !p.isTrending).slice(0, 3 - featuredProducts.length));
    }

    // Auto-advance slideshow
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-muted flex flex-col items-center pt-24 px-4 pb-20 w-full overflow-x-hidden">
            <div className="w-full max-w-7xl flex flex-col gap-32">

                {/* 1. Hero Slideshow (Top Row) */}
                <section className="relative w-full h-[85vh] overflow-hidden bg-muted rounded-3xl shadow-2xl group">
                    <AnimatePresence mode="popLayout">
                        <motion.img
                            key={currentSlide}
                            src={slides[currentSlide].image}
                            alt="Hero Background"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </AnimatePresence>

                    <div className="absolute inset-0 bg-black/20" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                        <motion.div
                            key={`text-${currentSlide}`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="max-w-3xl"
                        >
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 font-outfit drop-shadow-lg leading-tight">
                                {slides[currentSlide].title}
                            </h1>
                            <p className="text-lg md:text-2xl font-medium mb-10 text-white/90 drop-shadow-md">
                                {slides[currentSlide].subtitle}
                            </p>
                            <button
                                onClick={() => {
                                    setActiveCategory('All');
                                    setSearchQuery('');
                                    navigate('/store');
                                }}
                                className="bg-white text-primary px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-muted transition-colors flex items-center gap-2 mx-auto shadow-lg"
                            >
                                Shop Collection <ArrowRight size={16} />
                            </button>
                        </motion.div>
                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className={`w-2 h-2 rounded-full transition-all ${i === currentSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                            />
                        ))}
                    </div>
                </section>

                {/* 2. Curated Highlights & Products (Middle Row) */}
                <div className="w-full">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4">Curated Highlights</h2>
                        <p className="text-lg text-accent max-w-2xl mx-auto">Discover pieces that elevate your everyday experience, perfectly balancing form and function.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredProducts.map((product, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                key={product.id}
                                onClick={() => {
                                    navigate(`/store`);
                                    navigate(`/product/${product.id}`);
                                }}
                                className="group relative rounded-3xl p-6 flex flex-col overflow-hidden transition-all cursor-pointer bg-gradient-to-br from-[#FFFcf0] to-[#f7eed2] border-2 border-[#d4af37]/50 hover:border-[#d4af37] shadow-lg hover:shadow-xl"
                            >
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-[#d4af37] to-[#e6c255] text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-bl-2xl flex items-center gap-1 z-20 shadow-sm">
                                    <Sparkles size={12} /> Bestseller
                                </div>

                                <div className="flex justify-between items-start mb-6 z-10">
                                    <div className="flex-1 pr-4">
                                        <h3 className="font-bold text-xl text-primary leading-tight">{product.name}</h3>
                                        <p className="text-sm text-accent font-medium mt-1">{product.brand}</p>
                                    </div>
                                </div>

                                <div className="relative flex-1 min-h-[300px] rounded-2xl overflow-hidden cursor-zoom-in">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.src = `https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800`;
                                        }}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                        <div className="bg-white/90 backdrop-blur-sm text-primary px-6 py-3 rounded-full font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                            View Details
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 3. Feature Callout (Bottom Row) */}
                <div className="w-full mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-primary text-white rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl"
                    >
                        <div className="max-w-xl">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Designed for clarity. Built for performance.</h2>
                            <p className="text-white/70 text-lg mb-8">Experience a seamless shopping journey with our intuitive interface and lightning-fast storefront.</p>
                            <button
                                onClick={() => {
                                    setActiveCategory('All');
                                    setSearchQuery('');
                                    navigate('/store');
                                }}
                                className="bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-muted transition-colors flex items-center gap-2"
                            >
                                Explore Collections <ArrowRight size={16} />
                            </button>
                        </div>
                        <div className="w-full md:w-1/3 aspect-square bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                            <Search size={64} className="text-white/50" />
                        </div>
                    </motion.div>
                </div>

            </div>
        </div>
    );
}
