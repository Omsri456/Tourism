const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handleChat = async (req, res) => {
    try {
        const { message, chatHistory } = req.body;
        
        if (!message) {
            return res.status(400).json({ message: "Message is required." });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "AI API key missing." });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const systemPrompt = "You are a friendly, helpful, and highly knowledgeable AI Assistant for Jharkhand Tourism. Provide short, concise, and exciting answers related to traveling in Jharkhand, its tribes, waterfalls, wildlife, and culture. Don't use markdown formatting in a way that breaks plain text completely, but standard short paragraphs are fine.";
        
        // Build history context if provided
        let historyPrompt = "";
        if (chatHistory && Array.isArray(chatHistory)) {
             historyPrompt = "Recent Conversation:\n";
             chatHistory.slice(-5).forEach(m => {
                 historyPrompt += `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}\n`;
             });
        }

        const finalPrompt = `${systemPrompt}\n\n${historyPrompt}\nUser: ${message}\nAssistant:`;

        const result = await model.generateContent(finalPrompt);
        const responseText = result.response.text();

        res.status(200).json({ response: responseText });

    } catch (error) {
        console.error("Error handling AI chat:", error);
        res.status(500).json({ message: "Failed to communicate with AI chat." });
    }
};
