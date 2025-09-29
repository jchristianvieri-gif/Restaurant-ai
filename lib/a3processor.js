export async function extractProductInfo(imageFile) {
  try {
    console.log('AI processing image:', imageFile);
    return {
      productName: 'Extracted Product',
      price: 0,
      category: 'Unknown'
    };
  } catch (error) {
    console.error('AI processing error:', error);
    return null;
  }
}

export function fallbackProductDetection(filename) {
  const name = filename.toLowerCase();
  if (name.includes('burger')) return { productName: 'Burger', price: 15000 };
  if (name.includes('pizza')) return { productName: 'Pizza', price: 45000 };
  if (name.includes('coffee')) return { productName: 'Coffee', price: 25000 };
  if (name.includes('nasi')) return { productName: 'Nasi', price: 12000 };
  return { productName: 'Food Item', price: 10000 };
}
