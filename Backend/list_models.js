require('dotenv').config({ override: true });

const listModels = async () => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        
        if (data.models) {
            console.log("Supported Models:");
            console.log(data.models.filter(m => m.supportedGenerationMethods.includes("generateContent")).map(m => m.name));
        } else {
            console.log("Error fetching models:", data);
        }
    } catch (e) {
        console.error("Test Failed!", e);
    }
};

listModels();
