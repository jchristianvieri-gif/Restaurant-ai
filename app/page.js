'use client';
import Link from 'next/link';
import { useState } from 'react';

const sampleProducts = [
  { 
    id: 1, 
    name: 'Margherita Pizza', 
    description: 'Classic tomato and fresh mozzarella with basil', 
    price: 12,
    image: '🍕'
  },
  { 
    id: 2, 
    name: 'Caesar Salad', 
    description: 'Fresh romaine with caesar dressing and croutons', 
    price: 8,
    image: '🥗'
  },
  { 
    id: 3, 
    name: 'Chocolate Cake', 
    description: 'Rich chocolate dessert with vanilla ice cream', 
    price: 6,
    image: '🍰'
  },
  { 
    id: 4, 
    name: 'Burger Special', 
    description: 'Beef patty with special sauce and crispy fries', 
    price: 10,
    image: '🍔'
  },
  { 
    id: 5, 
    name: 'Pasta Carbonara', 
    description: 'Creamy pasta with bacon and parmesan cheese', 
    price: 14,
    image: '🍝'
  },
  { 
    id: 6, 
    name: 'Iced Coffee', 
    description: 'Refreshing cold brew with caramel syrup', 
    price: 4,
    image: '☕'
  }
];

export default function Home() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    alert(`✅ ${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-orange-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RestaurantAI</h1>
                <p className="text-xs text-gray-500">Powered by Next.js & LangChain</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-red-600 font-semibold border-b-2 border-red-600 pb-1">Home</Link>
              <Link href="/admin" className="text-gray-600 hover:text-red-600 transition-colors">Admin</Link>
              <Link href="/cart" className="relative text-gray-600 hover:text-red-600 transition-colors">
                Cart
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-orange-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Next Generation
            <span className="block text-yellow-300">Restaurant Experience</span>
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            AI-powered menu management, seamless payments, and automated product recognition. 
            Built with cutting-edge technology for modern restaurants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admin" className="btn-primary bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-4">
              🚀 Try Admin Panel
            </Link>
            <Link href="#menu" className="btn-secondary border-2 border-white bg-transparent hover:bg-white hover:text-red-600 text-lg px-8 py-4">
              📖 View Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose RestaurantAI?</h2>
            <p className="text-xl text-gray-600">Everything you need for modern restaurant management</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🤖', title: 'AI Product Recognition', desc: 'Automatically extract product details from images using Google Gemini AI' },
              { icon: '💳', title: 'Secure Payments', desc: 'Integrated with Midtrans for seamless and secure payment processing' },
              { icon: '⚡', title: 'Lightning Fast', desc: 'Built with Next.js 15 for optimal performance and user experience' },
              { icon: '📱', title: 'Responsive Design', desc: 'Works perfectly on all devices from desktop to mobile' },
              { icon: '🛒', title: 'Smart Cart', desc: 'Advanced cart management with real-time updates' },
              { icon: '🔧', title: 'Easy Admin', desc: 'Simple admin panel for product management' }
            ].map((feature, index) => (
              <div key={index} className="card p-6 text-center group hover:bg-red-50">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Delicious Menu</h2>
            <p className="text-xl text-gray-600">All items processed through our AI system</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleProducts.map(product => (
              <div key={product.id} className="menu-item group">
                <div className="h-48 bg-gradient-to-br from-red-400 to-orange-400 rounded-xl flex items-center justify-center mb-4 group-hover:from-red-500 group-hover:to-orange-500 transition-all">
                  <span className="text-7xl">{product.image}</span>
                </div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                  <span className="text-2xl font-bold text-red-600">${product.price}</span>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <span>Add to Cart</span>
                  <span>🛒</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Restaurant?</h2>
          <p className="text-xl mb-8">Experience the power of AI in your restaurant management</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admin" className="btn-primary bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-4">
              Start with Admin Panel
            </Link>
            <Link href="/cart" className="btn-secondary border-2 border-white bg-transparent hover:bg-white hover:text-red-600 text-lg px-8 py-4">
              View Your Cart
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <h3 className="text-xl font-bold">RestaurantAI</h3>
            </div>
            <p className="text-gray-400 mb-4">Built for Technical Brief - Junior Full Stack AI Developer Test</p>
            <p className="text-gray-500 text-sm">Powered by Next.js, Supabase, LangChain & Midtrans</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
