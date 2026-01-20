import genAI, { GEMINI_CONFIG } from '../config/gemini.js';
import logger from '../utils/logger.js';
import { GRAVITY_PROMPTS, SUMMARY_PROMPTS, CHATBOT_PROMPTS } from '../utils/constants.js';

/**
 * Calculates gravity score (1-3) using Gemini
 * @param {string} messageText 
 * @returns {Promise<number>} Score 1-3
 */
export async function calculateGravityScore(messageText) {
    // Mode simulation
    if (GEMINI_CONFIG.useMockMode) {
        return calculateMockGravityScore(messageText);
    }

    try {
        const model = genAI.getGenerativeModel({
            model: GEMINI_CONFIG.model,
            generationConfig: {
                temperature: GEMINI_CONFIG.temperature.gravityScore,
                maxOutputTokens: 10,
            }
        });

        const prompt = `${GRAVITY_PROMPTS.system}\n\nANALYSE CE MESSAGE DU PATIENT MOINS DE 3 MOTS :\n"${messageText}"\n\nRÉPONSE (chiffre uniquement 1, 2 ou 3) :`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const scoreText = response.text().trim();

        // Extract the first digit found
        const match = scoreText.match(/[1-3]/);
        const score = match ? parseInt(match[0]) : 1;

        logger.info(`Gravity score (Gemini): ${score} for: "${messageText.substring(0, 30)}..."`);
        return score;

    } catch (error) {
        logger.error('Error calculating gravity score with Gemini:', error);
        return 1; // Default to stable
    }
}

/**
 * Calculates mock gravity score based on keywords
 * @param {string} messageText 
 * @returns {number} Score 1-3
 */
function calculateMockGravityScore(messageText) {
    const text = messageText.toLowerCase();
    
    // Score 3 (Critique) - mots très alarmants
    const criticalWords = ['suicide', 'mourir', 'tuer', 'finir', 'désespoir total', 'plus envie de vivre'];
    if (criticalWords.some(word => text.includes(word))) {
        logger.info(`Gravity score (Mock): 3 for: "${messageText.substring(0, 30)}..."`);
        return 3;
    }
    
    // Score 2 (Vigilance) - mots préoccupants
    const warningWords = ['très triste', 'déprimé', 'angoissé', 'panique', 'horrible', 'terrible', 'insupportable'];
    if (warningWords.some(word => text.includes(word))) {
        logger.info(`Gravity score (Mock): 2 for: "${messageText.substring(0, 30)}..."`);
        return 2;
    }
    
    // Score 1 (Stable) - par défaut
    logger.info(`Gravity score (Mock): 1 for: "${messageText.substring(0, 30)}..."`);
    return 1;
}

/**
 * Generates conversation summary using Gemini
 * @param {Array} messages 
 * @returns {Promise<{summary: string, keyTopics: string[]}>}
 */
export async function generateConversationSummary(messages) {
    // Mode simulation
    if (GEMINI_CONFIG.useMockMode) {
        return generateMockSummary(messages);
    }

    try {
        const model = genAI.getGenerativeModel({
            model: GEMINI_CONFIG.model,
            generationConfig: {
                temperature: GEMINI_CONFIG.temperature.summary,
                responseMimeType: "application/json",
            }
        });

        const conversationText = messages
            .map((m) => `${m.sender === 'user' ? 'Patient' : 'IA'} : ${m.text}`)
            .join('\n');

        const prompt = `${SUMMARY_PROMPTS.system}\n\nCONVERSATION :\n${conversationText}\n\nGENERATE JSON :`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const jsonText = response.text();

        try {
            const parsed = JSON.parse(jsonText);
            return {
                summary: parsed.summary || "Résumé non disponible.",
                keyTopics: parsed.keyTopics || []
            };
        } catch (e) {
            logger.error("Failed to parse Gemini JSON response", e);
            return { summary: "Erreur de format.", keyTopics: [] };
        }

    } catch (error) {
        logger.error('Error generating summary with Gemini:', error);
        return { summary: 'Service indisponible.', keyTopics: [] };
    }
}

/**
 * Generates mock summary
 * @param {Array} messages 
 * @returns {Promise<{summary: string, keyTopics: string[]}>}
 */
function generateMockSummary(messages) {
    const messageCount = messages.length;
    const userMessages = messages.filter(m => m.sender === 'user');
    
    const summary = `Conversation de ${messageCount} messages dont ${userMessages.length} du patient. ` +
                   `Le patient a exprimé ses émotions et a reçu un soutien empathique de l'assistant IA. ` +
                   `La conversation s'est déroulée dans un climat d'écoute bienveillante.`;
    
    const keyTopics = ['Expression émotionnelle', 'Soutien psychologique', 'Écoute active'];
    
    logger.info('Summary generated (Mock mode)');
    return { summary, keyTopics };
}

/**
 * Generates AI chatbot response using Gemini
 * @param {Array} messages 
 * @returns {Promise<string>}
 */
export async function generateAIResponse(messages) {
    // Mode simulation si pas de clé API
    if (GEMINI_CONFIG.useMockMode) {
        return generateMockResponse(messages);
    }

    try {
        const model = genAI.getGenerativeModel({
            model: GEMINI_CONFIG.model,
            generationConfig: {
                temperature: GEMINI_CONFIG.temperature.chatbot,
            },
            systemInstruction: CHATBOT_PROMPTS.system
        });

        // Convert history to Gemini format
        // Gemini uses 'user' and 'model' roles
        const history = messages.slice(0, -1).map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
        }));

        const lastMessage = messages[messages.length - 1];

        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(lastMessage.text);
        const response = result.response;
        const text = response.text();

        return text;

    } catch (error) {
        logger.error('Error generating response with Gemini:', error);
        return "Je suis désolé, je rencontre un problème technique. Pouvez-vous répéter ?";
    }
}

/**
 * Generates mock AI response (for development/testing)
 * @param {Array} messages 
 * @returns {Promise<string>}
 */
function generateMockResponse(messages) {
    const lastMessage = messages[messages.length - 1];
    const text = lastMessage.text.toLowerCase();

    // Réponses basées sur les mots-clés
    if (text.includes('bonjour') || text.includes('salut') || text.includes('hello')) {
        return "Bonjour ! Je suis là pour vous écouter. Comment vous sentez-vous aujourd'hui ?";
    }
    
    if (text.includes('triste') || text.includes('déprim') || text.includes('mal')) {
        return "Je comprends que vous vous sentiez ainsi. C'est courageux de partager vos émotions. Voulez-vous m'en dire plus sur ce qui vous affecte ?";
    }
    
    if (text.includes('anxie') || text.includes('stress') || text.includes('angoiss')) {
        return "L'anxiété peut être très difficile à vivre. Vous n'êtes pas seul(e). Qu'est-ce qui vous préoccupe en ce moment ?";
    }
    
    if (text.includes('merci') || text.includes('aide')) {
        return "Je suis heureux de pouvoir vous aider. N'hésitez pas à me parler de tout ce qui vous passe par la tête.";
    }
    
    if (text.includes('comment') && (text.includes('va') || text.includes('allez'))) {
        return "Je vais bien, merci. L'important, c'est vous. Comment puis-je vous aider aujourd'hui ?";
    }

    // Réponse générique empathique
    const responses = [
        "Je vous écoute. Continuez, je suis là pour vous.",
        "Merci de partager cela avec moi. Qu'est-ce que vous ressentez ?",
        "C'est important que vous puissiez exprimer vos émotions. Parlez-moi en plus.",
        "Je comprends. Voulez-vous développer ce que vous venez de dire ?",
        "Prenez votre temps. Je suis là pour vous écouter sans jugement.",
    ];
    
    return responses[messages.length % responses.length];
}

export default {
    calculateGravityScore,
    generateConversationSummary,
    generateAIResponse,
};
