import { useState, useCallback } from 'react';
import { MapPin, TrendingUp, AlertTriangle, Activity, Bell, X, ChevronRight, Globe, Loader2, Zap } from 'lucide-react';
import HyperlocalDemandMap from '../../components/HyperlocalDemandMap';
import { useIpLocation } from '../../hooks/useIpLocation';
import { useStore } from '../../context/StoreContext';
import { motion } from 'framer-motion';

interface SurgeZone {
    id: number;
    city: string;
    state: string;
    lat: number;
    lng: number;
    unitsSold: number;
    localStock: number;
    demandScore: number;
}

const demandPoints = [
    { city: 'Mumbai', unitsSold: 1420, localStock: 38, demandScore: 9 },
    { city: 'Delhi', unitsSold: 1185, localStock: 22, demandScore: 8 },
    { city: 'Bengaluru', unitsSold: 980, localStock: 55, demandScore: 7 },
    { city: 'Chennai', unitsSold: 760, localStock: 14, demandScore: 8 },
    { city: 'Hyderabad', unitsSold: 640, localStock: 70, demandScore: 6 },
    { city: 'Kolkata', unitsSold: 590, localStock: 8, demandScore: 7 },
    { city: 'Pune', unitsSold: 510, localStock: 44, demandScore: 5 },
    { city: 'Ahmedabad', unitsSold: 430, localStock: 31, demandScore: 5 },
    { city: 'Jaipur', unitsSold: 310, localStock: 62, demandScore: 4 },
    { city: 'Surat', unitsSold: 280, localStock: 18, demandScore: 4 },
    { city: 'Coimbatore', unitsSold: 200, localStock: 90, demandScore: 3 },
    { city: 'Lucknow', unitsSold: 175, localStock: 5, demandScore: 6 },
];

function getSurgeLabel(zone: SurgeZone) {
    if (zone.localStock < 15 && zone.demandScore >= 8) return { text: '🔴 Critical Surge', cls: 'bg-red-100 text-red-700' };
    if (zone.localStock < 15) return { text: '⚠ Low Stock', cls: 'bg-orange-100 text-orange-700' };
    if (zone.demandScore >= 8) return { text: '🔥 High Demand', cls: 'bg-amber-100 text-amber-700' };
    return { text: '↑ Active Zone', cls: 'bg-blue-50 text-blue-700' };
}

export default function RegionalInsightsPage() {
    const totalDemandPoints = demandPoints.length;
    const highestDemandCity = demandPoints.reduce((a, b) => a.unitsSold > b.unitsSold ? a : b);
    const lowStockZones = demandPoints.filter(p => p.localStock < 20).length;

    const locationState = useIpLocation();
    const detectedLocation = locationState.status === 'success' ? locationState.data : null;
    const { cityDemandEvents, predictedSurges } = useStore();

    const [surgeZones, setSurgeZones] = useState<SurgeZone[]>([]);
    const [showNotifPanel, setShowNotifPanel] = useState(false);
    const [dismissedIds, setDismissedIds] = useState<Set<number>>(new Set());

    const handleSurgeZonesUpdated = useCallback((zones: SurgeZone[]) => {
        setSurgeZones(zones);
    }, []);

    const visibleAlerts = surgeZones.filter(z => !dismissedIds.has(z.id));
    const notifCount = visibleAlerts.length;

    const dismiss = (id: number) => {
        setDismissedIds(prev => new Set([...prev, id]));
    };
    const dismissAll = () => {
        setDismissedIds(new Set(surgeZones.map(z => z.id)));
        setShowNotifPanel(false);
    };

    const stats = [
        {
            label: 'Active Demand Zones',
            value: totalDemandPoints,
            sub: 'Across major Indian cities',
            icon: MapPin,
            iconBg: 'bg-blue-50 text-blue-600',
        },
        {
            label: 'Highest Demand City',
            value: highestDemandCity.city,
            sub: `${highestDemandCity.unitsSold.toLocaleString('en-IN')} units sold`,
            icon: TrendingUp,
            iconBg: 'bg-emerald-50 text-emerald-600',
        },
        {
            label: 'Low Stock Zones',
            value: lowStockZones,
            sub: 'Restock action required',
            icon: AlertTriangle,
            iconBg: 'bg-red-50 text-red-500',
            urgent: lowStockZones > 0,
        },
    ];

    return (
        <div className="space-y-8 pb-12 relative">

            {/* ── Surge Notification Panel ── */}
            {showNotifPanel && (
                <div className="absolute top-14 right-0 z-50 w-80 bg-white border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-[#f7f7f5]">
                        <div className="flex items-center gap-2">
                            <Bell size={15} className="text-primary" />
                            <span className="font-bold text-sm text-primary">Surge Alerts</span>
                            {notifCount > 0 && (
                                <span className="bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 leading-none">
                                    {notifCount}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {notifCount > 0 && (
                                <button onClick={dismissAll} className="text-xs text-accent hover:text-primary font-semibold transition-colors">
                                    Clear all
                                </button>
                            )}
                            <button onClick={() => setShowNotifPanel(false)} className="text-accent hover:text-primary transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Alert list */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-border">
                        {visibleAlerts.length === 0 ? (
                            <div className="py-8 text-center text-sm text-accent font-medium">
                                ✅ No active surge alerts
                            </div>
                        ) : (
                            visibleAlerts.map(zone => {
                                const label = getSurgeLabel(zone);
                                return (
                                    <div key={zone.id} className="flex items-start gap-3 px-4 py-3 hover:bg-[#f7f7f5] transition-colors group">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-sm text-primary truncate">{zone.city}</span>
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${label.cls}`}>
                                                    {label.text}
                                                </span>
                                            </div>
                                            <div className="flex gap-3 text-xs text-accent font-medium">
                                                <span>📦 {zone.unitsSold.toLocaleString('en-IN')} sold</span>
                                                <span className={zone.localStock < 15 ? 'text-red-500 font-bold' : ''}>
                                                    🏪 {zone.localStock} in stock
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => dismiss(zone.id)}
                                            className="text-border hover:text-accent transition-colors opacity-0 group-hover:opacity-100 shrink-0 mt-0.5"
                                        >
                                            <X size={13} />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer tip */}
                    {visibleAlerts.length > 0 && (
                        <div className="px-4 py-2 bg-[#f7f7f5] border-t border-border text-xs text-accent font-medium flex items-center gap-1">
                            <ChevronRight size={11} /> Click a marker on the map to zoom in
                        </div>
                    )}
                </div>
            )}

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary font-outfit">Regional Insights</h1>
                    <p className="text-accent mt-1">Real-time hyperlocal demand map · Click any marker to zoom in</p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    {/* IP Location badge */}
                    <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-4 py-2 shadow-sm text-sm font-semibold text-primary">
                        {locationState.status === 'loading' ? (
                            <><Loader2 size={14} className="text-blue-500 animate-spin" /><span className="text-accent">Detecting location…</span></>
                        ) : locationState.status === 'success' ? (
                            <><Globe size={14} className="text-blue-500" /><span>{locationState.data.city}, {locationState.data.regionName}</span></>
                        ) : (
                            <><Globe size={14} className="text-accent" /><span className="text-accent">Location unavailable</span></>
                        )}
                    </div>

                    {/* Live badge */}
                    <div className="flex items-center gap-2 bg-white border border-border rounded-xl px-4 py-2 shadow-sm text-sm font-semibold text-primary">
                        <Activity size={14} className="text-emerald-500" />
                        <span className="text-emerald-600">Live</span>&nbsp;· Updated every 4s
                    </div>

                    {/* Notification bell */}
                    <button
                        onClick={() => setShowNotifPanel(v => !v)}
                        className="relative bg-white border border-border rounded-xl p-2.5 shadow-sm hover:bg-muted transition-colors"
                        title="Surge Alerts"
                    >
                        <Bell size={18} className={notifCount > 0 ? 'text-red-500' : 'text-accent'} />
                        {notifCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black rounded-full min-w-[18px] h-[18px] flex items-center justify-center leading-none px-1 animate-pulse">
                                {notifCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            {/* ── Surge Prediction Radar (AI Layer) ── */}
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Zap size={120} className="text-primary" />
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-primary text-white p-2.5 rounded-2xl shadow-lg ring-4 ring-primary/10">
                        <Zap size={20} fill="currentColor" />
                    </div>
                    <div>
                        <h3 className="font-black text-primary text-xl font-outfit uppercase tracking-tight">Surge Prediction Radar</h3>
                        <p className="text-xs font-bold text-accent uppercase tracking-widest">AI-Driven Early Warning System</p>
                    </div>
                </div>

                {predictedSurges.length === 0 ? (
                    <div className="bg-white/50 backdrop-blur-sm border border-dashed border-primary/20 rounded-2xl p-10 text-center">
                        <Activity size={32} className="mx-auto mb-3 text-primary/30 animate-pulse" />
                        <p className="text-sm font-bold text-primary/60">Scanning for early demand patterns…</p>
                        <p className="text-[10px] text-accent mt-1">Predictions appear here when activity spikes before a full surge hits.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {predictedSurges.map(surge => (
                            <motion.div
                                key={surge.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white border-2 border-primary/10 rounded-2xl p-4 shadow-xl relative overflow-hidden group hover:border-primary/30 transition-all"
                            >
                                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-16 h-16 bg-primary/5 rounded-full" />
                                <div className="flex items-start justify-between mb-3">
                                    <div className="bg-primary/10 text-primary p-2 rounded-xl">
                                        <TrendingUp size={16} />
                                    </div>
                                    <span className="text-[10px] font-black bg-primary text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                        Predicted
                                    </span>
                                </div>
                                <h4 className="font-black text-primary text-base line-clamp-1 mb-1">{surge.productName}</h4>
                                <div className="flex items-center gap-1.5 text-xs text-accent font-bold mb-3">
                                    <MapPin size={12} className="text-primary" />
                                    <span>{surge.city}</span>
                                </div>
                                <div className="bg-muted/50 rounded-xl p-3 border border-border">
                                    <p className="text-[11px] font-bold text-primary leading-tight mb-2">{surge.reason}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-accent font-bold uppercase tracking-widest">Heat Velocity</span>
                                        <span className="text-xs font-black text-primary">{surge.heatScore} pts</span>
                                    </div>
                                </div>
                                <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (surge.heatScore / 20) * 100)}%` }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map(stat => (
                    <div
                        key={stat.label}
                        className={`bg-white border rounded-2xl p-6 shadow-sm ${stat.urgent ? 'border-red-200 bg-red-50' : 'border-border'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-bold text-accent uppercase tracking-widest">{stat.label}</span>
                            <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                                <stat.icon size={16} />
                            </div>
                        </div>
                        <p className={`text-3xl font-bold tracking-tight ${stat.urgent ? 'text-red-600' : 'text-primary'}`}>
                            {stat.value}
                        </p>
                        <p className={`text-sm mt-2 font-medium ${stat.urgent ? 'text-red-500' : 'text-accent'}`}>
                            {stat.sub}
                        </p>
                    </div>
                ))}
            </div>

            {/* ── Map Card ── */}
            <div className="bg-white border border-border rounded-3xl shadow-sm overflow-hidden">
                <div className="px-6 pt-6 pb-4 flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h3 className="font-bold text-primary text-lg font-outfit">Demand Heat Map</h3>
                        <p className="text-xs font-medium text-accent mt-0.5">
                            Click a marker → zoom in · Double-click map → zoom back to India
                        </p>
                    </div>
                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" />Critical (8–10)</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />High (6–7)</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />Medium (4–5)</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" />Low (1–3)</span>
                    </div>
                </div>

                <div style={{ height: '520px' }} className="px-4 pb-4">
                    <HyperlocalDemandMap
                        onSurgeZonesUpdated={handleSurgeZonesUpdated}
                        userLocation={detectedLocation}
                        cityDemandEvents={cityDemandEvents}
                    />
                </div>
            </div>

            {/* ── Zone Intelligence Table ── */}
            <div className="bg-white border border-border rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-primary text-lg mb-5 font-outfit">Zone Intelligence Table</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left text-accent font-bold uppercase text-xs tracking-widest pb-3">City</th>
                                <th className="text-right text-accent font-bold uppercase text-xs tracking-widest pb-3">Units Sold</th>
                                <th className="text-right text-accent font-bold uppercase text-xs tracking-widest pb-3">Local Stock</th>
                                <th className="text-right text-accent font-bold uppercase text-xs tracking-widest pb-3">Score</th>
                                <th className="text-right text-accent font-bold uppercase text-xs tracking-widest pb-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {demandPoints
                                .sort((a, b) => b.demandScore - a.demandScore)
                                .map((p, i) => (
                                    <tr key={p.city} className={`border-b border-border/50 ${i % 2 === 0 ? '' : 'bg-[#f7f7f5]'}`}>
                                        <td className="py-3 font-semibold text-primary">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={13} className="text-accent shrink-0" />
                                                {p.city}
                                            </div>
                                        </td>
                                        <td className="py-3 text-right font-bold text-primary">{p.unitsSold.toLocaleString('en-IN')}</td>
                                        <td className="py-3 text-right">
                                            <span className={`font-bold ${p.localStock < 20 ? 'text-red-500' : 'text-emerald-600'}`}>
                                                {p.localStock}
                                            </span>
                                        </td>
                                        <td className="py-3 text-right font-bold text-primary">{p.demandScore}/10</td>
                                        <td className="py-3 text-right">
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${p.localStock < 20
                                                ? 'bg-red-100 text-red-600'
                                                : p.demandScore >= 7
                                                    ? 'bg-amber-50 text-amber-600'
                                                    : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                {p.localStock < 20 ? '⚠ Restock' : p.demandScore >= 7 ? '↑ Surge' : '✓ Stable'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
