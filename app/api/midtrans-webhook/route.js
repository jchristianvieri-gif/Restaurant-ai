import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Midtrans webhook received:', body);
    
    // Simple response tanpa Supabase
    return NextResponse.json({ 
      received: true,
      message: 'Webhook processed successfully',
      order_id: body.order_id,
      status: body.transaction_status
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error.message 
    }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Midtrans webhook endpoint is active'
  });
}
