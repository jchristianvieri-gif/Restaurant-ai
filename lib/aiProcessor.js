import { useDemoMode, hasOpenAIConfig } from './config';

// Real AI processing dengan OpenAI
async function realAIImageProcessing(imageUrl) {
  try {
    console.log('🔍 REAL AI: Processing image with OpenAI...');
    
    const response = await fetch('/api/ai-process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    
    console.log('✅ REAL AI: Success!', data);
    return data;

  } catch (error) {
    console.error('❌ REAL AI failed:', error);
    throw error;
  }
}

// Demo AI processing (local-friendly)
async function demoAIImageProcessing(imageUrl) {
  console.log('🎭 DEMO AI: Simulating AI processing for:', imageUrl);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
  
  // Smart demo data dengan variasi yang lebih realistis
  const demoProducts = [
    { 
      name: "Gourmet Beef Burger", 
      description: "Premium wagyu beef patty with caramelized onions, aged cheddar, and truffle aioli on brioche bun", 
      price: 85000 + Math.floor(Math.random() * 40000)
    },
    { 
      name: "Truffle Mushroom Pasta", 
      description: "Fresh fettuccine with wild mushrooms, black truffle shavings, and parmesan cream sauce", 
      price: 75000 + Math.floor(Math.random() * 35000)
    },
    { 
      name: "Acai Power Bowl", 
      description: "Organic acai base topped with fresh berries, granola, coconut flakes, and honey drizzle", 
      price: 35000 + Math.floor(Math.random() * 25000)
    },
    { 
      name: "Artisan Cappuccino", 
      description: "Single-origin Ethiopian beans with microfoam latte art, served with house-made biscotti", 
      price: 25000 + Math.floor(Math.random() * 20000)
    },
    { 
      name: "Grilled Salmon Teriyaki", 
      description: "Fresh Atlantic salmon glazed with house teriyaki sauce, served with jasmine rice and vegetables", 
      price: 95000 + Math.floor(Math.random() * 45000)
    },
    { 
      name: "Molten Chocolate Cake", 
      description: "Warm chocolate lava cake with vanilla bean ice cream and fresh berry compote", 
      price: 45000 + Math.floor(Math.random() * 25000)
    },
    {
      name: "Caesar Salad Supreme",
      description: "Crisp romaine lettuce with house-made caesar dressing, parmesan, and garlic croutons",
      price: 55000 + Math.floor(Math.random() * 25000)
    },
    {
      name: "Thai Green Curry",
      description: "Authentic green curry with coconut milk, Thai basil, and choice of protein",
      price: 65000 + Math.floor(Math.random() * 30000)
    }
  ];
  
  const randomProduct = demoProducts[Math.floor(Math.random() * demoProducts.length)];
  
  // Add some randomization to make it feel more realistic
  const variations = [
    { suffix: " Deluxe", priceMultiplier: 1.2 },
    { suffix: " Special", priceMultiplier: 1.1 },
    { suffix: "", priceMultiplier: 1.0 },
    { suffix: " Classic", priceMultiplier: 0.9 }
  ];
  
  const variation = variations[Math.floor(Math.random() * variations.length)];
  
  const result = {
    name: randomProduct.name + variation.suffix,
    description: randomProduct.description,
    price: Math.round(randomProduct.price * variation.priceMultiplier)
  };
  
  console.log('🎭 DEMO AI: Generated product:', result);
  return result;
}

// Main function dengan auto-fallback
export async function extractProductInfoFromImage(imageUrl) {
  if (!imageUrl) {
    throw new Error('Image URL is required');
  }

  if (useDemoMode || !hasOpenAIConfig) {
    console.log('🔄 Using DEMO mode for AI processing');
    return await demoAIImageProcessing(imageUrl);
  }
  
  try {
    console.log('🚀 Using REAL AI processing');
    return await realAIImageProcessing(imageUrl);
  } catch (error) {
    console.log('🔄 Falling back to DEMO mode due to error:', error.message);
    return await demoAIImageProcessing(imageUrl);
  }
}