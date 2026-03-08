import { createContext, useContext, useState, useEffect, useRef, ReactNode, useMemo } from 'react';
import { Product, initialProducts } from '../mockData';
import { getCachedCity } from '../hooks/useIpLocation';
import { playAlertSound, initAudio } from '../utils/surgeEventBus';
import { io } from 'socket.io-client';
import { useSocket } from '../hooks/useSocket';

const SOCKET_URL = 'http://localhost:5001'; // Standard localhost for local dev

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Order {
    id: string;
    date: string;
    items: CartItem[];
    total: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
    shippingAddress: string;
    city?: string;        // ← IP-detected city at order time
    regionName?: string;
}

export interface Notification {
    id: string;
    message: string;
    date: string;
    read: boolean;
    type: 'order' | 'cart' | 'alert';
}

/** Emitted whenever a buyer searches, adds to cart, or places an order */
export interface CityDemandEvent {
    id: string;
    city: string;
    regionName: string;
    lat: number;
    lon: number;
    productId: string;
    productName: string;
    qty: number;
    type: 'search' | 'cart' | 'order';
    timestamp: string;
    velocityLabel?: string;
    velocityCount?: number;
}

export interface Toast {
    id: string;
    title: string;
    message: string;
    type: 'surge' | 'trend' | 'info';
}

export interface PredictedSurge {
    id: string;
    productId: string;
    productName: string;
    city: string;
    heatScore: number;
    reason: string;
    timestamp: string;
}

interface StoreContextType {
    // Product State
    products: Product[];
    addProduct: (p: Product) => void;
    editProduct: (id: string, updates: Partial<Product>) => void;
    restockProduct: (id: string, amount: number) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    activeCategory: string;
    setActiveCategory: (cat: string) => void;

    // Cart State
    cart: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    cartItemCount: number;

    // Order State
    orders: Order[];
    placeOrder: (shippingAddress: string) => void;
    updateOrderStatus: (orderId: string, status: Order['status']) => void;

    // Notifications (Seller)
    notifications: Notification[];
    addNotification: (message: string, type: Notification['type']) => void;
    markNotificationsRead: () => void;
    clearNotifications: () => void;

    // Demand Events (buyer → seller live pipeline)
    cityDemandEvents: CityDemandEvent[];
    predictedSurges: PredictedSurge[];

    // Global UI State
    toast: Toast | null;
    setToast: (toast: Toast | null) => void;
    isAudioUnlocked: boolean;
    unlockAudio: () => void;

    // Activity Tracking
    trackProductView: (product: Product) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Fallback cities list for when IP detection hasn't run yet
const FALLBACK_CITIES = [
    { city: 'Mumbai', regionName: 'Maharashtra', lat: 19.076, lon: 72.877, ip: '192.168.1.1' },
    { city: 'Delhi', regionName: 'Delhi', lat: 28.613, lon: 77.209, ip: '192.168.1.2' },
    { city: 'Bengaluru', regionName: 'Karnataka', lat: 12.971, lon: 77.594, ip: '192.168.1.3' },
    { city: 'Chennai', regionName: 'Tamil Nadu', lat: 13.082, lon: 80.270, ip: '192.168.1.4' },
    { city: 'Hyderabad', regionName: 'Telangana', lat: 17.385, lon: 78.486, ip: '192.168.1.5' },
];

function getBuyerCity() {
    const cached = getCachedCity();
    // Use stored IP if present, otherwise default to localhost IP
    if (cached) return { ...cached, ip: (cached as any).ip || '127.0.0.1' };
    return FALLBACK_CITIES[Math.floor(Math.random() * FALLBACK_CITIES.length)];
}

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    // Initialize socket inside provider with singleton pattern
    const socket = useMemo(() => {
        console.log('🔌 Connecting to Socket.io at:', SOCKET_URL);
        return io(SOCKET_URL, {
            reconnectionAttempts: 5,
            timeout: 10000
        });
    }, []);

    useEffect(() => {
        console.log('✅ StoreProvider Mounted. SOCKET_URL:', SOCKET_URL);

        socket.on('connect', () => {
            console.log('📡 Socket Connected! (ID:', socket.id, ')');
        });

        socket.on('connect_error', (err) => {
            console.error('❌ Socket Connection Error:', err.message);
        });

        socket.on('reconnect', (attempt) => {
            console.log('🔄 Socket Reconnected after', attempt, 'attempts');
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);


    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [cityDemandEvents, setCityDemandEvents] = useState<CityDemandEvent[]>([]);
    const [predictedSurges, setPredictedSurges] = useState<PredictedSurge[]>([]);

    const [searchQueryInternal, setSearchQueryInternal] = useState('');
    const searchQuery = searchQueryInternal;
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout>>();
    const [activeCategory, setActiveCategory] = useState('All');

    // ── Surge tracking: per-product cart-add counters ──
    // Key: productId, Value: { count, preSurgeFired }
    const cartActivityRef = useRef<Record<string, { count: number; preSurgeFired: boolean }>>({});
    // Threshold: how many cart-adds before full surge alert fires
    const SURGE_THRESHOLD = 10; // full surge at 10 cart-adds per session
    // Pre-surge fires at 50% of SURGE_THRESHOLD

    const { trackActivity } = useSocket();

    // Track category changes
    useEffect(() => {
        if (activeCategory !== 'All') {
            trackActivity('view', activeCategory);
        }
    }, [activeCategory, trackActivity]);

    // Debounced setSearchQuery
    const setSearchQuery = (query: string) => {
        setSearchQueryInternal(query);
        clearTimeout(searchDebounceRef.current);

        if (query.length > 3) {
            trackActivity('search', activeCategory || 'All');
        }

        if (query.length < 3) return;
        searchDebounceRef.current = setTimeout(() => {
            const loc = getBuyerCity();

            // Map live pulse
            const evt: CityDemandEvent = {
                id: `${Date.now()}-search`, city: loc.city, regionName: loc.regionName, lat: loc.lat, lon: loc.lon,
                productId: 'search', productName: query, qty: 1, type: 'search', timestamp: new Date().toISOString(),
            };
            setCityDemandEvents(prev => [...prev, evt]);

            // Emit to Redis Backend
            if (socket.connected) {
                console.log('📤 Socket Emit: buyer_action (SEARCH)', query);
                socket.emit('buyer_action', {
                    productId: 'search',
                    productName: query,
                    type: 'SEARCH',
                    city: loc.city,
                    qty: 1
                });
            } else {
                console.warn('⚠️ Socket not connected, could not emit SEARCH action');
            }
        }, 500);
    };

    const [toast, setToast] = useState<Toast | null>(null);
    const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);

    const unlockAudio = () => {
        initAudio();
        setIsAudioUnlocked(true);
        playAlertSound('low'); // <--- Immediate feedback beep
    };

    // Listen for AI Surge Events from Redis Backend
    useEffect(() => {
        const handleSurge = (data: any) => {
            // Move from predicted to active if it was there
            setPredictedSurges(prev => prev.filter(p => p.productId !== data.productId));

            const notif: Notification = {
                id: Date.now().toString() + data.productId,
                message: `**🚀 ${data.reason}**\nProduct heat score surging (${data.heatScore} pts). Velocity: ${data.velocity}`,
                date: new Date().toISOString(), read: false, type: 'alert'
            };
            setNotifications(prev => [notif, ...prev]);

            setToast({
                id: Date.now().toString(),
                title: '🚀 VIRAL SURGE DETECTED!',
                message: data.reason,
                type: 'surge'
            });

            playAlertSound('high');
        };

        const handleTrending = (data: any) => {
            const prediction: PredictedSurge = {
                id: Date.now().toString() + data.productId,
                productId: data.productId,
                productName: data.productName || 'Unknown Product',
                city: data.city,
                heatScore: data.heatScore,
                reason: data.reason,
                timestamp: new Date().toISOString()
            };

            setPredictedSurges(prev => {
                // Keep only latest prediction for a product
                const filtered = prev.filter(p => p.productId !== data.productId);
                return [prediction, ...filtered].slice(0, 10);
            });

            const notif: Notification = {
                id: Date.now().toString() + data.productId + '_trend',
                message: `**📈 Early Warning: ${data.city}**\n${data.reason} (Heat: ${data.heatScore})`,
                date: new Date().toISOString(), read: false, type: 'alert'
            };
            setNotifications(prev => [notif, ...prev]);

            setToast({
                id: Date.now().toString(),
                title: '📈 Surge Prediction Alert',
                message: `${data.reason} in ${data.city}`,
                type: 'trend'
            });

            playAlertSound('medium');
        };

        socket.on('pre_viral_surge', handleSurge);
        socket.on('trending_surge', handleTrending);
        return () => {
            socket.off('pre_viral_surge', handleSurge);
            socket.off('trending_surge', handleTrending);
        };
    }, []);

    // Load from localStorage on mount
    useEffect(() => {
        const storedProducts = localStorage.getItem('ma_products');
        if (storedProducts) {
            const parsed = JSON.parse(storedProducts);
            // Merge any new products from mockData that aren't in localStorage yet
            const missingProducts = initialProducts.filter(ip => !parsed.some((p: Product) => p.id === ip.id));
            if (missingProducts.length > 0) {
                const updatedProducts = [...parsed, ...missingProducts];
                setProducts(updatedProducts);
                localStorage.setItem('ma_products', JSON.stringify(updatedProducts));
            } else {
                setProducts(parsed);
            }
        } else {
            setProducts(initialProducts);
            localStorage.setItem('ma_products', JSON.stringify(initialProducts));
        }

        const storedCart = localStorage.getItem('ma_cart');
        if (storedCart) setCart(JSON.parse(storedCart));

        const storedOrders = localStorage.getItem('ma_orders');
        if (storedOrders) setOrders(JSON.parse(storedOrders));

        const storedNotifications = localStorage.getItem('ma_notifications');
        if (storedNotifications) setNotifications(JSON.parse(storedNotifications));

        const storedEvents = localStorage.getItem('ma_city_events');
        if (storedEvents) setCityDemandEvents(JSON.parse(storedEvents));
    }, []);

    // ── Cross-tab real-time sync ──
    // When buyer tab writes to localStorage, seller tab picks it up instantly
    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'ma_city_events' && e.newValue) {
                setCityDemandEvents(JSON.parse(e.newValue));
            }
            if (e.key === 'ma_orders' && e.newValue) {
                setOrders(JSON.parse(e.newValue));
            }
            if (e.key === 'ma_notifications' && e.newValue) {
                setNotifications(JSON.parse(e.newValue));
            }
            if (e.key === 'ma_products' && e.newValue) {
                setProducts(JSON.parse(e.newValue));
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // Persist to localStorage
    useEffect(() => { if (products.length > 0) localStorage.setItem('ma_products', JSON.stringify(products)); }, [products]);
    useEffect(() => { localStorage.setItem('ma_cart', JSON.stringify(cart)); }, [cart]);
    useEffect(() => { localStorage.setItem('ma_orders', JSON.stringify(orders)); }, [orders]);
    useEffect(() => { localStorage.setItem('ma_notifications', JSON.stringify(notifications)); }, [notifications]);
    useEffect(() => {
        const trimmed = cityDemandEvents.slice(-50);
        localStorage.setItem('ma_city_events', JSON.stringify(trimmed));
    }, [cityDemandEvents]);

    /* ---------------- Product Actions ---------------- */
    const addProduct = (product: Product) => {
        setProducts(prev => [product, ...prev]);
        addNotification(`New product added: ${product.name}`, 'alert');
    };

    const editProduct = (id: string, updates: Partial<Product>) => {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
        addNotification(`Product updated.`, 'alert');
    };

    const restockProduct = (id: string, amount: number) => {
        setProducts(prev => prev.map(p => {
            if (p.id === id) {
                const newStock = p.stock + amount;
                return { ...p, stock: newStock, isLowStock: newStock < 10 };
            }
            return p;
        }));
        addNotification(`Restocked item ${id} by ${amount} units.`, 'alert');
    };

    const trackProductView = (product: Product) => {
        trackActivity('view', product.category, undefined, product.id, product.name, product.image, product.subcategory);
    };

    /* ---------------- Cart Actions ---------------- */
    const addToCart = (product: Product, quantity: number = 1) => {
        // Track the intent
        trackActivity('cart_add', product.category, undefined, product.id, product.name, product.image, product.subcategory);

        // ── Surge Threshold Tracking ──
        const tracker = cartActivityRef.current;
        if (!tracker[product.id]) {
            tracker[product.id] = { count: 0, preSurgeFired: false };
        }
        tracker[product.id].count += quantity;
        const currentCount = tracker[product.id].count;
        const halfThreshold = Math.floor(SURGE_THRESHOLD / 2);

        if (currentCount >= SURGE_THRESHOLD) {
            // 🔥 FULL SURGE ALERT
            const surgeNotif: Notification = {
                id: `surge-${product.id}-${Date.now()}`,
                message: `🚀 **SURGE ALERT: ${product.name}**\nThis product has been added to cart ${currentCount} times this session — demand is spiking! Consider restocking immediately.`,
                date: new Date().toISOString(),
                read: false,
                type: 'alert'
            };
            setNotifications(prev => [surgeNotif, ...prev]);
            setToast({
                id: Date.now().toString(),
                title: `🚀 SURGE ALERT: ${product.name}`,
                message: `Added to cart ${currentCount}× this session. Demand is at peak — restock now!`,
                type: 'surge'
            });
            playAlertSound('high');
            // Add to predicted surges panel
            const loc = getBuyerCity();
            setPredictedSurges(prev => {
                const filtered = prev.filter(p => p.productId !== product.id);
                return [{
                    id: `surge-pred-${product.id}-${Date.now()}`,
                    productId: product.id,
                    productName: product.name,
                    city: loc.city,
                    heatScore: Math.min(20, currentCount * 2),
                    reason: `Cart additions spiked to ${currentCount}× this session — full surge underway.`,
                    timestamp: new Date().toISOString()
                }, ...filtered].slice(0, 10);
            });
            // Reset counter so repeated buys continue to alert
            tracker[product.id] = { count: 0, preSurgeFired: false };

        } else if (currentCount >= halfThreshold && !tracker[product.id].preSurgeFired) {
            // ⚠️ PRE-SURGE WARNING (fires once at 50%)
            tracker[product.id].preSurgeFired = true;
            const warnNotif: Notification = {
                id: `pre-surge-${product.id}-${Date.now()}`,
                message: `⚠️ **Pre-Surge Warning: ${product.name}**\nAdded to cart ${currentCount} times — approaching surge threshold. Prepare inventory.`,
                date: new Date().toISOString(),
                read: false,
                type: 'alert'
            };
            setNotifications(prev => [warnNotif, ...prev]);
            setToast({
                id: Date.now().toString(),
                title: `⚠️ Going to Surge: ${product.name}`,
                message: `Cart adds: ${currentCount}/${SURGE_THRESHOLD}. Demand building — surge incoming soon!`,
                type: 'trend'
            });
            playAlertSound('medium');
        }

        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                const newQuantity = Math.min(existing.quantity + quantity, product.stock);
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: newQuantity } : item);
            }
            return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
        });

        // ── Option A: bump product's today's sales in salesHistory ──
        setProducts(prev => prev.map(p => {
            if (p.id !== product.id) return p;
            const today = new Date().toISOString().split('T')[0];
            const history = [...(p.salesHistory || [])];
            const todayIdx = history.findIndex(h => h.date === today);
            if (todayIdx >= 0) {
                history[todayIdx] = { ...history[todayIdx], sales: history[todayIdx].sales + quantity };
            } else {
                history.push({ date: today, sales: quantity });
            }
            const totalRecent = history.slice(-3).reduce((s, h) => s + h.sales, 0);
            return {
                ...p,
                salesHistory: history,
                isTrending: totalRecent > 50,
            };
        }));

        // Map live pulse event
        const loc = getBuyerCity();
        const event: CityDemandEvent = {
            id: `${Date.now()}-cart`, city: loc.city, regionName: loc.regionName,
            lat: loc.lat, lon: loc.lon, productId: product.id, productName: product.name,
            qty: quantity, type: 'cart', timestamp: new Date().toISOString(),
        };
        setCityDemandEvents(prev => [...prev, event]);

        // Emit to Redis Backend
        if (socket.connected) {
            console.log('📤 Socket Emit: buyer_action (CART_ADD)', product.name);
            socket.emit('buyer_action', {
                productId: product.id,
                productName: product.name,
                type: 'CART_ADD',
                city: loc.city,
                qty: quantity
            });
        } else {
            console.warn('⚠️ Socket not connected, could not emit CART_ADD action');
        }
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const updateCartQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) { removeFromCart(productId); return; }
        setCart(prev => prev.map(item =>
            item.product.id === productId
                ? { ...item, quantity: Math.min(quantity, item.product.stock) }
                : item
        ));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

    /* ---------------- Order Actions ---------------- */
    const placeOrder = (shippingAddress: string) => {
        if (cart.length === 0) return;

        const loc = getBuyerCity();

        const newOrder: Order = {
            id: `ORD-${Date.now()}`,
            date: new Date().toISOString(),
            items: [...cart],
            total: cartTotal,
            status: 'Pending',
            shippingAddress,
            city: loc.city,
            regionName: loc.regionName,
        };
        setOrders(prev => [newOrder, ...prev]);

        // Deduct stock & update salesHistory for orders (heavier weight)
        setProducts(prev => prev.map(p => {
            const cartItem = cart.find(ci => ci.product.id === p.id);
            if (!cartItem) return p;

            const newStock = p.stock - cartItem.quantity;
            const today = new Date().toISOString().split('T')[0];
            const history = [...(p.salesHistory || [])];
            const todayIdx = history.findIndex(h => h.date === today);
            if (todayIdx >= 0) {
                history[todayIdx] = { ...history[todayIdx], sales: history[todayIdx].sales + cartItem.quantity };
            } else {
                history.push({ date: today, sales: cartItem.quantity });
            }
            const totalRecent = history.slice(-3).reduce((s, h) => s + h.sales, 0);
            return {
                ...p,
                stock: newStock,
                isLowStock: newStock < 10,
                salesHistory: history,
                isTrending: totalRecent > 50,
            };
        }));

        // Map live pulse events
        const newEvents: CityDemandEvent[] = cart.map(ci => ({
            id: `${Date.now()}-order-${ci.product.id}`,
            city: loc.city, regionName: loc.regionName, lat: loc.lat, lon: loc.lon,
            productId: ci.product.id, productName: ci.product.name,
            qty: ci.quantity, type: 'order' as const, timestamp: new Date().toISOString(),
        }));
        setCityDemandEvents(prev => [...prev, ...newEvents]);

        // Emit order to Backend (for analytics, though Surge relies primarily on CART/SEARCH velocity)
        if (socket.connected) {
            cart.forEach(item => {
                console.log('📤 Socket Emit: buyer_action (ORDER)', item.product.name);
                socket.emit('buyer_action', {
                    productId: item.product.id,
                    productName: item.product.name,
                    type: 'ORDER',
                    city: loc.city,
                    qty: item.quantity
                });
            });
        } else {
            console.warn('⚠️ Socket not connected, could not emit ORDER actions');
        }

        clearCart();
    };

    const updateOrderStatus = (orderId: string, status: Order['status']) => {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    };

    /* ---------------- Notification Actions ---------------- */
    const addNotification = (message: string, type: Notification['type']) => {
        const newNotif: Notification = {
            id: Date.now().toString(),
            message,
            date: new Date().toISOString(),
            read: false,
            type,
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markNotificationsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearNotifications = () => { setNotifications([]); };

    return (
        <StoreContext.Provider value={{
            products, addProduct, editProduct, restockProduct, searchQuery, setSearchQuery, activeCategory, setActiveCategory,
            cart, addToCart, removeFromCart, updateCartQuantity, clearCart, cartTotal, cartItemCount,
            orders, placeOrder, updateOrderStatus,
            notifications, addNotification, markNotificationsRead, clearNotifications,
            cityDemandEvents,
            predictedSurges,
            toast,
            setToast,
            isAudioUnlocked,
            unlockAudio,
            trackProductView
        }}>
            {children}
        </StoreContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStore = () => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        console.error('❌ useStore error: Provider not found in tree!');
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
};
