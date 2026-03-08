/**
 * surgeEventBus.ts
 * Upgraded Surge Intelligence Engine.
 * 
 * Instead of firing a notification for EVERY event, it records events silently
 * and ONLY fires a notification when a true "Surge" is detected (e.g. high velocity
 * from the same IP/City for the same product).
 */

export type SurgeEventType = 'search' | 'cart' | 'order';

export interface SurgeRecord {
    id: string;
    city: string;
    regionName: string;
    type: SurgeEventType;
    productName: string;
    timestamp: number;
    ip: string; // The user's IP address (from useIpLocation)
}

// ── In-memory event log (resets on page refresh for demo purposes) ──
const eventLog: SurgeRecord[] = [];

// ── Cooldown registry: prevents spamming the exact same surge alert ──
// Key: "city|productName", Value: timestamp of last surge alert
const surgeCooldowns = new Map<string, number>();

const SURGE_WINDOW_MS = 15 * 60_000; // 15 mins to look back for surges
const SURGE_COOLDOWN_MS = 5 * 60_000; // 5 mins cooldown before firing another alert for same product+city
const MAX_LOG_SIZE = 1000;

export interface SurgeReason {
    isSurge: boolean;
    title?: string;
    message?: string;
    urgency?: 'low' | 'medium' | 'high';
}

/** 
 * Record an event silently into the log.
 * Returns a SurgeReason if this event pushed the aggregation over a surge threshold.
 */
export function processEventForSurge(rec: SurgeRecord): SurgeReason {
    // 1. Record the event
    eventLog.push(rec);
    if (eventLog.length > MAX_LOG_SIZE) {
        eventLog.splice(0, eventLog.length - MAX_LOG_SIZE);
    }

    // 2. Check cooldowns to avoid spam
    const cooldownKey = `${rec.city}|${rec.productName}`;
    const lastSurge = surgeCooldowns.get(cooldownKey) || 0;
    const now = Date.now();
    if (now - lastSurge < SURGE_COOLDOWN_MS) {
        return { isSurge: false }; // Too soon to alert again for this product in this city
    }

    // 3. Analyze rolling window for this product + city
    const windowStart = now - SURGE_WINDOW_MS;
    const recentEvents = eventLog.filter(e =>
        e.productName === rec.productName &&
        e.city === rec.city &&
        e.timestamp >= windowStart
    );

    // Aggregate by IP to see if it's one person obsessed or a broader trend
    const ipCounts = new Map<string, { searches: number, carts: number, orders: number }>();
    let totalCarts = 0;
    let totalOrders = 0;

    recentEvents.forEach(e => {
        const counts = ipCounts.get(e.ip) || { searches: 0, carts: 0, orders: 0 };
        if (e.type === 'search') counts.searches++;
        if (e.type === 'cart') { counts.carts++; totalCarts++; }
        if (e.type === 'order') { counts.orders++; totalOrders++; }
        ipCounts.set(e.ip, counts);
    });

    const uniqueIps = ipCounts.size;
    const thisIpCount = ipCounts.get(rec.ip)!;
    const totalActions = recentEvents.length;

    // ── SURGE RULES ENGINE ──

    // Rule 1: High Intent from Single User (Obsession / Comparison Shopping)
    // If the same IP has looked at / carted this product > 4 times recently
    if (uniqueIps === 1 && totalActions >= 4) {
        surgeCooldowns.set(cooldownKey, now);
        return {
            isSurge: true,
            title: `🎯 High Intent IP in ${rec.city}`,
            message: `A single user in ${rec.city} has interacted with "${rec.productName}" ${totalActions} times in the last 15 mins (${thisIpCount.carts} cart adds, ${thisIpCount.searches} searches). They are highly likely to convert soon.`,
            urgency: 'high'
        };
    }

    // Rule 2: Actual Regional Trend (Viral/Ad driven)
    // If multiple different IPs are carting/ordering the same thing in the same city
    if (uniqueIps >= 3 && (totalCarts >= 2 || totalOrders >= 1)) {
        surgeCooldowns.set(cooldownKey, now);
        return {
            isSurge: true,
            title: `🔥 Viral Surge in ${rec.city}`,
            message: `Sudden spike! ${uniqueIps} different users in ${rec.city} are actively buying/carting "${rec.productName}". Consider boosting local inventory or ads here.`,
            urgency: 'high'
        };
    }

    // Rule 3: Search Spike without conversions (Lost opportunity)
    if (uniqueIps >= 4 && totalCarts === 0 && totalOrders === 0) {
        surgeCooldowns.set(cooldownKey, now);
        return {
            isSurge: true,
            title: `📉 Missed Conversions in ${rec.city}`,
            message: `High visibility but low conversion: 4+ users in ${rec.city} searched for "${rec.productName}" but didn't buy. Check pricing or local delivery times.`,
            urgency: 'medium'
        };
    }

    // Not a surge
    return { isSurge: false };
}

// ── Audio Context unlocked by user interaction ──
let audioCtx: AudioContext | null = null;
let audioUnlocked = false;

export function initAudio() {
    if (audioUnlocked) return;
    try {
        audioCtx = new AudioContext();
        // Play an empty sound to unlock
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        gain.gain.value = 0;
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(0);
        osc.stop(0.1);
        audioUnlocked = true;
    } catch { /* ignore */ }
}

// Attach to document to auto-unlock on first click anywhere in the Dashboard
if (typeof window !== 'undefined') {
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });
}

/** Play a short audio ping using Web Audio API */
export function playAlertSound(urgency: 'low' | 'medium' | 'high'): void {
    try {
        if (!audioCtx) initAudio();
        if (!audioCtx) return;

        // Resume context in case it was suspended by browser policy
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (urgency === 'high') {
            // Triple urgent beep
            osc.frequency.setValueAtTime(880, audioCtx.currentTime);
            osc.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.1);
            osc.frequency.setValueAtTime(1320, audioCtx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.8);
        } else {
            // Soft notice
            osc.frequency.setValueAtTime(600, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.3);
        }
    } catch { /* AudioContext may be blocked without user interaction */ }
}
