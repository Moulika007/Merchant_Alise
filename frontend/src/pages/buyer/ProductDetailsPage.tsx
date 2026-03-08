import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import {
    ArrowLeft,
    Star,
    Minus,
    Plus,
    ShoppingBag,
    ShieldCheck,
    Truck,
    RefreshCcw
} from 'lucide-react';

export default function ProductDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { products, addToCart, placeOrder } = useStore();
    const { user } = useAuth();

    const product = products.find(p => p.id === id);

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);

    if (!product) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center">
                <h2 className="text-3xl font-bold mb-4 text-primary">Product Not Found</h2>
                <p className="text-accent mb-8">The item you are looking for might have been removed or discontinued.</p>
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-muted transition-colors"
                >
                    <ArrowLeft size={18} /> Back to Shop
                </button>
            </div>
        );
    }

    const allImages = product.images && product.images.length > 0
        ? product.images
        : [product.image];

    const discountedPrice = product.discount && product.discount > 0
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;

    const handleAddToCart = () => {
        if (!user) {
            navigate('/auth');
            return;
        }
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert("Please select a size first.");
            return;
        }
        addToCart(product, quantity);
    };

    const handleBuyNow = () => {
        if (!user) {
            navigate('/auth');
            return;
        }
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            alert("Please select a size first.");
            return;
        }
        addToCart(product, quantity);
        placeOrder("Buyer Default Address"); // Using a dummy address for demo
        navigate('/buyer/orders');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 lg:py-24 animate-fade-in">
            {/* Breadcrumb / Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-accent hover:text-primary font-semibold mb-8 transition-colors"
            >
                <ArrowLeft size={18} /> Back
            </button>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                {/* Image Gallery - Left Side */}
                <div className="w-full lg:w-1/2 flex flex-col gap-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-border"
                    >
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={selectedImage}
                                src={allImages[selectedImage]}
                                alt={product.name}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="w-full h-full object-cover"
                            />
                        </AnimatePresence>
                    </motion.div>

                    {/* Thumbnails */}
                    {allImages.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {allImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative w-24 aspect-square rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${selectedImage === idx ? 'border-primary opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info - Right Side */}
                <div className="w-full lg:w-1/2 flex flex-col">
                    <div className="mb-8">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-muted px-3 py-1 rounded-full text-xs font-bold text-accent uppercase tracking-wider">
                                {product.brand}
                            </span>
                            {product.tag && (
                                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {product.tag}
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold text-primary tracking-tight leading-tight mb-4 font-outfit">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star fill="currentColor" size={20} />
                                <span className="font-bold text-primary ml-1">{product.rating}</span>
                            </div>
                            {product.reviews && product.reviews.length > 0 && (
                                <span className="text-accent text-sm font-medium underline decoration-accent/30 cursor-pointer">
                                    Read {product.reviews.length} reviews
                                </span>
                            )}
                        </div>

                        <div className="flex items-end gap-3">
                            <span className="text-4xl font-bold tracking-tight text-primary">
                                ₹{discountedPrice.toLocaleString('en-IN')}
                            </span>
                            {product.discount && product.discount > 0 && (
                                <>
                                    <span className="text-xl text-accent line-through font-semibold mb-1">
                                        ₹{product.price.toLocaleString('en-IN')}
                                    </span>
                                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold mb-2">
                                        {product.discount}% OFF
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-border my-6" />

                    {/* Description */}
                    <div className="prose prose-sm sm:prose-base text-accent mb-8">
                        <p>{product.description}</p>
                    </div>

                    {/* Sizes (If applicable) */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-primary">Select Size</h3>
                                <span className="text-sm font-medium text-accent underline cursor-pointer hover:text-primary">Size Guide</span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-6 py-3 rounded-xl font-bold border-2 transition-all ${selectedSize === size ? 'border-primary bg-primary text-white shadow-md' : 'border-border text-primary hover:border-primary/50'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity & Buy Actions */}
                    <div className="flex flex-col gap-4 mt-auto">
                        <div className="flex items-center justify-between bg-white border border-border rounded-xl p-2 w-full max-w-[160px]">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-2 hover:bg-muted rounded-lg text-primary transition-colors disabled:opacity-50"
                                disabled={quantity <= 1}
                            >
                                <Minus size={20} />
                            </button>
                            <span className="font-bold text-lg w-12 text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                className="p-2 hover:bg-muted rounded-lg text-primary transition-colors disabled:opacity-50"
                                disabled={quantity >= product.stock}
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        <p className={`text-sm font-medium ${product.stock < 10 ? 'text-orange-500' : 'text-green-600'}`}>
                            {product.stock > 0 ? `${product.stock} items left in stock` : 'Out of Stock'}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 bg-white border-2 border-primary text-primary py-4 rounded-2xl font-bold text-lg hover:bg-muted transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <ShoppingBag size={20} /> Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-muted transition-colors shadow-lg shadow-black/10 disabled:opacity-50"
                            >
                                Buy It Now
                            </button>
                        </div>
                    </div>

                    {/* Value Props */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 bg-white p-6 rounded-3xl border border-border shadow-sm">
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-primary">
                                <Truck size={24} />
                            </div>
                            <h4 className="font-bold text-sm">Free Shipping</h4>
                            <p className="text-xs text-accent">On orders over ₹5,000</p>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-primary">
                                <RefreshCcw size={24} />
                            </div>
                            <h4 className="font-bold text-sm">Easy Returns</h4>
                            <p className="text-xs text-accent">30-day return policy</p>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-primary">
                                <ShieldCheck size={24} />
                            </div>
                            <h4 className="font-bold text-sm">Secure Checkout</h4>
                            <p className="text-xs text-accent">256-bit encryption</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            {product.reviews && product.reviews.length > 0 && (
                <div className="mt-24 border-t border-border pt-16">
                    <h2 className="text-3xl font-bold text-primary mb-12 text-center">Customer Reviews</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {product.reviews.map((r, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl border border-border shadow-sm flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-1 text-yellow-500">
                                        {[...Array(5)].map((_, j) => (
                                            <Star key={j} fill={j < r.rating ? "currentColor" : "none"} size={16} />
                                        ))}
                                    </div>
                                    <span className="text-xs font-medium text-accent">{r.date}</span>
                                </div>
                                <h4 className="font-bold text-primary mb-2">{r.user}</h4>
                                <p className="text-accent text-sm leading-relaxed">{r.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
