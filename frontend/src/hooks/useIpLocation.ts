import { useState, useEffect } from 'react';

export interface IpLocation {
    ip: string;
    city: string;
    regionName: string;
    country: string;
    lat: number;
    lon: number;
    isp: string;
    timezone: string;
    status: 'success' | 'fail';
}

export type LocationState =
    | { status: 'loading' }
    | { status: 'success'; data: IpLocation }
    | { status: 'error'; message: string };

// Module-level cache — shared across all hook consumers
let cached: IpLocation | null = null;

export function useIpLocation(): LocationState {
    const [state, setState] = useState<LocationState>(
        cached ? { status: 'success', data: cached } : { status: 'loading' }
    );

    useEffect(() => {
        if (cached) return;

        fetch('http://ip-api.com/json/?fields=status,message,country,regionName,city,lat,lon,timezone,isp,query')
            .then(res => res.json())
            .then((data: IpLocation & { query: string }) => {
                if (data.status === 'success') {
                    const result: IpLocation = {
                        ip: data.query,
                        city: data.city,
                        regionName: data.regionName,
                        country: data.country,
                        lat: data.lat,
                        lon: data.lon,
                        isp: data.isp,
                        timezone: data.timezone,
                        status: 'success',
                    };
                    cached = result;
                    // ← Persist for use in StoreContext (buyer actions)
                    localStorage.setItem('ma_user_city', JSON.stringify({
                        city: result.city,
                        regionName: result.regionName,
                        lat: result.lat,
                        lon: result.lon,
                    }));
                    setState({ status: 'success', data: result });
                } else {
                    setState({ status: 'error', message: 'Location unavailable' });
                }
            })
            .catch(() => {
                setState({ status: 'error', message: 'Could not reach ip-api.com' });
            });
    }, []);

    return state;
}

/** Read the cached city synchronously (for StoreContext) */
export function getCachedCity(): { city: string; regionName: string; lat: number; lon: number } | null {
    if (cached) return { city: cached.city, regionName: cached.regionName, lat: cached.lat, lon: cached.lon };
    try {
        const stored = localStorage.getItem('ma_user_city');
        if (stored) return JSON.parse(stored);
    } catch { /* ignore */ }
    return null;
}
