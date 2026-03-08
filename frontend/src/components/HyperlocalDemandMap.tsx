import { useEffect, useRef, useState, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import type { IpLocation } from '../hooks/useIpLocation';
import type { CityDemandEvent } from '../context/StoreContext';

interface DemandPoint {
    id: number;
    city: string;
    state: string;
    lat: number;
    lng: number;
    unitsSold: number;
    localStock: number;
    demandScore: number;
}

const initialDemandPoints: DemandPoint[] = [
    { id: 1, city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, unitsSold: 1420, localStock: 38, demandScore: 9 },
    { id: 2, city: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, unitsSold: 1185, localStock: 22, demandScore: 8 },
    { id: 3, city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, unitsSold: 980, localStock: 55, demandScore: 7 },
    { id: 4, city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, unitsSold: 760, localStock: 14, demandScore: 8 },
    { id: 5, city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, unitsSold: 640, localStock: 70, demandScore: 6 },
    { id: 6, city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, unitsSold: 590, localStock: 8, demandScore: 7 },
    { id: 7, city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, unitsSold: 510, localStock: 44, demandScore: 5 },
    { id: 8, city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, unitsSold: 430, localStock: 31, demandScore: 5 },
    { id: 9, city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, unitsSold: 310, localStock: 62, demandScore: 4 },
    { id: 10, city: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311, unitsSold: 280, localStock: 18, demandScore: 4 },
    { id: 11, city: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, unitsSold: 200, localStock: 90, demandScore: 3 },
    { id: 12, city: 'Lucknow', state: 'U.P.', lat: 26.8467, lng: 80.9462, unitsSold: 175, localStock: 5, demandScore: 6 },
];

function getColor(score: number): string {
    if (score >= 8) return '#ef4444';
    if (score >= 6) return '#f97316';
    if (score >= 4) return '#eab308';
    return '#22c55e';
}
function getRadius(score: number): number { return 10 + score * 2.5; }

interface Props {
    onSurgeZonesUpdated: (zones: DemandPoint[]) => void;
    userLocation?: IpLocation | null;
    cityDemandEvents?: CityDemandEvent[];
}

export default function HyperlocalDemandMap({ onSurgeZonesUpdated, userLocation, cityDemandEvents = [] }: Props) {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<ReturnType<typeof import('leaflet')['map']> | null>(null);
    const leafletRef = useRef<typeof import('leaflet') | null>(null);
    const markersRef = useRef<Map<number, ReturnType<typeof import('leaflet')['circleMarker']>>>(new Map());
    const userMarkerRef = useRef<ReturnType<typeof import('leaflet')['circleMarker']> | null>(null);
    const [points, setPoints] = useState<DemandPoint[]>(initialDemandPoints);
    const pointsRef = useRef<DemandPoint[]>(initialDemandPoints);
    const processedEventsRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        onSurgeZonesUpdated(initialDemandPoints.filter(p => p.demandScore >= 7 || p.localStock < 15));
    }, []);// eslint-disable-line

    useEffect(() => { pointsRef.current = points; }, [points]);

    const buildPopupHTML = useCallback((point: DemandPoint) => {
        const color = getColor(point.demandScore);
        const stockBadge = point.localStock < 15
            ? `<span style="background:#7f1d1d;color:#fca5a5;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700;">⚠ ${point.localStock} units</span>`
            : `<span style="background:#14532d;color:#86efac;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700;">✓ ${point.localStock} units</span>`;
        const statusLine = point.localStock < 15
            ? `<div style="margin-top:10px;background:rgba(239,68,68,0.12);color:#fca5a5;border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:5px 10px;font-size:11px;font-weight:600;text-align:center;">🔴 Restock Required – High Surge Zone</div>`
            : `<div style="margin-top:10px;background:rgba(34,197,94,0.1);color:#86efac;border:1px solid rgba(34,197,94,0.3);border-radius:8px;padding:5px 10px;font-size:11px;font-weight:600;text-align:center;">🟢 Inventory Stable</div>`;
        return `
            <div style="font-family:'Outfit',sans-serif;min-width:200px;padding:4px 2px;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                    <span style="width:11px;height:11px;border-radius:50%;background:${color};display:inline-block;flex-shrink:0;"></span>
                    <div>
                        <div style="font-weight:700;font-size:15px;color:#fff;">${point.city}</div>
                        <div style="font-size:11px;color:#9ca3af;">${point.state}</div>
                    </div>
                </div>
                <div style="height:1px;background:#2a2a3e;margin:8px 0;"></div>
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px;"><span style="color:#9ca3af;">Units Sold</span><span style="font-weight:700;color:#fff;">${point.unitsSold.toLocaleString('en-IN')}</span></div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;font-size:13px;"><span style="color:#9ca3af;">Local Stock</span>${stockBadge}</div>
                <div style="display:flex;justify-content:space-between;font-size:13px;"><span style="color:#9ca3af;">Demand Score</span><span style="font-weight:700;color:${color};">${point.demandScore}/10</span></div>
                ${statusLine}
            </div>`;
    }, []);

    // Initialize map
    useEffect(() => {
        if (!mapRef.current || leafletMapRef.current) return;
        let isMounted = true;

        import('leaflet').then((L) => {
            if (!isMounted || leafletMapRef.current || !mapRef.current) return;

            // Strict mode safety: check if the DOM node already has an initialized map
            if ((mapRef.current as any)._leaflet_id) {
                (mapRef.current as any)._leaflet_id = null;
            }

            leafletRef.current = L;
            const map = L.map(mapRef.current, { center: [20.5937, 78.9629], zoom: 5, zoomControl: true, zoomAnimation: true });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
                subdomains: 'abcd', maxZoom: 19,
            }).addTo(map);

            pointsRef.current.forEach((point) => {
                const color = getColor(point.demandScore);
                const circle = L.circleMarker([point.lat, point.lng], { radius: getRadius(point.demandScore), color, fillColor: color, fillOpacity: 0.75, weight: 2 });
                circle.bindPopup(buildPopupHTML(point), { maxWidth: 250 });
                circle.on('click', () => {
                    map.flyTo([point.lat, point.lng], 9, { animate: true, duration: 1.2 });
                    setTimeout(() => circle.openPopup(), 1000);
                });
                circle.addTo(map);
                markersRef.current.set(point.id, circle);
            });

            map.on('dblclick', () => map.flyTo([20.5937, 78.9629], 5, { animate: true, duration: 1 }));
            leafletMapRef.current = map;
        });

        return () => {
            isMounted = false;
            leafletMapRef.current?.remove();
            leafletMapRef.current = null;
            markersRef.current.clear();
            userMarkerRef.current = null;
        };
    }, [buildPopupHTML]);

    // "You are here" marker from IP detection
    useEffect(() => {
        if (!userLocation || !leafletMapRef.current) return;
        import('leaflet').then((L) => {
            const map = leafletMapRef.current!;
            if (userMarkerRef.current) userMarkerRef.current.remove();

            const userCircle = L.circleMarker([userLocation.lat, userLocation.lon], { radius: 10, color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.5, weight: 3 });
            userCircle.bindPopup(`
                <div style="font-family:'Outfit',sans-serif;min-width:190px;padding:4px 2px;">
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                        <span style="width:11px;height:11px;border-radius:50%;background:#3b82f6;display:inline-block;box-shadow:0 0 0 4px rgba(59,130,246,0.3);"></span>
                        <div><div style="font-weight:700;font-size:14px;color:#fff;">📍 Your Location</div><div style="font-size:11px;color:#9ca3af;">Detected via IP</div></div>
                    </div>
                    <div style="height:1px;background:#2a2a3e;margin:6px 0;"></div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px;"><span style="color:#9ca3af;">City</span><span style="font-weight:600;color:#fff;">${userLocation.city}</span></div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:12px;"><span style="color:#9ca3af;">Region</span><span style="font-weight:600;color:#fff;">${userLocation.regionName}</span></div>
                    <div style="display:flex;justify-content:space-between;font-size:12px;"><span style="color:#9ca3af;">Timezone</span><span style="font-weight:600;color:#93c5fd;">${userLocation.timezone}</span></div>
                </div>
            `, { maxWidth: 240 });

            userCircle.addTo(map);
            userMarkerRef.current = userCircle;
            map.flyTo([userLocation.lat, userLocation.lon], 7, { animate: true, duration: 2 });
            setTimeout(() => userCircle.openPopup(), 2200);
        });
    }, [userLocation]);

    // ── React to buyer cart/order events ──
    useEffect(() => {
        if (!cityDemandEvents.length || !leafletMapRef.current) return;

        const newEvents = cityDemandEvents.filter(e => !processedEventsRef.current.has(e.id));
        if (!newEvents.length) return;

        newEvents.forEach(evt => {
            processedEventsRef.current.add(evt.id);

            setPoints(prev => {
                // Find matching city (case-insensitive partial match)
                const idx = prev.findIndex(p =>
                    p.city.toLowerCase() === evt.city.toLowerCase() ||
                    evt.city.toLowerCase().includes(p.city.toLowerCase())
                );
                if (idx === -1) return prev;

                const updated = [...prev];
                const pt = { ...updated[idx] };

                // Units sold increases per order, less for cart
                pt.unitsSold += evt.type === 'order' ? evt.qty * 8 : evt.qty * 2;
                // Demand score creeps up on orders
                if (evt.type === 'order') {
                    pt.demandScore = Math.min(10, pt.demandScore + 0.5);
                    pt.localStock = Math.max(0, pt.localStock - evt.qty);
                }
                updated[idx] = pt;

                // Update the Leaflet marker
                const marker = markersRef.current.get(pt.id);
                if (marker) {
                    const color = getColor(pt.demandScore);
                    marker.setStyle({ color, fillColor: color, radius: getRadius(pt.demandScore) });
                    marker.setPopupContent(buildPopupHTML(pt));

                    // Visual Pulse logic based on action type
                    let flashColor = '#ffffff';
                    let flashDuration = 400;
                    const endRadius = getRadius(pt.demandScore);
                    let flashRadius = endRadius;

                    if (evt.type === 'search') {
                        flashColor = '#fef08a'; // Faint yellow ripple
                        flashRadius = endRadius + 4;
                        flashDuration = 300;
                    } else if (evt.type === 'cart') {
                        flashColor = '#f97316'; // Medium orange pulse
                        flashRadius = endRadius + 8;
                        flashDuration = 600;
                    } else if (evt.type === 'order') {
                        flashColor = '#ef4444'; // Large red ping
                        flashRadius = endRadius + 15;
                        flashDuration = 1000;
                    }

                    marker.setStyle({ color: flashColor, fillColor: flashColor, radius: flashRadius });
                    setTimeout(() => marker.setStyle({ color, fillColor: color, radius: endRadius }), flashDuration);

                    // Fly to city for orders
                    if (evt.type === 'order' && leafletMapRef.current) {
                        leafletMapRef.current.flyTo([pt.lat, pt.lng], 8, { animate: true, duration: 1.5 });
                        setTimeout(() => marker.openPopup(), 1800);
                    }
                }

                return updated;
            });
        });
    }, [cityDemandEvents, buildPopupHTML, onSurgeZonesUpdated]);

    // Background simulation (keeps map "alive" even without buyer actions)
    useEffect(() => {
        const interval = setInterval(() => {
            setPoints(prev => {
                const idx = Math.floor(Math.random() * prev.length);
                const updated = prev.map((p, i) => i === idx
                    ? { ...p, unitsSold: p.unitsSold + Math.floor(Math.random() * 20 + 3), localStock: Math.max(0, p.localStock - Math.floor(Math.random() * 2)) }
                    : p
                );
                const changedPoint = updated[idx];
                const marker = markersRef.current.get(changedPoint.id);
                if (marker) marker.setPopupContent(buildPopupHTML(changedPoint));
                return updated;
            });
        }, 4000);
        return () => clearInterval(interval);
    }, [buildPopupHTML]);

    useEffect(() => {
        const surgeZones = points.filter(p => p.demandScore >= 7 || p.localStock < 15);
        onSurgeZonesUpdated(surgeZones);
    }, [points, onSurgeZonesUpdated]);

    return (
        <>
            <style>{`
                .leaflet-popup-content-wrapper { background:#1a1a2e!important;color:#f1f1f1!important;border-radius:14px!important;border:1px solid #2a2a3e!important;box-shadow:0 8px 32px rgba(0,0,0,0.6)!important; }
                .leaflet-popup-tip { background:#1a1a2e!important; }
                .leaflet-popup-close-button { color:#9ca3af!important;font-size:20px!important;top:6px!important;right:8px!important; }
                .leaflet-popup-content { margin:14px 16px!important; }
                .leaflet-container { font-family:'Outfit',sans-serif!important;border-radius:20px; }
                .leaflet-control-attribution { background:rgba(0,0,0,0.55)!important;color:#555!important;font-size:10px!important; }
                .leaflet-control-zoom a { background:#1a1a2e!important;color:#f1f1f1!important;border-color:#333!important; }
                .leaflet-control-zoom a:hover { background:#2a2a3e!important; }
            `}</style>
            <div ref={mapRef} style={{ height: '100%', width: '100%', borderRadius: '20px', background: '#0d0d1a' }} />
        </>
    );
}
