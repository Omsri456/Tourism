require('dotenv').config({ override: true });
if (process.env.GEMINI_API_KEY) {
    console.log("GEMINI_API_KEY is present.");
} else {
    console.log("GEMINI_API_KEY is missing!");
}
