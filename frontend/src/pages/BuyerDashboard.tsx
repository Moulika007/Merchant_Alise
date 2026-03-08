import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Settings, User } from 'lucide-react';
import BuyerOrdersPage from './buyer/BuyerOrdersPage';

// Placeholder Settings Page
function BuyerSettingsPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Profile & Settings</h2>
            <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
                <p className="text-accent mb-4">Manage your account details and shipping addresses.</p>
                <div className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-bold text-primary mb-1">Full Name</label>
                        <input type="text" defaultValue="Guest User" className="w-full bg-muted border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-1">Email</label>
                        <input type="email" defaultValue="guest@example.com" className="w-full bg-muted border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-primary mb-1">Default Address</label>
                        <textarea defaultValue="123 Shopping Lane, Commerce City, IN" className="w-full bg-muted border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none resize-none" rows={3}></textarea>
                    </div>
                </div>
                <button className="mt-6 bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors">Save Changes</button>
            </div>
        </div>
    );
}

// Placeholder Overview Page
function BuyerOverviewPage() {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-border rounded-3xl min-h-[50vh]">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-primary mb-6">
                <User size={40} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to your hub</h2>
            <p className="text-accent">From here you can track your recent orders or update your profile details using the sidebar.</p>
        </div>
    );
}

export default function BuyerDashboard() {
    const location = useLocation();

    const navItems = [
        { path: '/buyer', label: 'Overview', icon: <User size={20} /> },
        { path: '/buyer/orders', label: 'My Orders', icon: <ShoppingBag size={20} /> },
        { path: '/buyer/settings', label: 'Settings', icon: <Settings size={20} /> },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 flex flex-col md:flex-row gap-8 animate-fade-in">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 shrink-0">
                <div className="bg-white rounded-3xl p-6 border border-border shadow-sm sticky top-24">
                    <h2 className="font-bold text-lg mb-6 px-4">Buyer Account</h2>
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path || (item.path !== '/buyer' && location.pathname.startsWith(item.path));
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${isActive
                                        ? 'bg-primary text-white shadow-md'
                                        : 'text-accent hover:bg-muted hover:text-primary'
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
                <motion.div
                    key={location.pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Routes>
                        <Route index element={<BuyerOverviewPage />} />
                        <Route path="orders" element={<BuyerOrdersPage />} />
                        <Route path="settings" element={<BuyerSettingsPage />} />
                    </Routes>
                </motion.div>
            </main>
        </div>
    );
}
