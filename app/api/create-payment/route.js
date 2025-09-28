import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
});

export async function POST(request) {
  try {
    const { amount, items } = await request.json();
    
    const parameter = {
      transaction_details: {
        order_id: `order-${Date.now()}`,
        gross_amount: amount
      },
      item_details: items.map(item => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        name: item.name
      }))
    };

    const token = await snap.createTransactionToken(parameter);
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
