import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    console.log('🤖 Processing image with OpenAI GPT-4 Vision...');

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this food image and extract product information. Return ONLY a valid JSON object with these exact fields:
              {
                "name": "product name in Indonesian",
                "description": "appetizing description in Indonesian (max 100 chars)",
                "price": number (in Indonesian Rupiah, realistic restaurant pricing)
              }
              
              Make the description sound appetizing and professional for a restaurant menu. Price should be realistic for Indonesian restaurant (15000-150000 range).`
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "low"
              }
            }
          ]
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    const content = response.choices[0].message.content.trim();
    console.log('🤖 OpenAI Response:', content);

    // Parse JSON response
    let productInfo;
    try {
      // Remove any markdown formatting if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      productInfo = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate required fields
    if (!productInfo.name || !productInfo.description || !productInfo.price) {
      throw new Error('Missing required fields in AI response');
    }

    // Ensure price is a number
    productInfo.price = parseInt(productInfo.price);

    console.log('✅ AI Processing successful:', productInfo);
    return NextResponse.json(productInfo);

  } catch (error) {
    console.error('❌ AI Processing error:', error);
    
    // Return specific error messages
    if (error.code === 'insufficient_quota') {
      return NextResponse.json({ 
        error: 'OpenAI quota exceeded. Please check your billing.' 
      }, { status: 429 });
    }
    
    if (error.code === 'invalid_api_key') {
      return NextResponse.json({ 
        error: 'Invalid OpenAI API key' 
      }, { status: 401 });
    }

    return NextResponse.json({ 
      error: `AI processing failed: ${error.message}` 
    }, { status: 500 });
  }
}