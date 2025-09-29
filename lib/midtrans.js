export async function createPayment(orderDetails) {
  try {
    const response = await fetch('/api/midtrans-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderDetails),
    });
    return await response.json();
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
}

export function getPaymentStatus(orderId) {
  return fetch(`/api/payment-status/${orderId}`);
}
