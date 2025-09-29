import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Verify payment status from Midtrans
    if (body.transaction_status === 'settlement' || body.transaction_status === 'capture') {
      // Update order status in database
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'completed',
          payment_status: 'paid',
          updated_at: new Date().toISOString()
        })
        .eq('order_id', body.order_id);

      if (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      console.log('Order completed:', body.order_id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 400 });
  }
}
