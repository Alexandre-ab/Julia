import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const USE_MOCK_MODE = process.env.USE_MOCK_AI === 'true' || !apiKey;

if (!apiKey) {
    console.warn('⚠️  GEMINI_API_KEY non définie - Mode simulation activé');
    console.warn('   Pour utiliser l\'IA réelle, ajoutez GEMINI_API_KEY dans .env');
} else if (USE_MOCK_MODE) {
    console.warn('⚠️  Mode simulation activé (USE_MOCK_AI=true)');
}

// Initialize the Google Generative AI with the API key
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Configuration for different use cases
export const GEMINI_CONFIG = {
    model: 'gemini-1.5-pro', // Latest stable model
    temperature: {
        gravityScore: 0.1, // Low temperature for consistent scoring
        summary: 0.3,      // Low temperature for factual summaries
        chatbot: 0.7,      // Higher temperature for natural conversation
    },
    useMockMode: USE_MOCK_MODE,
};

export default genAI;
