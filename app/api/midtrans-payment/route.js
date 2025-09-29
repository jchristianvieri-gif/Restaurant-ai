import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const orderDetails = await request.json();
    
    // Simulate Midtrans response
    const mockResponse = {
      token: 'mock-token-' + Date.now(),
      redirect_url: 'https://sandbox.midtrans.com/snap/v2/vtweb/' + Date.now()
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
  }
}
