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

const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let groqLocked = false;
let lastCallTime = 0;
const COOLDOWN = 2000; // Sirf 2 seconds ka protection

async function generateSummaryAndKeywords(content) {
  if (!content || content.length < 400) return null;

  if (groqLocked) {
    console.warn("🚫 Groq locked due to Rate Limit");
    return null;
  }

  // Double-check cooldown
  if (Date.now() - lastCallTime < COOLDOWN) {
    return null; 
  }

  lastCallTime = Date.now();

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a news summarizer. Return ONLY valid JSON." },
        { 
          role: "user", 
          content: `Return ONLY valid JSON: {"summary":"one paragraph","keywords":["key1","key2"]}\n\nContent: ${content.substring(0, 4000)}` 
        }
      ],
      model: "llama-3.3-70b-versatile", // Ya "llama-3.1-8b-instant" for faster/cheaper calls
      response_format: { type: "json_object" }
    });

    const text = completion.choices[0]?.message?.content;
    return JSON.parse(text);

  } catch (err) {
    if (err.status === 429) {
      groqLocked = true;
      console.error("🚫 Groq RATE LIMIT hit");
    } else {
      console.error("Groq error:", err.message);
    }
    return null;
  }
}

module.exports = { generateSummaryAndKeywords };