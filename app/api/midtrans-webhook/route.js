import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('📨 Midtrans webhook received:', body);
    
    // Extract important fields
    const {
      order_id,
      transaction_status,
      payment_type,
      gross_amount,
      transaction_time,
      signature_key
    } = body;

    // In production, you should verify the signature
    // const serverKey = process.env.MIDTRANS_SERVER_KEY;
    // const expectedSignature = crypto.createHash('sha512')
    //   .update(`${order_id}${status_code}${gross_amount}${serverKey}`)
    //   .digest('hex');
    
    // Process different transaction statuses
    let orderStatus = 'pending';
    switch (transaction_status) {
      case 'capture':
      case 'settlement':
        orderStatus = 'paid';
        break;
      case 'pending':
        orderStatus = 'pending';
        break;
      case 'deny':
      case 'cancel':
      case 'expire':
        orderStatus = 'failed';
        break;
      case 'refund':
        orderStatus = 'refunded';
        break;
      default:
        orderStatus = 'unknown';
    }

    // Log the processed webhook
    console.log('✅ Webhook processed:', {
      order_id,
      status: orderStatus,
      payment_type,
      amount: gross_amount,
      time: transaction_time
    });

    // Here you would typically update your database
    // await updateOrderStatus(order_id, orderStatus);
    
    // Return success response
    return NextResponse.json({ 
      received: true,
      message: 'Webhook processed successfully',
      order_id: order_id,
      status: orderStatus,
      processed_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed',
      details: error.message,
      received_at: new Date().toISOString()
    }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Midtrans webhook endpoint is active',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
}