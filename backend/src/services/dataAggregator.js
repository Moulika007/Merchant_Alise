import axios from 'axios';
import googleTrends from 'google-trends-api';
import dotenv from 'dotenv';

dotenv.config();

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

/**
 * Fetches real-time trending topics from Google Trends.
 */
export const fetchGoogleTrends = async (keyword = 'e-commerce') => {
    try {
        const results = await googleTrends.interestOverTime({ keyword: keyword });
        return JSON.parse(results);
    } catch (error) {
        console.warn('Google Trends API Error (likely rate limited):', error.message);
        return null; // Fallback to null
    }
};

/**
 * Fetches recent news headlines related to a category.
 */
export const fetchNewsHeadlines = async (category = 'general') => {
    if (!NEWS_API_KEY) return null;
    try {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
            params: {
                category: category,
                apiKey: NEWS_API_KEY,
                language: 'en',
                pageSize: 5
            }
        });
        return response.data.articles.map(a => a.title);
    } catch (error) {
        console.error('NewsAPI Error:', error.message);
        return null;
    }
};

/**
 * Fetches current weather for a location.
 */
export const fetchWeatherData = async (city = 'Mumbai') => {
    if (!WEATHER_API_KEY) return null;
    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: city,
                appid: WEATHER_API_KEY,
                units: 'metric'
            }
        });
        return {
            temp: response.data.main.temp,
            condition: response.data.weather[0].main,
            description: response.data.weather[0].description
        };
    } catch (error) {
        console.error('Weather API Error:', error.message);
        return null;
    }
};

/**
 * Fetches recent reddit deal trends.
 */
export const fetchRedditTrends = async () => {
    try {
        const response = await axios.get('https://www.reddit.com/r/deals/new.json?limit=5');
        return response.data.data.children.map(post => post.data.title);
    } catch (error) {
        console.error('Reddit API Error:', error.message);
        return null;
    }
};
