const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function main() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  // Unfortunately, the SDK doesn't have a direct listModels method on the genAI object.
  // It's usually done via the API directly or a different client.
  // But let's try gemini-1.5-flash-latest and gemini-1.5-pro-latest again, but maybe the version is different.
  
  // Let's try 'gemini-1.0-pro'
  console.log("Checking gemini-1.5-flash...");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  try {
    const result = await model.generateContent("Hello");
    console.log("Success with gemini-1.5-flash:", result.response.text());
  } catch (e) {
    console.error("Failed with gemini-1.5-flash:", e.message);
  }
}

main();
