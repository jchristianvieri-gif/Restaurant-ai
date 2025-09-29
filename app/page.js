'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  // Sample categories with beautiful food images
  const categories = [
    { id: 'all', name: 'All Menu', emoji: '🍽️', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500' },
    { id: 'main', name: 'Main Course', emoji: '🍖', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500' },
    { id: 'drink', name: 'Beverages', emoji: '🥤', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500' },
    { id: 'dessert', name: 'Desserts', emoji: '🍰', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500' }
  ];

  // Enhanced sample products with realistic food images
  const sampleProducts = [
    {
      id: 1,
      name: "Wagyu Beef Burger",
      description: "Premium wagyu beef with truffle aioli and aged cheddar",
      price: 125000,
      image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop",
      category: 'main',
      rating: 4.9,
      preparation: '20-25 min'
    },
    {
      id: 2, 
      name: "Truffle Pasta",
      description: "Fresh pasta with black truffle and parmesan cream sauce",
      price: 98000,
      image_url: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop",
      category: 'main',
      rating: 4.8,
      preparation: '15-20 min'
    },
    {
      id: 3,
      name: "Rainbow Smoothie Bowl",
      description: "Acai base topped with fresh fruits and granola", 
      price: 45000,
      image_url: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=500&h=300&fit=crop",
      category: 'dessert',
      rating: 4.7,
      preparation: '5-10 min'
    },
    {
      id: 4,
      name: "Artisan Coffee",
      description: "Single-origin coffee with latte art",
      price: 35000,
      image_url: "https://images.unsplash.com/photo-1542181961-9590d0c79dab?w=500&h=300&fit=crop",
      category: 'drink',
      rating: 4.6,
      preparation: '3-5 min'
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(sampleProducts);
      }
    } catch (error) {
      setProducts(sampleProducts);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const addToCart = (product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
    
    // Show success notification
    showNotification(`✅ ${product.name} added to cart!`, 'success');
  };

  const removeFromCart = (productId) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-6 right-6 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white px-6 py-4 rounded-xl shadow-2xl z-50 fade-in font-semibold`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Enhanced Header */}
      <header className="glass-effect sticky top-0 z-40 border-b border-white/20">
        <div className="container-max py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <span className="text-2xl">🍽️</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-2xl">GourmetAI</h1>
                <p className="text-blue-100 text-sm">Restaurant & Café</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <a 
                href="/admin" 
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105"
              >
                🛠️ Admin
              </a>
              <button
                onClick={() => setShowCart(true)}
                className="relative bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105"
              >
                🛒 Cart 
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold bounce-in">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container-max text-center">
          <h1 className="text-white font-bold mb-6 text-balance fade-in">
            Taste the Future of 
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent mt-2">
              Dining Experience
            </span>
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto text-balance">
            AI-powered culinary excellence meets traditional flavors. Discover menu items crafted with precision and passion.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="btn-primary">
              🍴 Explore Menu
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105">
              📞 Reserve Table
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 px-4">
        <div className="container-max">
          <h2 className="text-white text-center mb-8 font-bold">Menu Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`glass-effect p-6 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 group ${
                  activeCategory === category.id ? 'ring-2 ring-white ring-opacity-50 bg-white/30' : ''
                }`}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.emoji}
                </div>
                <h3 className="font-semibold text-white text-sm">{category.name}</h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 px-4">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-white font-bold mb-4">Our Specialties</h2>
            <p className="text-blue-100 text-lg">Carefully crafted dishes using the finest ingredients</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="loading-spinner"></div>
              <span className="ml-3 text-white">Loading delicious menu...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="card-hover bg-white rounded-2xl overflow-hidden shadow-2xl fade-in">
                  <div className="relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ⭐ {product.rating}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      ⏱️ {product.preparation}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-800 text-balance">{product.name}</h3>
                      <span className="text-2xl font-bold text-green-600 whitespace-nowrap ml-4">Rp {product.price?.toLocaleString()}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed text-balance">{product.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>🔥 320 cal</span>
                        <span>•</span>
                        <span>🌱 Fresh</span>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="btn-primary text-sm py-2 px-6"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCart(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto slide-in-right">
            <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your Order</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-white hover:text-gray-200 text-2xl transition-transform hover:scale-110"
                >
                  ✕
                </button>
              </div>
              <p className="text-blue-100 mt-2">Review your delicious selections</p>
            </div>
            
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add some delicious items to get started!</p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="btn-primary"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 text-balance">{item.name}</h3>
                            <p className="text-green-600 font-bold">Rp {item.price?.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              −
                            </button>
                            <span className="font-bold w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 p-2 transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">Rp {getTotalPrice().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span className="text-gray-600">Service Fee</span>
                        <span className="font-semibold">Rp 10,000</span>
                      </div>
                      <div className="flex justify-between text-2xl font-bold border-t pt-3">
                        <span>Total</span>
                        <span className="text-green-600">Rp {(getTotalPrice() + 10000).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        showNotification('🚀 Order placed successfully! Your food is being prepared.', 'success');
                        setCart([]);
                        setShowCart(false);
                      }}
                      className="btn-secondary w-full py-4 text-lg"
                    >
                      🎯 Place Order
                    </button>
                    
                    <p className="text-center text-gray-500 text-sm mt-4">
                      Secure payment • Free delivery over Rp 100,000
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-sm border-t border-white/20 mt-20 py-8 px-4">
        <div className="container-max text-center">
          <div className="flex justify-center gap-6 mb-4 flex-wrap">
            <span className="text-white text-sm">📱 Mobile App</span>
            <span className="text-white text-sm">🏆 Awards</span>
            <span className="text-white text-sm">👨‍🍳 Careers</span>
            <span className="text-white text-sm">📞 Contact</span>
          </div>
          <p className="text-blue-100 text-sm">
            © 2024 GourmetAI Restaurant. Powered by AI, Crafted with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
