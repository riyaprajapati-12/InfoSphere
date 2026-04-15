//https://console.groq.com/keys

// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // 🔒 Global protection
// let geminiLocked = false;
// let lastCallTime = 0;

// const COOLDOWN = 60 * 1000; // 1 minute cooldown

// async function generateSummaryAndKeywords(content) {
//   if (!content || content.length < 1200) return null;

//   // 🚫 If Gemini already blocked
//   if (geminiLocked) {
//     console.warn("🚫 Gemini locked for this session");
//     return null;
//   }

//   // ⏳ Cooldown check
//   if (Date.now() - lastCallTime < COOLDOWN) {
//     console.log("⏳ Gemini cooldown active");
//     return null;
//   }

//   lastCallTime = Date.now();

//   try {
//     const model = genAI.getGenerativeModel({
//     // model: "gemini-2.0-flash"  https://console.groq.com/keys
//     model: "gemini-2.5-flash-lite"
//     });

//     const prompt = `
// Return ONLY valid JSON.
// {"summary":"One paragraph summary","keywords":["key1","key2"]}

// Content:
// ${content.substring(0, 1500)}
// `;

//     const result = await model.generateContent(prompt);
//     const text = result.response.text();

//     return JSON.parse(
//       text.replace(/```json|```/g, "").trim()
//     );

//   } catch (err) {
//     if (err.message?.includes("429")) {
//       geminiLocked = true; // 🔒 lock Gemini
//       console.error("🚫 Gemini RATE LIMIT hit – locked");
//     } else {
//       console.error("Gemini error:", err.message);
//     }
//     return null;
//   }
// }

// module.exports = { generateSummaryAndKeywords };

// const Groq = require("groq-sdk");
// require("dotenv").config();

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// let groqLocked = false;
// let lastCallTime = 0;
// const COOLDOWN = 2000; // Sirf 2 seconds ka protection

// async function generateSummaryAndKeywords(content, targetLanguage = 'English') {
//   if (!content || content.length < 400) return null;

//   if (groqLocked) {
//     console.warn("🚫 Groq locked due to Rate Limit");
//     return null;
//   }

//   // Double-check cooldown
//   if (Date.now() - lastCallTime < COOLDOWN) {
//     return null; 
//   }

//   lastCallTime = Date.now();

//   try {
//     const completion = await groq.chat.completions.create({
//     messages: [
//       { role: "system", content: `You are a news summarizer. Return ONLY valid JSON in ${targetLanguage}.` },
//       { 
//         role: "user", 
//         content: `Return ONLY valid JSON: {"summary":"one paragraph in ${targetLanguage}","keywords":["key1","key2"]}\n\nContent: ${content.substring(0, 4000)}` 
//       }
//     ],
//       model: "llama-3.3-70b-versatile", // Ya "llama-3.1-8b-instant" for faster/cheaper calls
//       response_format: { type: "json_object" }
//     });

//     const text = completion.choices[0]?.message?.content;
//     return JSON.parse(text);

//   } catch (err) {
//     if (err.status === 429) {
//       groqLocked = true;
//       console.error("🚫 Groq RATE LIMIT hit");
//     } else {
//       console.error("Groq error:", err.message);
//     }
//     return null;
//   }
// }

// module.exports = { generateSummaryAndKeywords };

const Groq = require("groq-sdk");
require("dotenv").config();

// Ensure the API key exists or the server will crash on startup
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let groqLocked = false;
let lastCallTime = 0;
const COOLDOWN = 2000; // 2 seconds between calls

async function generateSummaryAndKeywords(content, targetLanguage = 'English') {
  // 1. Return an object instead of null to prevent Express "TypeError"
  if (!content || typeof content !== 'string' || content.length < 400) {
    return { summary: "Article content is too short for a neural summary.", keywords: [] };
  }

  // 2. Handling the Lock
  if (groqLocked) {
    console.warn("🚫 Groq locked: Cooling down...");
    return { summary: "The AI is currently at capacity. Please try again in a minute.", keywords: [] };
  }

  // 3. Handling the Cooldown
  const timeSinceLastCall = Date.now() - lastCallTime;
  if (timeSinceLastCall < COOLDOWN) {
    console.warn(`⏳ Cooldown active: ${COOLDOWN - timeSinceLastCall}ms remaining`);
    return { summary: "Summarizing too quickly. Please wait a second.", keywords: [] };
  }

  lastCallTime = Date.now();

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: `You are a professional news summarizer. Return ONLY a JSON object in ${targetLanguage}.` 
        },
        { 
          role: "user", 
          content: `Return ONLY valid JSON: {"summary":"one paragraph in ${targetLanguage}","keywords":["key1","key2"]}\n\nContent: ${content.substring(0, 5000)}` 
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    });

    const text = completion.choices[0]?.message?.content;
    return JSON.parse(text);

  } catch (err) {
    if (err.status === 429) {
      groqLocked = true;
      console.error("🚫 Groq RATE LIMIT hit. Locking for 60 seconds.");
      
      // FIX: Auto-unlock after 60 seconds so the server works again
      setTimeout(() => {
        groqLocked = false;
        console.log("🔓 Groq unlocked. Ready for requests.");
      }, 60000);

      return { summary: "Rate limit reached. Summary service will resume shortly.", keywords: [] };
    } 
    
    console.error("Groq error:", err.message);
    // Return a valid object so the frontend can still render the UI
    return { summary: "An unexpected error occurred during synthesis.", keywords: [] };
  }
}

module.exports = { generateSummaryAndKeywords };