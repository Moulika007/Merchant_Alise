import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

/**
 * Generates a human-like explanation for a surge using Gemini, including Global Insights and SHAP factors.
 * STRICTURE: Must start with "[Product] is in demand in [Location] due to [Reason]"
 */
export const generateSurgeReason = async (data) => {
    const { displayTitle, growth, location, topLocations, currentRate, baselineRate, contributions, externalData } = data;

    const locationContext = location;

    const prompt = `
    You are a Global E-commerce Intelligence Analyst.
    
    DATA:
    - Item: ${displayTitle}
    - Growth: ${growth}% spike.
    - Location: ${locationContext}
    - Insights: ${JSON.stringify(externalData)}

    TASK:
    1. Start your response with exactly this sentence structure: "${displayTitle} is in demand in ${locationContext} due to [Direct Reason from Insights]".
    2. Then, provide a 2-sentence deep dive into the underlying data (News, Weather, or Trends).
    3. End with one specific business Action.

    FORMAT:
    Explanation: [Structured sentence + deep dive]
    Action: [Strategic recommendation]
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return `Explanation: ${displayTitle} is in demand in ${locationContext} due to high market volatility. \nAction: Monitor supply chain closely.`;
    }
};

/**
 * Handles interactive follow-up chat messages about a market surge.
 */
export const generateChatResponse = async (message, context) => {
    const prompt = `
    You are the "Merchant Aisle Market Specialist", a professional AI analyst.
    
    SURGE CONTEXT:
    ${JSON.stringify(context)}

    USER MESSAGE:
    "${message}"

    TASK:
    Respond to the user's question or comment about this specific market surge. 
    Be professional, data-driven, and encouraging. 
    Keep responses concise (max 3-4 sentences). 
    If they ask about stock or inventory, give strategic advice.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "I'm currently analyzing the deeper market trends. Please try again in a moment.";
    }
};
