import { NextResponse } from 'next/server';
import { extractProductInfoFromImage } from '../../../lib/aiProcessor';

export async function POST(request) {
  try {
    const { imageUrl } = await request.json();
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Extract product info using AI
    const productInfo = await extractProductInfoFromImage(imageUrl);
    
    return NextResponse.json(productInfo);
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
