import { GoogleGenerativeAI } from "@google/generative-ai";

export async function extractProductInfoFromImage(imageBuffer) {
  // Check if Google API key is available
  if (!process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY === 'your_google_ai_key_here') {
    throw new Error('Google API key not configured - using fallback');
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    const prompt = `
    Analyze this restaurant menu image and extract the following information:
    - Product name (be specific)
    - Short description (max 30 words)
    - Price in IDR (numeric only)
    
    Return ONLY valid JSON format without any other text:
    {
      "name": "product name here",
      "description": "product description here",
      "price": 25000
    }
    `;

    const imageBase64 = imageBuffer.toString('base64');
    
    const result = await model.generateContent([
      {
        text: prompt,
      },
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg"
        },
      },
    ]);

    const response = await result.response;
    let text = response.text().trim();
    
    // Clean the response - remove markdown code blocks
    text = text.replace(/```json|```/g, '').trim();
    
    // Extract JSON from response
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No JSON found in AI response');
    }
    
    const jsonString = text.substring(jsonStart, jsonEnd);
    const productInfo = JSON.parse(jsonString);
    
    // Validate required fields
    if (!productInfo.name || !productInfo.description || !productInfo.price) {
      throw new Error('AI response missing required fields');
    }
    
    return productInfo;
  } catch (error) {
    console.error("AI Extraction error:", error.message);
    throw error;
  }
}
