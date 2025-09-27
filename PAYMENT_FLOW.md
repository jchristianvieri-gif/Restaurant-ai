# Payment Integration Details

## Midtrans Sandbox Flow:
1. Client token generation from Midtrans API
2. Snap.js modal for payment UI
3. Payment processing via Midtrans
4. Webhook callback to update order status
5. Order confirmation display

## Webhook Handling:
- Endpoint: /api/midtrans-webhook
- Validates payment status
- Updates order in Supabase
- Secure signature verification

## Test Cards:
- Success: 4811 1111 1111 1114
- Failure: 4111 1111 1111 1111
