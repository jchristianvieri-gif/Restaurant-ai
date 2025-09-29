import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { amount, items, customerInfo } = await request.json();
    
    // Validate input
    if (!amount || !items || items.length === 0) {
      return NextResponse.json({ 
        error: 'Invalid payment data' 
      }, { status: 400 });
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate order ID
    const orderId = 'ORDER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    // Mock successful payment response
    const mockResponse = {
      success: true,
      order_id: orderId,
      token: 'mock-token-' + Date.now(),
      redirect_url: `https://sandbox.midtrans.com/snap/v2/vtweb/${orderId}`,
      status: 'pending',
      message: 'Payment token generated successfully',
      amount: amount,
      items: items.length,
      timestamp: new Date().toISOString()
    };
    
    console.log('💳 Payment processed:', mockResponse);
    
    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('❌ Payment error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Payment processing failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}