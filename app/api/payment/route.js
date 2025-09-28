import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { amount, items } = await request.json();
    
    // Simulate Midtrans API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock Midtrans response
    const mockResponse = {
      token: 'mock-token-' + Date.now(),
      redirect_url: 'https://sandbox.midtrans.com/snap/v2/vtweb/' + Date.now(),
      order_id: 'order-' + Date.now(),
      status: 'success',
      message: 'Payment token generated successfully'
    };
    
    return NextResponse.json(mockResponse);
  } catch (error) {
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}
