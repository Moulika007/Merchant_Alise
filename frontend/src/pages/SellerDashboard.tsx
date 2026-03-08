import { type ElementType, useEffect } from 'react';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Store, ClipboardList, Settings, TrendingUp, Bell, Map, BarChart3, X, Volume2, VolumeX, AlertTriangle, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';

import AnalyticsPage from './seller/AnalyticsPage';
import InventoryPage from './seller/InventoryPage';
import SellerOrdersPage from './seller/SellerOrdersPage';
import ProductDemandPage from './seller/ProductDemandPage';
import RegionalInsightsPage from './seller/RegionalInsightsPage';
import SurgeAnalysisPage from './seller/SurgeAnalysisPage';
import SurgeAlertModal from '../components/dashboard/SurgeAlertModal';
import { useSocket } from '../hooks/useSocket';
import { Activity } from 'lucide-react';

// Main layout wrapper for the seller dashboard
export default function SellerDashboard() {
    const location = useLocation();
    const { notifications, clearNotifications, toast, setToast, isAudioUnlocked, unlockAudio } = useStore();

    // Auto-dismiss toast after 5 seconds
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [toast, setToast]);

    const { lastSurge, setLastSurge } = useSocket();

    // Handle incoming surge alerts
    useEffect(() => {
        if (lastSurge) {
            // Add to persistent notifications too
            setToast({
                title: lastSurge.message,
                message: lastSurge.explanation,
                type: 'surge'
            });
        }
    }, [lastSurge, setToast]);

    const navItems: { path: string; name: string; icon: ElementType; isSubItem?: boolean }[] = [
        { path: '', name: 'Overview', icon: LayoutDashboard },
        { path: 'inventory', name: 'Inventory', icon: Store },
        { path: 'orders', name: 'Orders', icon: ClipboardList },
        { path: 'product-demand', name: 'Product Demand', icon: BarChart3, isSubItem: true },
        { path: 'regional-insights', name: 'Regional Insights', icon: Map, isSubItem: true },
        { path: 'surge-analysis', name: 'Global Surge Analysis', icon: Activity },
        { path: 'settings', name: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-84px)] mt-20 bg-muted relative">

            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-white border-r border-border shrink-0 p-6 flex flex-col gap-8 md:sticky top-20 h-fit md:h-[calc(100vh-80px)] z-10">
                <div className="flex items-center gap-3 px-2">
                    <div className="bg-primary text-white p-2 rounded-xl shadow-sm">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-primary text-lg leading-tight font-outfit">Seller Central</h2>
                        <p className="text-xs text-accent font-medium">Merchant Aisle</p>
                    </div>
                </div>

                <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                    {navItems.map((item) => {
                        const targetPath = `/seller${item.path ? `/${item.path}` : ''}`;
                        const isActive = location.pathname === targetPath || (item.path === '' && location.pathname === '/seller');

                        if (item.isSubItem) {
                            return (
                                <Link
                                    key={item.name}
                                    to={targetPath}
                                    className={`flex items-center gap-2 ml-6 pl-3 pr-4 py-2 rounded-lg border-l-2 text-xs font-semibold transition-all whitespace-nowrap ${isActive
                                        ? 'border-primary text-primary bg-primary/5'
                                        : 'border-border text-accent hover:text-primary hover:border-primary/50 hover:bg-muted'
                                        }`}
                                >
                                    <item.icon size={14} />
                                    {item.name}
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                to={targetPath}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${isActive
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-accent hover:bg-muted hover:text-primary'
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sound Unlock Button */}
                <div className="mt-auto pt-6 border-t border-border">
                    <button
                        onClick={unlockAudio}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all ${isAudioUnlocked
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default'
                            : 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 animate-pulse'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {isAudioUnlocked ? <Volume2 size={16} /> : <VolumeX size={16} />}
                            <span>{isAudioUnlocked ? 'Audio Active' : 'Enable Audio'}</span>
                        </div>
                        {!isAudioUnlocked && <div className="w-2 h-2 bg-amber-500 rounded-full" />}
                    </button>
                    {!isAudioUnlocked && (
                        <p className="text-[10px] text-accent mt-2 px-1 leading-tight">
                            Click to unlock real-time beep alerts for surges.
                        </p>
                    )}
                </div>

                {/* Test Data Buttons */}
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                    <button
                        onClick={() => {
                            const locations = ['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Kolkata'];
                            const categories = ['Computers & Tech', 'Home & Kitchen', 'Fashion', 'Health'];
                            const loc = locations[Math.floor(Math.random() * locations.length)];
                            const cat = categories[Math.floor(Math.random() * categories.length)];
                            const growth = Math.floor(Math.random() * 300) + 100;
                            const time = Math.floor(Math.random() * 5) + 2;

                            setLastSurge({
                                id: 'TEST-' + Date.now(),
                                type: 'surge-alert',
                                location: loc,
                                category: cat,
                                growth: growth,
                                timeFrame: time,
                                message: `Sudden Surge in ${cat}!`,
                                explanation: `Surge triggered due to ${growth}% search growth in ${loc} within last ${time} minutes.`,
                                timestamp: new Date().toISOString()
                            });
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-primary/20 text-primary rounded-xl text-xs font-bold hover:bg-primary/5 transition-colors"
                    >
                        <TrendingUp size={14} /> Simulate Surge
                    </button>
                </div>

            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto w-full relative">

                {/* Global Toast Overlay */}
                <AnimatePresence>
                    {toast && (
                        <motion.div
                            initial={{ opacity: 0, y: -50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4"
                        >
                            <div className={`shadow-2xl rounded-2xl p-4 border flex items-start gap-4 ${toast.type === 'surge'
                                ? 'bg-primary text-white border-white/20'
                                : 'bg-white text-primary border-border'
                                }`}>
                                <div className={`p-2 rounded-xl shrink-0 ${toast.type === 'surge' ? 'bg-amber-400 text-primary shadow-sm' : 'bg-primary/10'}`}>
                                    {toast.type === 'surge' ? <Zap size={20} fill="currentColor" /> : <AlertTriangle size={20} className="text-amber-500" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h5 className="font-black text-sm uppercase tracking-tight">{toast.title}</h5>
                                    <p className={`text-xs mt-0.5 line-clamp-2 ${toast.type === 'surge' ? 'text-white/80' : 'text-accent'}`}>{toast.message}</p>
                                </div>
                                <button
                                    onClick={() => setToast(null)}
                                    className="p-1 hover:bg-black/5 rounded-lg transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Notification Panel */}
                {notifications.length > 0 && (
                    <div className="absolute top-6 right-6 z-50 bg-white border border-border shadow-lg rounded-2xl p-4 w-80">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-sm flex items-center gap-2"><Bell size={14} /> Recent Alerts</h4>
                            <button onClick={clearNotifications} className="text-xs text-accent hover:text-primary border border-border px-2 py-1 rounded">Dismiss All</button>
                        </div>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                            {notifications.map(n => {
                                const isSurgeAlert = n.message.includes('**');
                                const title = isSurgeAlert ? n.message.split('\n')[0].replace(/\*\*/g, '') : '';
                                const body = isSurgeAlert ? n.message.split('\n').slice(1).join('\n') : n.message;

                                return (
                                    <div key={n.id} className={`text-sm border-l-2 pl-3 py-1 ${isSurgeAlert ? 'border-amber-500 bg-amber-50/50 rounded-r-lg' : 'border-primary'}`}>
                                        {isSurgeAlert && <p className="font-bold text-amber-700 mb-0.5">{title}</p>}
                                        <p className={`${isSurgeAlert ? 'text-amber-900 leading-snug text-xs' : 'text-primary font-medium'}`}>{body}</p>
                                        <p className="text-[10px] text-accent mt-1">{new Date(n.date).toLocaleTimeString()}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-6xl mx-auto"
                >
                    <Routes>
                        <Route path="" element={<AnalyticsPage />} />
                        <Route path="inventory" element={<InventoryPage />} />
                        <Route path="orders" element={<SellerOrdersPage />} />
                        <Route path="product-demand" element={<ProductDemandPage />} />
                        <Route path="regional-insights" element={<RegionalInsightsPage />} />
                        <Route path="surge-analysis" element={<SurgeAnalysisPage />} />
                        <Route path="settings" element={
                            <div className="space-y-6 animate-fade-in">
                                <h2 className="text-2xl font-bold text-primary font-outfit">Store Settings</h2>
                                <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
                                    <p className="text-accent mb-6">Manage your merchant account details and store appearance.</p>
                                    <div className="space-y-4 max-w-xl">
                                        <div>
                                            <label className="block text-sm font-bold text-primary mb-1">Store Name</label>
                                            <input type="text" defaultValue="Merchant Aisle" className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-primary mb-1">Business Email</label>
                                            <input type="email" defaultValue="seller@merchantaisle.com" className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-primary mb-1">Store Location</label>
                                            <input type="text" defaultValue="Mumbai, India" className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-primary mb-1">Store Description</label>
                                            <textarea defaultValue="Curated essentials for the modern professional." className="w-full bg-muted border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none text-sm" rows={4}></textarea>
                                        </div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-border flex justify-end">
                                        <button className="bg-primary text-white font-bold py-3 px-8 rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
                                            Save Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        } />
                    </Routes>
                </motion.div>
            </main>

            {/* Surge Alert Pop-up Modal */}
            <SurgeAlertModal
                alert={lastSurge}
                onClose={() => setLastSurge(null)}
            />
        </div>
    );
}
