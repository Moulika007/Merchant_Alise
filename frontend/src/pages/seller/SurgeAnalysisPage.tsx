import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Globe, AlertTriangle, Activity, Package } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import { useStore } from '../../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';
import MarketIntelligenceChat from '../../components/dashboard/MarketIntelligenceChat';


// Precise coordinates for placing dots on the India SVG path (matching 500x600 viewBox)
const indiaCityCoords = [
    { name: 'Delhi', x: 245, y: 130 },
    { name: 'Mumbai', x: 135, y: 340 },
    { name: 'Bangalore', x: 205, y: 475 },
    { name: 'Chennai', x: 260, y: 490 },
    { name: 'Hyderabad', x: 240, y: 365 },
    { name: 'Kolkata', x: 425, y: 275 },
];

export default function SurgeAnalysisPage() {
    const { lastSurge } = useSocket();
    const { products } = useStore();
    const locationState = useLocation().state as { productName?: string, location?: string } | null;

    // Select the first product by default, or fallback to a placeholder
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [selectedCity, setSelectedCity] = useState<string | null>(null);

    // Auto-select based on router state (from clicking Explore Reason on modal)
    useEffect(() => {
        if (products.length > 0) {
            let targetProductId = products[0].id;

            if (locationState?.productName) {
                const matchedProduct = products.find(p => p.name.toLowerCase() === locationState.productName?.toLowerCase());
                if (matchedProduct) targetProductId = matchedProduct.id;
            }

            if (!selectedProductId || selectedProductId !== targetProductId) {
                setSelectedProductId(targetProductId);
            }

            if (locationState?.location && selectedCity !== locationState.location) {
                // Short delay to allow map data to generate before selecting city
                setTimeout(() => setSelectedCity(locationState.location as string), 100);
            }
        }
    }, [products, locationState, selectedProductId, selectedCity]);

    // Get the currently selected product details
    const activeProduct = useMemo(() => products.find(p => p.id === selectedProductId), [products, selectedProductId]);

    // Generate dynamic mock data based on the selected product, to make it look realistic for the demo
    const dynamicSurgeData = useMemo(() => {
        if (!activeProduct) return [];

        // Pseudo-random generation seeded by product ID length to keep it consistent per product during a session
        const seed = activeProduct.id.length;

        const generated = indiaCityCoords.map((city, index) => {
            // Generate some random baseline growth for this specific product in this city
            const baseGrowth = 50 + ((seed * index * 17) % 250);

            // Generate some plausible reasons connecting the city to the product category
            const reasons = [
                `Local influencers in ${city.name} recently highlighted ${activeProduct.category} trends.`,
                `Upcoming regional festivals in ${city.name} have spiked early interest in ${activeProduct.name}.`,
                `Aggressive competitor out-of-stock situations in the ${city.name} metro area driving traffic here.`,
                `Favorable local weather conditions aligning perfectly with ${activeProduct.category} use cases.`,
                `Viral social media micro-trend originating from university campuses in ${city.name}.`
            ];

            return {
                city: city.name,
                x: city.x,
                y: city.y,
                growth: baseGrowth,
                category: activeProduct.category,
                reason: reasons[(seed + index) % reasons.length],
                factors: {
                    Internal: 20 + (index * 5) % 30,
                    External_Trends: 30 + (seed * index) % 40,
                    Social: 10 + (seed + index) % 40,
                    Weather: 40 - ((index * 7) % 30)
                }
            };
        });

        // CRITICAL STEP: Merge REAL live surge data if it matches the selected product
        if (lastSurge && (lastSurge.productName === activeProduct.name || lastSurge.category === activeProduct.category)) {
            const locIndex = generated.findIndex(g => g.city.toLowerCase() === lastSurge.location.toLowerCase());

            // Look up coordinates if it's a known city, otherwise guess a central location
            const knownCoords = indiaCityCoords.find(c => c.name.toLowerCase() === lastSurge.location.toLowerCase());

            const liveEntry = {
                city: lastSurge.location,
                x: knownCoords ? knownCoords.x : 250,
                y: knownCoords ? knownCoords.y : 300,
                growth: lastSurge.growth || 450, // Massive spike for live alerts
                category: activeProduct.category,
                reason: lastSurge.explanation || `Real-time anomaly detected. Deep AI analysis confirms sudden interest spike.`,
                factors: (lastSurge.shap as any) || { Internal: 70, External_Trends: 10, Social: 10, Weather: 10 }
            };

            if (locIndex >= 0) {
                generated[locIndex] = liveEntry as any; // Overwrite the mock city with the real live data
            } else {
                generated.push(liveEntry as any); // Add the new city to the map
            }
        }

        return generated;
    }, [activeProduct, lastSurge]);

    // The insight currently selected by the user clicking a node
    const currentInsight = useMemo(() => dynamicSurgeData.find(s => s.city === selectedCity), [dynamicSurgeData, selectedCity]);

    return (
        <div className="space-y-6 pb-12 w-full max-w-[1600px] mx-auto overflow-hidden">

            {/* Header */}
            <div className="flex justify-between items-end px-4">
                <div>
                    <h1 className="text-4xl font-black text-primary font-outfit uppercase tracking-tight flex items-center gap-3">
                        <Activity className="text-[#ff6b6b]" size={36} /> Product Heatmap
                    </h1>
                    <p className="text-accent font-medium mt-2">Analyze real-time demographic demand across your entire catalog.</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-100 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Live Tracking Active</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px]">

                {/* Left Panel: Product Selection Sidebar */}
                <div className="lg:col-span-3 bg-white rounded-3xl border border-border shadow-sm flex flex-col overflow-hidden max-h-[800px]">
                    <div className="p-6 border-b border-border bg-muted/30">
                        <h3 className="font-bold text-primary flex items-center gap-2 text-sm uppercase tracking-widest">
                            <Package size={16} /> Select Product
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => {
                                    setSelectedProductId(product.id);
                                    setSelectedCity(null); // Reset city selection when changing product
                                }}
                                className={`flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all border ${selectedProductId === product.id
                                    ? 'bg-primary/5 border-primary/30 shadow-md ring-1 ring-primary/20 scale-[1.02]'
                                    : 'bg-white border-transparent hover:bg-muted hover:border-border/50'
                                    }`}
                            >
                                <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-bold truncate text-sm ${selectedProductId === product.id ? 'text-primary' : 'text-primary/80'}`}>
                                        {product.name}
                                    </h4>
                                    <p className="text-xs text-accent font-medium truncate">{product.category}</p>
                                </div>
                                {lastSurge && (lastSurge.productName === product.name || lastSurge.category === product.category) && (
                                    <div className="w-2 h-2 rounded-full bg-[#ff6b6b] ml-2 animate-pulse" title="Live Surge Active" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center Panel: Interactive Map */}
                <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-border shadow-sm flex flex-col relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-6 relative z-10 w-full">
                        <div>
                            <h3 className="font-black text-primary text-xl flex items-center gap-3">
                                <Globe size={24} className="text-primary" /> Regional Demand Pulse
                            </h3>
                            <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mt-2">
                                For: <span className="text-primary">{activeProduct?.name || 'Loading...'}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex-1 w-full relative flex items-center justify-center min-h-[500px]">
                        {/* High-Tech Stylized SVG Map of India */}
                        <svg viewBox="0 0 500 600" className="w-[85%] h-full drop-shadow-2xl text-primary overflow-visible">
                            <path
                                fill="currentColor"
                                className="opacity-20 transition-opacity duration-700"
                                d="M192.4 87.6c-4.9-1.2-12-6.6-15.6-11.8-6.1-8.7-6-8.9 4.3-15.3 12.3-7.5 13-7.5 28.5-1.9 8.5 3 17 4.5 18.8 3.2 1.8-1.2 2.7-5.9 2-10.4-1.9-10.7 2-20.9 9.3-24.1 6.5-2.9 8.6-6.4 7-11.1-1.3-3.6.3-9.5 3.5-13.1 3.2-3.6 5.8-9 5.8-12 0-3 3.6-7.8 8-10.7 15.1-9.9 33.1 1.7 34.6 22.1 1.2 15.6 15 25.1 24.3 16.7 9-8 12.5-7.7 29.5 2.1 14.1 8 18.2 13 23.3 27.6 3.6 10.4 4.5 16 2.4 16.4-1.5.3-2.8 4.2-2.8 8.6 0 10.6 6.8 28.1 13 33.2 4.4 3.7 9.8 11.4 12 17.2 4.2 11.2 7.7 13.9 14.7 11.3 5.4-2 9.8-1.1 9.8 1.9 0 3-8.1 11.4-18 18.7-9.9 7.3-18 15.6-18 18.4 0 5.4-8 10.6-15 9.7-3.9-.5-8.8 1.5-11 4.5-5.2 7-19.4 6.7-33.1-.7-7.7-4.1-16.7-8-20.1-8.5-3.4-.6-6.2.7-6.2 3.1 0 2.4-2.2 6.5-4.8 9.3-2.6 2.7-8.1 11-12.2 18.3-9 16.1-18.7 39.5-22.3 53.6-3 11.8-3.4 12-23.7 14.1-11.9 1.3-23.2 3.4-24.9 4.8-1.8 1.4-11.4 3-21.4 3.5-13 .6-18.9 2.5-21 6.4-1.6 3-11.2 5.6-21.2 6-12 .4-18.1.1-18.1-1 0-.9 1.3-3 2.8-4.6 1.6-1.6 2.8-4.5 2.8-6.5 0-3.2 2.7-4.3 12.3-5.3 15.6-1.5 29.6-14 36.8-32.9 8.2-21.4-3.1-40.2-29.3-48.5l-13.7-4.4 9-18.7c5-10.3 8.3-19.7 7.4-20.8-.9-1.2-12-1-24.7.4zm50.6 57.1c0 29.8 27.2 45.4 51.5 29.5 30.6-20.1 27.8-64.6-4.6-73.4-15.5-4.2-46.9 11.7-46.9 43.9zm-46.7 94.6c2.8 5 4.7 15.7 4.2 23.8-.7 11 1.9 18.2 8.7 24.3 6.4 5.7 8.8 11.5 8.1 19.3-.9 10 3 13.9 15.9 16.4 20.3 3.8 30.7 17.5 35 45.7 4 25.6 21.6 86 28 100.9 2.4 5.6 4.7 9.8 5.2 9.5.4-.4 6-25 12.3-54.7 6.4-30 14-57.8 17.2-61.9 3.6-4.6 6.5-5 8.3-1.1 1.5 3.1 3 4.2 3.6 2.4.6-1.6 12-1 25.4 1.4 21.1 3.7 24.2 3.8 23.2.7-.6-1.6-4-10-7.8-18.6-7-15.6-11.2-31.4-13.1-49.3-1.6-15.5-3.7-28.2-4.7-28.2-1 0-8.5-7.7-16.7-17-15.3-17.5-17.4-25.2-9.6-35.3 4.9-6.3 7-12.7 6-18.7-1.4-8.7 1.8-15.8 11.7-26 12-12.2 19.5-24 16.1-25.1-4.7-1.6-4.5-4.4 1-13 6.9-10.8 13.5-30.8 13.5-41.2 0-9.2.5-10.4 6-13 9.7-4.6 25.1-6.1 29.8-2.9 5.3 3.7 9 4 19.5 1.5 37.1-8.7 48-5.3 46 14.5-1 9.4-4.2 20.2-7.1 23.8-3.7 4.8-5.6 13.6-5.6 26.6 0 10.4-1.2 18.9-2.7 18.9-1.5 0-9.3 5.4-17.3 12-25.5 21-34.9 50.8-23 72.8 6.5 12.1 7.2 18.4 2.1 18.4-1.8 0-4.6-3.8-6.1-8.5-4.5-14.1-15-18.2-32.5-12.5-9.1 2.9-16.5 6.2-16.5 7.2 0 1.1 7.7 1.8 17.1 1.7 19.9-.3 23.2 2.3 35.7 27.5 7.1 14.4 7.2 14.9.4 17.2-6.5 2.1-7.2.9-5-9.4 1.3-6.2 1-8.8-1-8.3-2 1-3.6 4.3-3.6 8 0 8.4-5.4 17.5-12.6 21.2-4.6 2.3-8.4 6.7-8.4 9.7 0 3-4.1 6.3-9 7.3-11.8 2.4-22 25.8-22 50.6 0 13 3.5 25.3 8.3 29.3 4.4 3.6 8 8.8 8 11.5 0 2.6-4.2 11.2-9.2 18.9-10.6 16-11 25.5-2 36.3 3.2 3.8 6 9.8 6 13.2 0 4.3 2.6 6 8.3 5.5 5-.4 9.1-.1 9.1.7 0 .8-20.7 14.8-46 31.1-25.2 16.3-64.4 46.1-87 66.2-22.6 20.1-41.2 36.5-41.2 36.5 0 0-33.1-40.4-73.6-89.8-40.5-49.4-73.6-90.8-73.6-92 0-1.2-11.5-23.7-25.6-50.1-14.1-26.4-26.6-49.8-27.7-52.1s-2-8.3-2-13.4c0-5 2.5-12 5.5-15.5 3-3.5 7.5-14.3 10.1-24l4.6-17.5-9.5-22.5c-5.2-12.4-9.5-26.5-9.5-31.5 0-9.2-28.6-32.9-52.7-43.5-5.9-2.6-10.7-6-10.7-7.6 0-1.6 3.8-3 8.5-3 10.7 0 26.6 6.3 32.7 13 5.3 5.9 8.6 6.5 13.8 2.6 3.6-2.7 7.7-3.9 9-2.6zm33.1-65.4c17.5-1.9 20.3-6 19.3-28.4-1.2-24.3-17-26.5-28.5-3.9-6.3 12.3-3.6 33.6 3.5 33.8 1 .1 3.5-.4 5.7-1.5z"
                            />

                            {/* Node Markers placed accurately within the SVG coordinate system */}
                            {dynamicSurgeData.map((node) => {
                                const isSelected = selectedCity === node.city;
                                const isHighDemand = node.growth > 150;
                                // Calculate size dynamically
                                const size = Math.max(15, Math.min(45, node.growth / 6));

                                // Label offset positions based on city
                                let labelX = 20;
                                let labelY = -20;
                                if (node.city === 'Mumbai') { labelX = -120; labelY = -30; }
                                if (node.city === 'Kolkata') { labelX = 20; labelY = -30; }
                                if (node.city === 'Delhi') { labelX = -50; labelY = -80; }
                                if (node.city === 'Bangalore') { labelX = -110; labelY = 10; }
                                if (node.city === 'Chennai') { labelX = 20; labelY = 10; }

                                return (
                                    <motion.g
                                        key={node.city}
                                        initial={false}
                                        animate={{ x: node.x, y: node.y }}
                                        className="cursor-pointer"
                                        onClick={() => setSelectedCity(node.city)}
                                    >
                                        {/* Pulse Effect */}
                                        {(isSelected || isHighDemand) && (
                                            <motion.circle
                                                r={size * 1.5}
                                                fill={isSelected ? '#6b66ff' : '#ff6b6b'}
                                                initial={{ opacity: 0.6, scale: 0.8 }}
                                                animate={{ opacity: 0, scale: 2.2 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                                            />
                                        )}

                                        {/* Core Dot */}
                                        <motion.circle
                                            r={size / 2}
                                            fill={isSelected ? '#6b66ff' : isHighDemand ? '#ff6b6b' : '#0f0f0f'}
                                            stroke="white"
                                            strokeWidth={2.5}
                                            initial={false}
                                            whileHover={{ scale: 1.2 }}
                                            className="drop-shadow-lg"
                                        />

                                        {/* Label Container (using foreignObject to keep nice CSS styling) */}
                                        <foreignObject x={labelX} y={labelY} width="160" height="60" className="overflow-visible pointer-events-none">
                                            <div className={`bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-border/50 transition-all ${isSelected ? 'ring-2 ring-[#6b66ff]/50 scale-105' : ''}`}>
                                                <p className={`text-xs font-black leading-none mb-1 ${isSelected ? 'text-[#6b66ff]' : 'text-primary'}`}>{node.city}</p>
                                                <p className={`text-[9px] font-bold leading-none ${isHighDemand ? 'text-[#ff6b6b]' : 'text-accent'}`}>+{node.growth}% Demand</p>
                                            </div>
                                        </foreignObject>
                                    </motion.g>
                                );
                            })}
                        </svg>

                        {/* Legend Overlay */}
                        <div className="absolute bottom-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-border/50 shadow-sm space-y-2 pointer-events-none z-10">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#ff6b6b]" />
                                <span className="text-[9px] font-black text-primary/70 uppercase tracking-tighter">High Surge</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                <span className="text-[9px] font-black text-primary/70 uppercase tracking-tighter">Steady</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#6b66ff]" />
                                <span className="text-[9px] font-black text-primary/70 uppercase tracking-tighter">Selected</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Intelligence Side Panel - NOW CHATBOT */}
                <div className="lg:col-span-3 h-full overflow-hidden">
                    <AnimatePresence mode="wait">
                        {currentInsight ? (
                            <motion.div
                                key={currentInsight.city}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full flex flex-col"
                            >
                                <MarketIntelligenceChat
                                    surgeContext={currentInsight}
                                    initialMessage={currentInsight.reason}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white rounded-3xl p-8 border border-dashed border-border flex flex-col items-center justify-center text-center h-full"
                            >
                                <div className="bg-muted p-6 rounded-full mb-4">
                                    <Globe className="text-accent/30" size={48} />
                                </div>
                                <h3 className="text-lg font-black text-primary uppercase font-outfit">Awaiting Intelligence</h3>
                                <p className="text-accent text-[11px] mt-2 font-medium max-w-[200px] uppercase tracking-wide leading-relaxed">
                                    Click on any glowing city node on the heatmap to unveil its AI insights.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>

            {/* Global Warning Banner placed subtly at the bottom */}
            {currentInsight && currentInsight.growth > 200 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#fffbeb] border border-[#fef3c7] p-5 rounded-3xl flex flex-col sm:flex-row items-center gap-4 mt-8"
                >
                    <div className="bg-amber-100 text-amber-600 p-3 rounded-2xl shrink-0">
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <h4 className="font-black text-amber-900 uppercase text-[10px] tracking-widest">Supply Chain Warning</h4>
                        <p className="text-amber-800 text-xs font-medium mt-1">
                            The excessive spike ({currentInsight.growth}%) in {currentInsight.city} exceeds regular threshold. Ensure local fulfillment centers are heavily stocked to avoid SLA breaches within the next 48 hours.
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
