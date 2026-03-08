// import { createClient } from 'redis';

class MemoryRedis {
    constructor() {
        this.zSets = {};
        this.hSets = {};
        this.sets = {};
        this.kv = {};
        this.isReady = true;
    }
    on() { }
    async connect() { }

    async zAdd(key, item) {
        if (!this.zSets[key]) this.zSets[key] = [];
        this.zSets[key].push(item);
        this.zSets[key].sort((a, b) => a.score - b.score);
    }
    async zRemRangeByScore(key, min, max) {
        if (!this.zSets[key]) return;
        this.zSets[key] = this.zSets[key].filter(x => x.score > max);
    }
    async zRange(key, start, end) {
        if (!this.zSets[key]) return [];
        return this.zSets[key].map(x => x.value);
    }

    async hIncrBy(key, field, inc) {
        if (!this.hSets[key]) this.hSets[key] = {};
        this.hSets[key][field] = (this.hSets[key][field] || 0) + inc;
    }
    async hGetAll(key) {
        return this.hSets[key] || {};
    }

    async sAdd(key, val) {
        if (!this.sets[key]) this.sets[key] = new Set();
        this.sets[key].add(val);
    }
    async sMembers(key) {
        if (!this.sets[key]) return [];
        return Array.from(this.sets[key]);
    }
    async sRem(key, val) {
        if (this.sets[key]) this.sets[key].delete(val);
    }

    async set(key, val, opts) {
        if (opts && opts.NX) {
            if (this.kv[key]) return null;
        }
        this.kv[key] = val;
        return 'OK';
    }
    async get(key) {
        return this.kv[key];
    }
    async expire(key, secs) { }
}

let redisClient = new MemoryRedis();
let ioInstance;

const WEIGHTS = {
    'SEARCH': 1,
    'CART_ADD': 10,
    'ORDER': 20
};

export async function initSurgeEngine(io) {
    ioInstance = io;
    // redisClient = createClient();

    redisClient.on('error', (err) => console.log('Redis Client Error', err));

    try {
        await redisClient.connect();
        console.log('🔗 Connected to Redis for Surge Engine');

        // Run the metrics calculation every 60 seconds
        setInterval(calculateMetricsAndEmit, 60_000);

        // Initial run
        calculateMetricsAndEmit();
    } catch (err) {
        console.warn('⚠️ Could not connect to Redis. Ensure Redis server is running locally on port 6379.');
    }
}

/**
 * Handle incoming buyer actions from Socket.io or REST
 */
export async function recordBuyerAction(productId, type, city, quantity = 1, productName = '') {
    if (!redisClient || !redisClient.isReady) return;

    const baseWeight = WEIGHTS[type] || 0;
    if (baseWeight === 0) return;

    const weight = baseWeight * quantity;

    const now = Date.now();
    const eventData = {
        id: Math.random().toString(36).substr(2, 5),
        weight, city, type
    };

    const eventsKey = `surge:events:${productId}`;
    const hourlyKey = `surge:hourly:${productId}`;

    // Add to 5-minute sliding window (ZSET)
    await redisClient.zAdd(eventsKey, { score: now, value: JSON.stringify(eventData) });
    await redisClient.expire(eventsKey, 300); // Expiry 5 mins just in case

    // Get current hour key (e.g., "2023-10-27-14")
    const d = new Date();
    const hourField = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-${d.getHours()}`;

    // Add to 24-hour hourly history (HASH)
    await redisClient.hIncrBy(hourlyKey, hourField, weight);
    await redisClient.expire(hourlyKey, 86400 * 2); // Expiry 2 days

    // Track that this product has activity
    await redisClient.sAdd('surge:active_products', productId);

    // Store product name for alerts if provided
    if (productName) {
        await redisClient.set(`surge:name:${productId}`, productName, { EX: 86400 });
    }

    console.log(`[Surge Event] Recorded ${type} for ${productId} (${productName || 'Unknown'}) (+${weight} pts in ${city})`);

    // --- INSTANT RISING SURGE CHECK ---
    try {
        const windowStart = now - (5 * 60_000);
        await redisClient.zRemRangeByScore(eventsKey, '-inf', windowStart);
        const recentEvents = await redisClient.zRange(eventsKey, 0, -1);

        let currentHeatScore = 0;
        for (const evStr of recentEvents) {
            try {
                currentHeatScore += (JSON.parse(evStr).weight || 0);
            } catch (e) { }
        }

        // If it starts rising (e.g. >= 2 heat points) but isn't a massive viral surge yet
        if (currentHeatScore >= 2 && currentHeatScore < 60) {
            const risingCooldownKey = `surge:rising_cooldown:${productId}`;
            const inCooldown = await redisClient.set(risingCooldownKey, '1', { EX: 120, NX: true });

            if (inCooldown && ioInstance) {
                // Special check: was this a bulk order?
                const isBulkOrder = (type === 'ORDER' && quantity >= 5);
                const alertReason = isBulkOrder
                    ? `Sudden Batch Buy! ${quantity} units ordered at once in ${city}!`
                    : `Activity is starting to rise rapidly in ${city}!`;

                console.log(`📈 TRENDING ALERT for ${productId}. Heat: ${currentHeatScore}`);
                ioInstance.emit('trending_surge', {
                    productId,
                    productName: productName || (await redisClient.get(`surge:name:${productId}`)) || 'Unknown Product',
                    heatScore: currentHeatScore,
                    reason: alertReason,
                    city: city,
                    type: isBulkOrder ? 'bulk' : 'trend'
                });
            }
        }
    } catch (err) {
        // Silent catch for background metric eval
    }
}

/**
 * Run every minute to calculate the Heat Score and emit events
 */
async function calculateMetricsAndEmit() {
    if (!redisClient || !redisClient.isReady) return;

    try {
        const productIds = await redisClient.sMembers('surge:active_products');
        console.log(`[Surge Engine] Cron running. Active products: ${productIds.length}`);

        const now = Date.now();
        const windowStart = now - (5 * 60_000); // 5 minutes ago

        for (const productId of productIds) {
            const eventsKey = `surge:events:${productId}`;

            // Remove events older than 5 minutes
            await redisClient.zRemRangeByScore(eventsKey, '-inf', windowStart);

            // Get current 5-minute events
            const recentEvents = await redisClient.zRange(eventsKey, 0, -1);

            // If no recent events, skip (and maybe clean up)
            if (recentEvents.length === 0) {
                await redisClient.sRem('surge:active_products', productId);
                continue;
            }

            // Calculate current Heat Score
            let currentHeatScore = 0;
            let cartVelocity = 0;
            let searchVelocity = 0;
            const cityCounts = {};

            for (const evStr of recentEvents) {
                try {
                    const ev = JSON.parse(evStr);
                    const weight = ev.weight || 0;
                    const city = ev.city || 'Unknown';
                    const type = ev.type || 'UNKNOWN';

                    currentHeatScore += weight;
                    if (type === 'CART_ADD') cartVelocity++;
                    if (type === 'SEARCH') searchVelocity++;

                    cityCounts[city] = (cityCounts[city] || 0) + weight;
                } catch (e) { /* ignore obsolete strings */ }
            }

            // Find top city
            let topCity = 'Unknown';
            let maxCityScore = -1;
            for (const [c, s] of Object.entries(cityCounts)) {
                if (s > maxCityScore) {
                    maxCityScore = s;
                    topCity = c;
                }
            }

            // Get hourly history to calculate 24h average
            const hourlyKey = `surge:hourly:${productId}`;
            const hourlyData = await redisClient.hGetAll(hourlyKey);

            // Only keep last 24 hours (cleanup old fields)
            const d = new Date();
            let total24hHeat = 0;
            let hoursCounted = 0;

            for (let i = 0; i < 24; i++) {
                const hourDate = new Date(d.getTime() - (i * 3600_000));
                const field = `${hourDate.getFullYear()}-${hourDate.getMonth() + 1}-${hourDate.getDate()}-${hourDate.getHours()}`;

                if (hourlyData[field]) {
                    total24hHeat += parseInt(hourlyData[field], 10);
                    hoursCounted++;
                }
            }

            // Calculate Baseline
            // If product is brand new, assume a tiny baseline to avoid dividing by 0 or triggering instantly
            const avgHourlyScore = Math.max((total24hHeat / (hoursCounted || 1)), 5);

            console.log(`[Surge Engine Check] ${productId} | Current 5m Heat: ${currentHeatScore} | 24h Avg Hourly: ${avgHourlyScore.toFixed(2)}`);

            // Trigger Logic: Heat Score > 2.0x average hourly AND current heat > 12 (High Sensitivity for Demo)
            if (currentHeatScore > (2.0 * avgHourlyScore) && currentHeatScore > 12) {
                // Check cooldown to avoid spamming the same surge every minute
                const cooldownKey = `surge:cooldown:${productId}`;
                const inCooldown = await redisClient.set(cooldownKey, '1', { EX: 300, NX: true });

                if (inCooldown) {
                    // Set NX returns "OK" if key was set (meaning not in cooldown)

                    let reason = `High Heat Velocity in ${topCity}`;
                    if (cartVelocity > searchVelocity * 2) {
                        reason = `High Cart-Add Velocity in ${topCity} (Risk of sellout)`;
                    } else if (searchVelocity > 10) {
                        reason = `Massive Search Spike in ${topCity}`;
                    }

                    console.log(`🚀 SURGE DETECTED for product ${productId}. Heat: ${currentHeatScore}, Avg: ${avgHourlyScore.toFixed(2)}`);

                    if (ioInstance) {
                        const storedName = await redisClient.get(`surge:name:${productId}`);
                        ioInstance.emit('pre_viral_surge', {
                            productId,
                            productName: storedName || 'Unknown Product',
                            heatScore: currentHeatScore,
                            velocity: currentHeatScore > 50 ? 'High' : 'Medium',
                            reason,
                            topCity,
                            timestamp: new Date().toISOString()
                        });
                    }
                }
            }
        }
    } catch (err) {
        console.error('Error calculating surge metrics', err);
    }
}
