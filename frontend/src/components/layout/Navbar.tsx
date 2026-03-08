import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { mockCategories } from '../../mockData';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, role, logout } = useAuth();
    const { cartItemCount, searchQuery, setSearchQuery, activeCategory, setActiveCategory } = useStore();

    const isSellerMenu = location.pathname.includes('/seller');
    const [hoverCategory, setHoverCategory] = useState<string | null>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (location.pathname !== '/store') {
            navigate('/store');
        }
    };

    const handleCategoryClick = (catName: string) => {
        setActiveCategory(catName);
        setHoverCategory(null);
        if (location.pathname !== '/store') {
            navigate('/store');
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border transition-all duration-300">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Main Section */}
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 text-primary hover:bg-muted transition-colors rounded-xl">
                            <Menu size={20} />
                        </button>
                        <Link to="/" onClick={() => setActiveCategory('All')} className="flex items-center space-x-2 group">
                            <div className="bg-primary text-white p-1.5 rounded-xl group-hover:bg-accent transition-colors">
                                <ShoppingBag size={18} strokeWidth={2.5} />
                            </div>
                            <span className="font-brand font-semibold text-2xl tracking-tight text-primary">Merchant Aisle</span>
                        </Link>
                    </div>

                    {/* Mega Menu Navigation */}
                    {!isSellerMenu ? (
                        <div className="hidden md:flex items-center justify-center space-x-2 h-full">
                            {mockCategories.map((cat) => (
                                <div
                                    key={cat.name}
                                    className={`h-full flex items-center group relative px-4 border-b-2 transition-all cursor-pointer ${activeCategory === cat.name ? 'border-primary text-black' : 'border-transparent hover:border-primary text-primary'}`}
                                    onMouseEnter={() => setHoverCategory(cat.name)}
                                    onMouseLeave={() => setHoverCategory(null)}
                                >
                                    <span className="text-sm font-medium tracking-wide flex items-center gap-1 py-5 transition-colors group-hover:text-black" onClick={() => handleCategoryClick(cat.name)}>
                                        {cat.name}
                                    </span>

                                    {hoverCategory === cat.name && (
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-[480px] bg-white border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-b-2xl p-8 z-50 grid grid-cols-2 gap-8 before:absolute before:inset-x-0 before:-top-4 before:h-4 before:bg-transparent">
                                            <div>
                                                <h4 className="text-xs font-bold text-accent uppercase tracking-widest mb-4 pb-2 border-b border-border/50 flex items-center justify-between">
                                                    Featured <ChevronRight size={14} />
                                                </h4>
                                                <ul className="space-y-3">
                                                    {cat.subcategories.slice(0, Math.ceil(cat.subcategories.length / 2)).map(sub => (
                                                        <li key={sub}>
                                                            <button onClick={() => handleCategoryClick(sub)} className="text-sm font-medium text-primary/80 hover:text-primary hover:translate-x-1 transition-all inline-block">
                                                                {sub}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-accent uppercase tracking-widest mb-4 pb-2 border-b border-border/50 flex items-center justify-between">
                                                    Popular <ChevronRight size={14} />
                                                </h4>
                                                <ul className="space-y-3">
                                                    {cat.subcategories.slice(Math.ceil(cat.subcategories.length / 2)).map(sub => (
                                                        <li key={sub}>
                                                            <button onClick={() => handleCategoryClick(sub)} className="text-sm font-medium text-primary/80 hover:text-primary hover:translate-x-1 transition-all inline-block">
                                                                {sub}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : null}

                    {/* Actions & Utilities */}
                    <div className="flex items-center space-x-4">
                        {!isSellerMenu && (
                            <div className="hidden lg:flex items-center bg-muted px-4 py-2 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                <Search size={16} className="text-accent mr-3" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="bg-transparent text-sm w-48 outline-none placeholder:text-accent font-medium text-primary"
                                />
                            </div>
                        )}

                        {!isSellerMenu && (
                            <button className="text-primary hover:bg-muted transition-colors lg:hidden p-2 rounded-xl">
                                <Search size={20} />
                            </button>
                        )}

                        {user ? (
                            <div className="flex items-center gap-4 border-l border-border pl-4">
                                <div className="flex flex-col items-end hidden sm:flex">
                                    <Link to={role === 'buyer' ? "/buyer/orders" : "/seller"} className="text-sm font-semibold text-primary hover:underline">{user.name}</Link>
                                    <span className="text-[10px] font-medium text-accent uppercase tracking-widest">{role}</span>
                                </div>
                                <button onClick={() => { logout(); navigate('/'); }} className="p-2 text-primary hover:bg-muted rounded-xl transition-colors" title="Log out">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/auth" className="flex items-center gap-2 text-primary hover:bg-muted transition-colors px-3 py-2 rounded-xl border-l border-border ml-2 group">
                                <User size={18} className="group-hover:scale-110 transition-transform" />
                                <span className="hidden lg:block text-sm font-medium">Log in</span>
                            </Link>
                        )}

                        {!isSellerMenu && (
                            <Link to="/cart" className="relative flex items-center justify-center text-primary hover:bg-muted transition-colors p-2 rounded-xl group border border-border">
                                <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Seller Portal Notification Band */}
            {role === 'seller' && (
                <div className="w-full bg-muted py-1.5 border-b border-border flex justify-center text-xs font-medium tracking-wide text-primary">
                    <Link to={isSellerMenu ? "/" : "/seller"} className="flex items-center gap-2 hover:text-accent transition-colors">
                        {isSellerMenu ? "← Return to Storefront" : "Access Command Center →"}
                    </Link>
                </div>
            )}
        </nav>
    );
}
