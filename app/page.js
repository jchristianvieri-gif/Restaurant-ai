'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useDemoMode } from '../lib/config';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  // Sample categories dengan gambar makanan yang indah
  const categories = [
    { id: 'all', name: 'Semua Menu', emoji: '🍽️' },
    { id: 'main', name: 'Makanan Utama', emoji: '🍖' },
    { id: 'drink', name: 'Minuman', emoji: '🥤' },
    { id: 'dessert', name: 'Dessert', emoji: '🍰' }
  ];

  // Enhanced sample products dengan gambar makanan realistis
  const sampleProducts = [
    {
      id: 1,
      name: "Wagyu Beef Burger",
      description: "Premium wagyu beef dengan truffle aioli dan aged cheddar",
      price: 125000,
      image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop",
      category: 'main',
      rating: 4.9,
      preparation: '20-25 min'
    },
    {
      id: 2, 
      name: "Truffle Pasta",
      description: "Fresh pasta dengan black truffle dan parmesan cream sauce",
      price: 98000,
      image_url: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop",
      category: 'main',
      rating: 4.8,
      preparation: '15-20 min'
    },
    {
      id: 3,
      name: "Rainbow Smoothie Bowl",
      description: "Acai base dengan fresh fruits dan granola", 
      price: 45000,
      image_url: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=500&h=300&fit=crop",
      category: 'dessert',
      rating: 4.7,
      preparation: '5-10 min'
    },
    {
      id: 4,
      name: "Artisan Coffee",
      description: "Single-origin coffee dengan latte art",
      price: 35000,
      image_url: "https://images.unsplash.com/photo-1542181961-9590d0c79dab?w=500&h=300&fit=crop",
      category: 'drink',
      rating: 4.6,
      preparation: '3-5 min'
    }
  ];

  useEffect(() => {
    fetchProducts();
    // Load cart from localStorage
    const savedCart = localStorage.getItem('restaurant-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('restaurant-cart', JSON.stringify(cart));
  }, [cart]);

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
      console.error('Error fetching products:', error);
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
    showNotification(`✅ ${product.name} ditambahkan ke keranjang!`, 'success');
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
    } text-white px-6 py-4 rounded-xl shadow-2xl z-50 animate-fade-in font-semibold max-w-sm`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showNotification('❌ Keranjang kosong!', 'error');
      return;
    }

    // Simulate order processing
    showNotification('🚀 Pesanan berhasil! Makanan Anda sedang dipersiapkan.', 'success');
    setCart([]);
    setShowCart(false);
    
    // You can integrate with payment gateway here
    console.log('Order placed:', {
      items: cart,
      total: getTotalPrice() + 10000,
      timestamp: new Date().toISOString()
    });
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
                <div className="flex items-center space-x-2 mt-1">
                  {useDemoMode ? (
                    <>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-yellow-200">Demo Mode</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-200">Live Mode</span>
                    </>
                  )}
                </div>
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
                🛒 Keranjang 
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-bounce-in">
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
          <h1 className="text-white font-bold mb-6 text-balance animate-fade-in">
            Rasakan Masa Depan 
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent mt-2">
              Pengalaman Kuliner
            </span>
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto text-balance">
            Keunggulan kuliner bertenaga AI bertemu dengan cita rasa tradisional. 
            Temukan menu yang dibuat dengan presisi dan passion.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button 
              onClick={() => document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
            >
              🍴 Jelajahi Menu
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 backdrop-blur-sm border border-white/20 hover:scale-105">
              📞 Reservasi Meja
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 px-4">
        <div className="container-max">
          <h2 className="text-white text-center mb-8 font-bold">Kategori Menu</h2>
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
      <section id="menu-section" className="py-12 px-4">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-white font-bold mb-4">Spesialisasi Kami</h2>
            <p className="text-blue-100 text-lg">Hidangan yang dibuat dengan teliti menggunakan bahan-bahan terbaik</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="loading-spinner"></div>
              <span className="ml-3 text-white">Memuat menu lezat...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="card-hover bg-white rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
                  <div className="relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop';
                      }}
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
                      <span className="text-2xl font-bold text-green-600 whitespace-nowrap ml-4">
                        Rp {product.price?.toLocaleString()}
                      </span>
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
                        Tambah ke Keranjang
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Tidak ada produk dalam kategori ini</h3>
              <p className="text-blue-100">Coba kategori lain atau kembali ke semua menu</p>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCart(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto animate-slide-in-right">
            <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Pesanan Anda</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-white hover:text-gray-200 text-2xl transition-transform hover:scale-110"
                >
                  ✕
                </button>
              </div>
              <p className="text-blue-100 mt-2">Review pilihan lezat Anda</p>
            </div>
            
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Keranjang Anda kosong</h3>
                  <p className="text-gray-500 mb-6">Tambahkan beberapa item lezat untuk memulai!</p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="btn-primary"
                  >
                    Jelajahi Menu
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
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=64&h=64&fit=crop';
                            }}
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
                        <span className="text-gray-600">Biaya Layanan</span>
                        <span className="font-semibold">Rp 10,000</span>
                      </div>
                      <div className="flex justify-between text-2xl font-bold border-t pt-3">
                        <span>Total</span>
                        <span className="text-green-600">Rp {(getTotalPrice() + 10000).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleCheckout}
                      className="btn-secondary w-full py-4 text-lg"
                    >
                      🎯 Pesan Sekarang
                    </button>
                    
                    <p className="text-center text-gray-500 text-sm mt-4">
                      Pembayaran aman • Gratis ongkir di atas Rp 100,000
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