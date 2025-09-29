import { useDemoMode } from './config';

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

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    
    console.log('✅ REAL AI: Success!', data);
    return data;

  } catch (error) {
    console.error('❌ REAL AI failed:', error);
    throw error; // Propagate error untuk fallback
  }
}

// Demo AI processing (local-friendly)
async function demoAIImageProcessing(imageUrl) {
  console.log('🎭 DEMO AI: Simulating AI processing...');
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Smart demo data based on filename or random
  const demoProducts = [
    { name: "Gourmet Burger", description: "Premium beef patty with fresh vegetables and special sauce", price: 65000 },
    { name: "Truffle Pasta", description: "Fresh pasta with black truffle and parmesan cream sauce", price: 85000 },
    { name: "Rainbow Smoothie Bowl", description: "Acai base topped with fresh fruits and granola", price: 45000 },
    { name: "Artisan Coffee", description: "Single-origin coffee with beautiful latte art", price: 35000 },
    { name: "Salmon Teriyaki", description: "Grilled salmon glazed with teriyaki sauce over rice", price: 75000 },
    { name: "Chocolate Lava Cake", description: "Warm chocolate cake with melting center and ice cream", price: 55000 }
  ];
  
  const randomProduct = demoProducts[Math.floor(Math.random() * demoProducts.length)];
  console.log('🎭 DEMO AI: Generated product:', randomProduct);
  
  return randomProduct;
}

// Main function dengan auto-fallback
export async function extractProductInfoFromImage(imageUrl) {
  if (useDemoMode) {
    console.log('🔄 Using DEMO mode for AI processing');
    return await demoAIImageProcessing(imageUrl);
  }
  
  try {
    console.log('🚀 Using REAL AI processing');
    return await realAIImageProcessing(imageUrl);
  } catch (error) {
    console.log('🔄 Falling back to DEMO mode due to error');
    return await demoAIImageProcessing(imageUrl);
  }
}
