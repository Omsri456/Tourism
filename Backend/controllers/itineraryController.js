const { GoogleGenerativeAI } = require('@google/generative-ai');
const Destination = require('../models/Destination');
const Accommodation = require('../models/Accommodation');
const CulturalExperience = require('../models/CulturalExperience');

exports.generateItinerary = async (req, res) => {
    try {
        const { budget, days, interests } = req.body;
        
        if (!budget || !days || !interests) {
            return res.status(400).json({ message: "Budget, days, and interests are required." });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: "AI API key missing. Please ask administrator to configure GEMINI_API_KEY." });
        }

        // Fetch real data to provide to Gemini
        const allDestinations = await Destination.find().select('name category entryFee description');
        const allAccommodations = await Accommodation.find().select('name type pricePerNight location');
        const allExperiences = await CulturalExperience.find().select('title category price location duration');

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are an expert local tour guide for Jharkhand Tourism.
Create an exciting, logical itinerary based on these constraints:
- Budget: ₹${budget}
- Duration: ${days} days
- User Interests: ${interests}

CRITICAL RULES:
1. You MUST ONLY recommend places, stays, and experiences from the provided "Available Database Records" below. Do not hallucinate or invent places.
2. Provide exactly 2 different itinerary options (e.g., Option 1 could be Action-packed, Option 2 Relaxed).
3. Compute 'totalCost' realistically based on prices provided and number of days.
4. Output your response STRICTLY as valid JSON matching this exact structure, with no markdown code blocks outside the JSON:

{
  "options": [
    {
      "optionId": 1,
      "title": "String (e.g., 'Nature Escape')",
      "totalCost": 5000,
      "isWithinBudget": true,
      "plan": [
        {
          "day": 1,
          "theme": "String",
          "activities": ["String", "String"],
          "stay": "String (Name of accommodation)"
        }
      ]
    }
  ]
}

Available Database Records:
Destinations: ${JSON.stringify(allDestinations)}
Accommodations: ${JSON.stringify(allAccommodations)}
Experiences: ${JSON.stringify(allExperiences)}
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Gemini sometimes wraps JSON in markdown block ```json ... ```
        let jsonStr = responseText.trim();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.substring(7);
            if (jsonStr.endsWith('```')) {
                jsonStr = jsonStr.substring(0, jsonStr.length - 3);
            }
        } else if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.substring(3);
            if (jsonStr.endsWith('```')) {
                jsonStr = jsonStr.substring(0, jsonStr.length - 3);
            }
        }

        const parsedResult = JSON.parse(jsonStr.trim());
        res.status(200).json(parsedResult);

    } catch (error) {
        console.error("Error generating itinerary via Gemini:", error);
        res.status(500).json({ message: "Failed to generate itinerary with AI. Please try again." });
    }
};
