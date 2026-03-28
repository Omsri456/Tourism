require('dotenv').config({ override: true });
const { GoogleGenerativeAI } = require('@google/generative-ai');

const runTest = async () => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
You are an expert local tour guide for Jharkhand Tourism.
Create an exciting, logical itinerary based on these constraints:
- Budget: ₹15000
- Duration: 2 days
- User Interests: Nature

CRITICAL RULES:
1. Provide exactly 2 different itinerary options.
2. Output your response STRICTLY as valid JSON matching this exact structure, with no markdown code blocks outside the JSON:

{
  "options": [
    {
      "optionId": 1,
      "title": "String",
      "totalCost": 5000,
      "isWithinBudget": true,
      "plan": [
        {
          "day": 1,
          "theme": "String",
          "activities": ["String", "String"],
          "stay": "String"
        }
      ]
    }
  ]
}

Available Database Records:
Destinations: [{"name":"Netarhat","category":"Nature tourism"}]
Accommodations: [{"name":"Eco Resort","type":"Eco-lodge","pricePerNight":2500}]
Experiences: [{"title":"Sunrise Hike","category":"Other","price":200}]
`;

        console.log("Generating content...");
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log("Raw Response:", responseText);

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
        console.log("Parsed JSON:", JSON.stringify(parsedResult, null, 2));
    } catch (e) {
        console.error("Test Failed!", e);
    }
};

runTest();
