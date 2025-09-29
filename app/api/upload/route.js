import { NextResponse } from 'next/server';

export async function POST(request) {
  return NextResponse.json({ 
    message: 'Upload API is under maintenance',
    name: 'New Product',
    description: 'Product description',
    price: 25000
  });
}
