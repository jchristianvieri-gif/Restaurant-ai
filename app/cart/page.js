'use client';
import { useState } from 'react';
import Link from 'next/link';

const sampleCart = [
  { id: 1, name: 'Margherita Pizza', price: 12, quantity: 2, image: '🍕' },
  { id: 2, name: 'Caesar Salad', price: 8, quantity: 1, image: '🥗' }
];

export default function CartPage() {
  const [cart, setCart] = useState(sampleCart);
  const [processing, setProcessing] = useState(false);

  const getTotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);

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
    setProcessing(true);
    setTimeout(() => {
      alert('✅ Payment successful!');
      setCart([]);
      setProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🍽️</span>
            <span className="text-xl font-bold">Restaurant AI</span>
          </Link>
          <div className="space-x-6">
            <Link href="/" className="text-gray-600 hover:text-red-600">Home</Link>
            <Link href="/admin" className="text-gray-600 hover:text-red-600">Admin</Link>
            <Link href="/cart" className="text-red-600 font-semibold border-b-2 border-red-600">Cart</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8">Your Cart</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <Link href="/" className="bg-red-500 text-white px-8 py-3 rounded-lg font-semibold">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{item.image}</div>
                    <div>
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <p className="text-2xl font-bold text-red-600">${item.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                      >-</button>
                      <span className="font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300"
                      >+</button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">${item.price * item.quantity}</p>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >🗑️</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
              <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${item.price * item.quantity}</span>
                  </div>
                ))}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-xl text-red-600">${getTotal()}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={processing}
                className="w-full bg-green-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-600 disabled:bg-gray-300"
              >
                {processing ? 'Processing...' : '�� Checkout'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
