import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function createProductFromImage(imageFile) {
  try {
    // Convert image to base64
    const buffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
    Analyze this restaurant product image and extract:
    1. Product name (in English)
    2. Short description (max 20 words)
    3. Estimated price in USD (just number)
    
    Format response as JSON: {name: "", description: "", price: number}
    `;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          mimeType: imageFile.type,
          data: base64Image
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{.*\}/s);
    if (!jsonMatch) throw new Error('Failed to parse AI response');
    
    const productData = JSON.parse(jsonMatch[0]);
    
    // Save to Supabase
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image_url: `product-${Date.now()}.jpg`
      }])
      .select();

    if (error) throw error;
    return data[0];
    
  } catch (error) {
    console.error('AI Processing Error:', error);
    throw new Error('Failed to process image with AI');
  }
}

import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
