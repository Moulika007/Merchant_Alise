export const getDemandPrediction = (req, res) => {
    const { orderHistory, currentOrdersPerMin } = req.body;

    if (
        !orderHistory ||
        !Array.isArray(orderHistory) ||
        orderHistory.length < 2 ||
        typeof currentOrdersPerMin !== 'number' ||
        Number.isNaN(currentOrdersPerMin)
    ) {
        return res.status(400).json({ success: false, error: 'Invalid order history data' });
    }

    const round = (value) => Math.round(value * 100) / 100;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const getTrendThreshold = (baseline) => Math.max(0.03, baseline * 0.12);

    const recentOrders = orderHistory.slice(-6);
    const trends = recentOrders.slice(1).map((point, index) => {
        return point.ordersPerMin - recentOrders[index].ordersPerMin;
    });

    const avgTrend = round(trends.reduce((sum, trend) => sum + trend, 0) / Math.max(trends.length, 1));
    const latestDelta = trends[trends.length - 1] ?? 0;
    const baselineOrders = recentOrders.slice(0, -1).map((point) => point.ordersPerMin);
    const baseline = baselineOrders.length
        ? baselineOrders.reduce((sum, value) => sum + value, 0) / baselineOrders.length
        : currentOrdersPerMin;
    const threshold = getTrendThreshold(Math.max(baseline, currentOrdersPerMin, 0.1));

    let trendDirection = 'stable';
    if (latestDelta > threshold || avgTrend > threshold * 0.6) {
        trendDirection = 'growing';
    } else if (latestDelta < -threshold || avgTrend < -threshold * 0.6) {
        trendDirection = 'cooling';
    }

    const peakReference = Math.max(...recentOrders.map((point) => point.ordersPerMin), currentOrdersPerMin);
    const isPeaking = currentOrdersPerMin >= peakReference * 0.92 && Math.abs(latestDelta) <= threshold;
    const trendStrength = Math.max(Math.abs(avgTrend), Math.abs(latestDelta), threshold);

    let predictedDuration = 0;
    if (trendDirection === 'growing') {
        predictedDuration = 45 + currentOrdersPerMin * 18 + trendStrength * 55;
    } else if (trendDirection === 'cooling') {
        predictedDuration = (Math.max(currentOrdersPerMin, threshold) / trendStrength) * 12;
    } else {
        predictedDuration = 30 + currentOrdersPerMin * 15;
    }

    const clampedDuration = Math.round(clamp(predictedDuration, 15, 240));
    
    res.json({
        success: true,
        prediction: {
            trendDirection,
            avgTrend,
            predictedDuration: clampedDuration,
            isPeaking,
            recommendation: getRecommendation(trendDirection, clampedDuration, isPeaking)
        }
    });
};

const getRecommendation = (trend, duration, isPeaking) => {
    if (trend === 'growing') {
        return duration > 90
            ? 'Demand is still building. Prepare extra stock and keep pricing under review.'
            : 'Demand is rising. Keep inventory ready while monitoring the surge closely.';
    } else if (trend === 'cooling') {
        return duration <= 45
            ? 'Demand is cooling quickly. Plan for sales to normalize soon.'
            : 'Demand is easing, but the surge may continue for a short period.';
    } else if (isPeaking) {
        return 'Demand is near its peak. Stay ready for either a short extension or cooldown.';
    } else {
        return 'Demand is stable for now. Maintain inventory and watch for the next shift in momentum.';
    }
};

export const getSmartRecommendations = (req, res) => {
    const { currentOrdersPerMin, avgOrdersPerMin, productStock, growthPercent, regionalDemand } = req.body;

    const numericFields = [currentOrdersPerMin, avgOrdersPerMin, productStock, growthPercent, regionalDemand];
    if (numericFields.some((value) => typeof value !== 'number' || Number.isNaN(value))) {
        return res.status(400).json({ success: false, error: 'All analytics inputs must be valid numbers.' });
    }

    const round = (value) => Math.round(value * 100) / 100;
    const normalizedRegionalDemand = regionalDemand <= 1 ? regionalDemand * 100 : regionalDemand;
    const predictedDemand = round(Math.max(0, currentOrdersPerMin) * 30);
    const safeProductStock = Math.max(0, productStock);
    const recommendations = [];

    if (safeProductStock < predictedDemand) {
        recommendations.push({
            label: 'Restock inventory immediately',
            reason: 'Projected 30-minute demand is higher than current stock.',
            priority: 'high',
        });
    }

    if (growthPercent > 200) {
        recommendations.push({
            label: 'Increase price by 5%',
            reason: 'Demand growth is above the 200% surge threshold.',
            priority: 'medium',
        });
    }

    if (growthPercent > 150 && safeProductStock > predictedDemand) {
        recommendations.push({
            label: 'Promote product on homepage',
            reason: 'Demand is surging and current stock can support more visibility.',
            priority: 'medium',
        });
    }

    if (normalizedRegionalDemand > 70) {
        recommendations.push({
            label: 'Activate nearest warehouse',
            reason: 'Regional demand concentration is above 70%.',
            priority: 'medium',
        });
    }

    res.json({
        success: true,
        predictedDemand,
        recommendations,
        inputs: {
            currentOrdersPerMin: round(currentOrdersPerMin),
            avgOrdersPerMin: round(avgOrdersPerMin),
            productStock: safeProductStock,
            growthPercent: round(growthPercent),
            regionalDemand: round(normalizedRegionalDemand),
        },
        timestamp: new Date().toISOString(),
    });
};
