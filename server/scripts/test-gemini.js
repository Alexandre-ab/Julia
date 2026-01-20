import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('❌ GEMINI_API_KEY non définie');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// Liste des modèles à tester
const modelsToTest = [
    'gemini-1.5-pro-latest',
    'gemini-1.5-pro',
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-pro',
    'models/gemini-1.5-pro-latest',
    'models/gemini-1.5-flash-latest',
];

async function testModel(modelName) {
    try {
        console.log(`\n🧪 Test du modèle: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent('Bonjour, réponds juste "OK"');
        const response = result.response;
        const text = response.text();
        
        console.log(`✅ SUCCÈS: ${modelName}`);
        console.log(`   Réponse: ${text}`);
        return true;
    } catch (error) {
        console.log(`❌ ÉCHEC: ${modelName}`);
        console.log(`   Erreur: ${error.message}`);
        return false;
    }
}

async function findWorkingModel() {
    console.log('🔍 Recherche du modèle Gemini fonctionnel...\n');
    
    for (const modelName of modelsToTest) {
        const works = await testModel(modelName);
        if (works) {
            console.log(`\n\n🎉 MODÈLE FONCTIONNEL TROUVÉ: ${modelName}`);
            console.log(`\nMettez à jour gemini.js avec:`);
            console.log(`model: '${modelName}',`);
            process.exit(0);
        }
        // Petite pause entre les tests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n❌ Aucun modèle fonctionnel trouvé.');
    console.log('Vérifiez que votre clé API Gemini est valide.');
    process.exit(1);
}

findWorkingModel();
