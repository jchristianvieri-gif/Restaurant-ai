import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const orderId = params.orderId;
    
    // Check payment status from Midtrans
    const response = await fetch(`https://api.sandbox.midtrans.com/v2/${orderId}/status`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64')
      }
    });

    const status = await response.json();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ error: 'Status check failed' }, { status: 500 });
  }
}
