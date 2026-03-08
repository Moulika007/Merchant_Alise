import type { Order } from '../context/StoreContext';
import type { Product } from '../mockData';

export interface SmartActionAnalyticsInput {
    currentOrdersPerMin: number;
    avgOrdersPerMin: number;
    productStock: number;
    growthPercent: number;
    regionalDemand: number;
}

export interface SmartActionRecommendation {
    label: string;
    reason: string;
    priority: 'high' | 'medium';
}

export interface SmartActionAnalyticsResponse {
    predictedDemand: number;
    recommendations: SmartActionRecommendation[];
    inputs: SmartActionAnalyticsInput;
}

export interface DemandHistoryPoint {
    ordersPerMin: number;
    timestamp: string;
}

export interface DemandPrediction {
    trendDirection: 'growing' | 'stable' | 'cooling';
    avgTrend: number;
    predictedDuration: number;
    isPeaking: boolean;
    recommendation: string;
}

const ANALYSIS_WINDOW_MINUTES = 30;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round = (value: number) => Math.round(value * 100) / 100;

const getRecentUnitsForProduct = (productId: string, orders: Order[]) => {
    const now = Date.now();

    return orders.reduce((totalUnits, order) => {
        const orderTime = new Date(order.date).getTime();
        if (Number.isNaN(orderTime)) return totalUnits;

        const ageInMinutes = (now - orderTime) / 60000;
        if (ageInMinutes > ANALYSIS_WINDOW_MINUTES) return totalUnits;

        const productUnits = order.items.reduce((sum, item) => {
            return item.product.id === productId ? sum + item.quantity : sum;
        }, 0);

        return totalUnits + productUnits;
    }, 0);
};

const getHistoricalAverageUnits = (product: Product) => {
    if (!product?.salesHistory?.length) return 0;
    const totalUnits = product.salesHistory.reduce((sum, point) => sum + point.sales, 0);
    return totalUnits / product.salesHistory.length;
};

const getHistoricalMomentumUnits = (product: Product) => {
    if (!product?.salesHistory?.length) return 0;

    const latestSales = product.salesHistory[product.salesHistory.length - 1]?.sales ?? 0;
    const previousSales = product.salesHistory[product.salesHistory.length - 2]?.sales ?? latestSales;
    return latestSales + Math.max(0, latestSales - previousSales);
};

export const buildSmartActionAnalyticsInput = (
    product: Product,
    orders: Order[]
): SmartActionAnalyticsInput => {
    const recentUnits = getRecentUnitsForProduct(product.id, orders);
    const averageUnits = getHistoricalAverageUnits(product);
    const momentumUnits = getHistoricalMomentumUnits(product);

    const currentWindowUnits = Math.max(recentUnits, momentumUnits, averageUnits > 0 ? averageUnits * 1.1 : 0);
    const currentOrdersPerMin = round(currentWindowUnits / ANALYSIS_WINDOW_MINUTES);
    const avgOrdersPerMin = round((averageUnits || currentWindowUnits || 1) / ANALYSIS_WINDOW_MINUTES);
    const growthPercent = avgOrdersPerMin > 0
        ? round(((currentOrdersPerMin - avgOrdersPerMin) / avgOrdersPerMin) * 100)
        : 0;

    const regionalDemand = round(clamp(
        42 + Math.max(0, growthPercent) * 0.18 + (product.isTrending ? 16 : 0) + (product.isLowStock ? 10 : 0) + (recentUnits > 0 ? 12 : 0),
        10,
        100
    ));

    return {
        currentOrdersPerMin,
        avgOrdersPerMin,
        productStock: product.stock,
        growthPercent,
        regionalDemand,
    };
};

export const applySmartActionRules = (
    input: SmartActionAnalyticsInput
): SmartActionAnalyticsResponse => {
    const predictedDemand = round(input.currentOrdersPerMin * ANALYSIS_WINDOW_MINUTES);
    const recommendations: SmartActionRecommendation[] = [];

    if (input.productStock < predictedDemand) {
        recommendations.push({
            label: 'Restock inventory immediately',
            reason: 'Projected 30-minute demand is higher than current stock.',
            priority: 'high',
        });
    }

    if (input.growthPercent > 200) {
        recommendations.push({
            label: 'Increase price by 5%',
            reason: 'Demand growth is above the 200% surge threshold.',
            priority: 'medium',
        });
    }

    if (input.growthPercent > 150 && input.productStock > predictedDemand) {
        recommendations.push({
            label: 'Promote product on homepage',
            reason: 'Demand is surging and stock can still support additional visibility.',
            priority: 'medium',
        });
    }

    if (input.regionalDemand > 70) {
        recommendations.push({
            label: 'Activate nearest warehouse',
            reason: 'Regional demand concentration is above 70%.',
            priority: 'medium',
        });
    }

    return {
        predictedDemand,
        recommendations,
        inputs: input,
    };
};

const getTrendThreshold = (baseline: number) => Math.max(0.03, baseline * 0.12);

const getDemandPredictionRecommendation = (
    trendDirection: DemandPrediction['trendDirection'],
    predictedDuration: number,
    isPeaking: boolean
) => {
    if (trendDirection === 'growing') {
        return predictedDuration > 90
            ? 'Demand is still building. Prepare extra stock and keep pricing under review.'
            : 'Demand is rising. Keep inventory ready while monitoring the surge closely.';
    }

    if (trendDirection === 'cooling') {
        return predictedDuration <= 45
            ? 'Demand is cooling quickly. Plan for sales to normalize soon.'
            : 'Demand is easing, but the surge may continue for a short period.';
    }

    if (isPeaking) {
        return 'Demand is near its peak. Stay ready for either a short extension or cooldown.';
    }

    return 'Demand is stable for now. Maintain inventory and watch for the next shift in momentum.';
};

export const buildDemandPredictionOrderHistory = (
    product: Product,
    currentOrdersPerMin: number
): DemandHistoryPoint[] => {
    const history = (product?.salesHistory || []).map((sh, idx, salesHistory) => {
        const previousSales = salesHistory[idx - 1]?.sales ?? sh.sales;
        const projectedUnits = sh.sales + Math.max(0, sh.sales - previousSales);

        return {
            ordersPerMin: round(projectedUnits / ANALYSIS_WINDOW_MINUTES),
            timestamp: sh.date,
        };
    });

    if (!history.length) return [];

    const latestPoint = history[history.length - 1];
    if (Math.abs(latestPoint.ordersPerMin - currentOrdersPerMin) > 0.01) {
        history.push({
            ordersPerMin: round(currentOrdersPerMin),
            timestamp: new Date().toISOString(),
        });
    }

    return history.slice(-6);
};

export const predictDemandCooldown = (
    orderHistory: DemandHistoryPoint[],
    currentOrdersPerMin: number
): DemandPrediction => {
    const recentOrders = orderHistory.slice(-6);
    const deltas = recentOrders.slice(1).map((point, index) => {
        return point.ordersPerMin - recentOrders[index].ordersPerMin;
    });

    const avgTrend = round(deltas.reduce((sum, delta) => sum + delta, 0) / Math.max(deltas.length, 1));
    const latestDelta = deltas[deltas.length - 1] ?? 0;
    const baselineRates = recentOrders.slice(0, -1).map((point) => point.ordersPerMin);
    const baseline = baselineRates.length
        ? baselineRates.reduce((sum, value) => sum + value, 0) / baselineRates.length
        : currentOrdersPerMin;
    const threshold = getTrendThreshold(Math.max(baseline, currentOrdersPerMin, 0.1));

    let trendDirection: DemandPrediction['trendDirection'] = 'stable';
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

    return {
        trendDirection,
        avgTrend,
        predictedDuration: clampedDuration,
        isPeaking,
        recommendation: getDemandPredictionRecommendation(trendDirection, clampedDuration, isPeaking),
    };
};