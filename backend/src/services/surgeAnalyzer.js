/**
 * Surge Reason Analyzer Service - "Global Insights & SHAP"
 * Correlates internal surges with global news, weather, and trends.
 */

import { generateSurgeReason } from './geminiService.js';
import { fetchNewsHeadlines, fetchWeatherData, fetchGoogleTrends, fetchRedditTrends } from './dataAggregator.js';

const LOCATIONS = ['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Kolkata'];
const CATEGORIES = ['Computers & Tech', 'Home & Kitchen', 'Fashion', 'Health & Beauty', 'Sports & Outdoors'];

let activityLog = [];

/**
 * Records a real-time event from the frontend.
 */
export const recordActivity = (data) => {
    const entry = { ...data, timestamp: Date.now() };
    activityLog.push(entry);
    const thirtyMinsAgo = Date.now() - 30 * 60 * 1000;
    activityLog = activityLog.filter(a => a.timestamp > thirtyMinsAgo);
};

/**
 * Simulates "Normal" Background Traffic
 */
const startBackgroundTraffic = () => {
    setInterval(() => {
        const count = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < count; i++) {
            const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
            recordActivity({
                type: 'view',
                category: cat,
                subcategory: cat === 'Computers & Tech' ? 'Laptops' : 'General',
                location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
                productId: null
            });
        }
    }, 5000);
};

/**
 * SHAP-lite Logic: Calculates contribution of different factors.
 */
const calculateShapContributions = async (surgeData) => {
    const { displayTitle, topLocations, location, category } = surgeData;
    const primaryLocation = topLocations && topLocations.length > 0 ? topLocations[0].name : location;

    // Fetch external data in parallel
    const [news, weather, trends, reddit] = await Promise.all([
        fetchNewsHeadlines(category.toLowerCase().includes('tech') ? 'technology' : 'general'),
        fetchWeatherData(primaryLocation),
        fetchGoogleTrends(displayTitle),
        fetchRedditTrends()
    ]);

    // Simple Scoring heuristic (SHAP-lite)
    const factors = {
        internal_traffic: 0.4, // Baseline weight
        news: 0,
        weather: 0,
        trends: 0
    };

    if (news && news.some(title => title.toLowerCase().includes(displayTitle.toLowerCase()))) {
        factors.news = 0.8;
    }
    if (weather && (weather.condition === 'Rain' || weather.temp > 35)) {
        factors.weather = 0.6;
    }
    if (trends) factors.trends = 0.5;

    // Normalize
    const total = Object.values(factors).reduce((a, b) => a + b, 0);
    const contributions = {};
    for (const key in factors) {
        contributions[key] = Math.round((factors[key] / total) * 100);
    }

    return { contributions, externalData: { news, weather, reddit } };
};

/**
 * Analyzes data for surges.
 */
export const detectRealSurge = () => {
    const now = Date.now();
    const currentWindow = now - 3 * 60 * 1000;
    const thirtyMinsAgo = now - 30 * 60 * 1000;

    const currentLogs = activityLog.filter(a => a.timestamp >= currentWindow);
    const baselineLogs = activityLog.filter(a => a.timestamp >= thirtyMinsAgo && a.timestamp < currentWindow);

    if (currentLogs.length < 3) return null; // Lowered from 5 for easier testing

    const timeScale = 9; // 27 mins / 3 mins

    const stats = { items: {}, cities: {} };
    currentLogs.forEach(a => {
        const key = a.productName || a.subcategory || a.category;
        stats.items[key] = (stats.items[key] || 0) + 1;
        stats.cities[a.location] = (stats.cities[a.location] || 0) + 1;
    });

    const baselineStats = { items: {}, cities: {} };
    baselineLogs.forEach(a => {
        const key = a.productName || a.subcategory || a.category;
        baselineStats.items[key] = (baselineStats.items[key] || 0) + 1;
        baselineStats.cities[a.location] = (baselineStats.cities[a.location] || 0) + 1;
    });

    let topSurge = null;
    let maxGrowth = 0;

    for (const key in stats.items) {
        const current = stats.items[key];
        const avg = (baselineStats.items[key] || 0) / timeScale;
        const growth = Math.floor(((current - Math.max(avg, 0.5)) / Math.max(avg, 0.5)) * 100);

        if (growth > 40 && growth > maxGrowth) { // Lowered threshold from 100% to 40%
            maxGrowth = growth;
            topSurge = { type: 'item', value: key, growth, currentRate: current, avgRate: avg };
        }
    }

    if (!topSurge) return null;

    // Filter logs for this specific product to find where it's surging most
    const surgeLogs = currentLogs.filter(l => (l.productName || l.subcategory || l.category) === topSurge.value);

    // Count occurrences per location
    const locationCounts = {};
    surgeLogs.forEach(l => {
        const loc = l.location || 'Mumbai'; // Default to Mumbai if location is missing
        locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });

    // Sort locations descending
    const topLocations = Object.entries(locationCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    if (topLocations.length === 0) {
        topLocations.push({ name: 'Mumbai', count: 1 }); // Final fallback
    }

    return {
        id: `GLOBAL-SURGE-${Date.now()}`,
        displayTitle: topSurge.value,
        growth: topSurge.growth,
        topLocations: topLocations,
        // Keep the old location string for backward compatibility with other features if needed
        location: topLocations[0].name,
        category: topSurge.value,
        currentRate: topSurge.currentRate,
        baselineRate: topSurge.avgRate
    };
};

export const startSurgeSimulation = (io) => {
    console.log('Surge Analyzer: Global Vision Mode Starting...');
    // Real traffic mode: simulated background traffic is disabled.
    // startBackgroundTraffic();

    setInterval(async () => {
        const surge = detectRealSurge();
        if (surge) {
            console.log(`[Insight] Internal surge in ${surge.displayTitle} detected. Correlating global data...`);

            const { contributions, externalData } = await calculateShapContributions(surge);

            // Generate LLM reasoning with Global Data
            const aiData = {
                ...surge,
                contributions,
                externalData
            };

            const aiText = await generateSurgeReason(aiData);
            const [expPart, actPart] = aiText.split('Action:');

            const finalAlert = {
                ...surge,
                type: 'surge-alert',
                message: `Market Surge: ${surge.displayTitle}`,
                explanation: expPart.replace('Explanation:', '').trim(),
                deepDive: `**Market Intelligence (SHAP Analysis):**\n${Object.entries(contributions).map(([f, p]) => `- ${f}: ${p}%`).join('\n')}\n\n**AI Recommendation:**\n${actPart ? actPart.trim() : 'Optimize Supply.'}`,
                shap: contributions,
                timestamp: new Date().toISOString()
            };

            io.emit('surge-alert', finalAlert);
        }
    }, 20000);
};
