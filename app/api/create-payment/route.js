import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Simulasi payment berhasil
    return NextResponse.json({
      success: true,
      token: 'mock-token-' + Date.now(),
      order_id: 'order-' + Date.now()
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: 'Payment failed' 
    }, { status: 500 });
  }
}
