'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const initialCartItems = [
  { id: 1, name: 'Margherita Pizza', price: 12, quantity: 2, image: '🍕' },
  { id: 2, name: 'Caesar Salad', price: 8, quantity: 1, image: '🥗' }
];

export default function CartPage() {
  const [cart, setCart] = useState(initialCartItems);
  const [isProcessing, setIsProcessing] = useState(false);

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate Midtrans payment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real implementation, this would call your API route
      const paymentData = {
        orderId: `order-${Date.now()}`,
        amount: getTotal(),
        items: cart
      };
      
      // Simulate successful payment
      alert(`✅ Payment Successful! Order #${paymentData.orderId}\nTotal: $${paymentData.amount}`);
      
      // Clear cart after successful payment
      setCart([]);
      
    } catch (error) {
      alert('❌ Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
        <nav className="bg-white/80 backdrop-blur-md border-b border-green-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-xl font-bold text-gray-900">RestaurantAI</span>
              </Link>
              <div className="flex items-center space-x-6">
                <Link href="/" className="text-gray-600 hover:text-red-600 transition-colors">Home</Link>
                <Link href="/admin" className="text-gray-600 hover:text-red-600 transition-colors">Admin</Link>
                <Link href="/cart" className="text-red-600 font-semibold border-b-2 border-red-600 pb-1">Cart</Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-xl text-gray-600 mb-8">Add some delicious items from our menu to get started!</p>
          <Link 
            href="/"
            className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
          >
            <span>🍽️</span>
            <span>Browse Menu</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-green-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-900">RestaurantAI</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-red-600 transition-colors">Home</Link>
              <Link href="/admin" className="text-gray-600 hover:text-red-600 transition-colors">Admin</Link>
              <Link href="/cart" className="text-red-600 font-semibold border-b-2 border-red-600 pb-1">Cart ({cart.reduce((total, item) => total + item.quantity, 0)})</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Shopping Cart</h1>
          <p className="text-xl text-gray-600">Review your items and proceed to checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map(item => (
              <div key={item.id} className="card p-6">
                <div className="flex items-center space-x-6">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-orange-400 rounded-xl flex items-center justify-center text-3xl">
                    {item.image}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-2xl font-bold text-red-600 mb-2">${item.price}</p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3 bg-gray-100 rounded-lg px-3 py-1">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm"
                        >
                          -
                        </button>
                        <span className="font-semibold text-lg min-w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors shadow-sm"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-lg font-semibold text-gray-700">
                        ${item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                    title="Remove item"
                  >
                    <span className="text-xl">🗑️</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="card p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-semibold">${item.price * item.quantity}</span>
                  </div>
                ))}
                
                <div className="border-t border-white/30 pt-3 space-y-2">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal</span>
                    <span>${getTotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm opacity-90">
                    <span>Tax (10%)</span>
                    <span>${(getTotal() * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm opacity-90">
                    <span>Service Fee</span>
                    <span>$2.00</span>
                  </div>
                  <div className="border-t border-white/30 pt-2">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>${(getTotal() * 1.1 + 2).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-white text-blue-600 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>💳</span>
                    <span>Checkout with Midtrans</span>
                  </>
                )}
              </button>
              
              <p className="text-xs text-white/80 text-center mt-3">
                🔒 Secure payment powered by Midtrans Sandbox
              </p>
            </div>

            {/* Features */}
            <div className="card p-6 bg-yellow-50 border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-3">Why Choose Us?</h4>
              <div className="space-y-2 text-sm text-yellow-700">
                <div className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>Secure Midtrans Payments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>Instant Order Confirmation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>✅</span>
                  <span>AI-Powered Recommendations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
