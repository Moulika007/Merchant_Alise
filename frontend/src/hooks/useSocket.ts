import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export interface SurgeAlert {
    id: string;
    type: string;
    location: string; // Primary location for backward compatibility
    topLocations?: { name: string; count: number }[];
    category: string;
    subcategory?: string | null;
    displayTitle?: string | null;
    productName?: string | null;
    productImage?: string | null;
    growth: number;
    timeFrame: number;
    message: string;
    explanation: string;
    deepDive?: string;
    shap?: Record<string, number>;
    timestamp: string;
}

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [lastSurge, setLastSurge] = useState<SurgeAlert | null>(null);
    const [userCity, setUserCity] = useState<string>('Mumbai'); // Default fallback

    useEffect(() => {
        // Fetch user's accurate location via Browser Geolocation API + Reverse Geocoding
        const fetchLocation = () => {
            if (!navigator.geolocation) {
                console.warn('Geolocation not supported. Defaulting to Mumbai.');
                return;
            }
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                        );
                        if (response.ok) {
                            const data = await response.json();
                            // Prefer city, then town, then state_district as fallback
                            const city = data.address?.city || data.address?.town || data.address?.state_district || data.address?.county;
                            if (city) {
                                setUserCity(city);
                                console.log('User location detected via GPS:', city);
                            }
                        }
                    } catch (error) {
                        console.warn('Reverse geocoding failed. Defaulting to Mumbai.', error);
                    }
                },
                (error) => {
                    console.warn('Geolocation permission denied or failed. Defaulting to Mumbai.', error.message);
                },
                { timeout: 8000, enableHighAccuracy: false }
            );
        };

        fetchLocation();
        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        newSocket.on('surge-alert', (data: SurgeAlert) => {
            console.log('Received surge alert:', data);
            setLastSurge(data);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    const trackActivity = (
        type: 'search' | 'view' | 'cart_add',
        category: string,
        location: string = userCity, // Use dynamic city default
        productId?: string | null,
        productName?: string | null,
        productImage?: string | null,
        subcategory?: string | null
    ) => {
        if (socket) {
            socket.emit('record-activity', {
                type,
                category,
                location,
                productId,
                productName,
                productImage,
                subcategory
            });
        }
    };

    return { socket, lastSurge, setLastSurge, trackActivity };
};
