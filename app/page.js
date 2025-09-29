'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Format Rupiah
const formatRupiah = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price * 14000); // Convert USD to IDR
};

const restaurantMenu = [
  { 
    id: 1, 
    name: 'Truffle Margherita Pizza', 
    description: 'Pizza wood-fired dengan mozzarella segar, basil, dan minyak truffle hitam', 
    price: 24,
    image: '🍕',
    category: 'Italian',
    cookingTime: '15-20 menit',
    rating: 4.8,
    featured: true
  },
  { 
    id: 2, 
    name: 'Wagyu Burger Deluxe', 
    description: 'Daging wagyu premium dengan aioli truffle, keju cheddar tua, dan roti brioche', 
    price: 32,
    image: '🍔',
    category: 'American', 
    cookingTime: '10-15 menit',
    rating: 4.9,
    featured: true
  },
  { 
    id: 3, 
    name: 'Ocean Platter', 
    description: 'Pilihan seafood segar dengan lobster, scallops, dan saus lemon butter', 
    price: 45,
    image: '🦞',
    category: 'Seafood',
    cookingTime: '20-25 menit',
    rating: 4.7,
    featured: true
  },
  { 
    id: 4, 
    name: 'Golden Risotto', 
    description: 'Risotto saffron creamy dengan parmesan dan sayuran musiman', 
    price: 28,
    image: '🍚',
    category: 'Vegetarian',
    cookingTime: '18-22 menit',
    rating: 4.6,
    featured: false
  },
  { 
    id: 5, 
    name: 'Chocolate Lava Cake', 
    description: 'Kue coklat hangat dengan isian lumer dan es krim vanilla', 
    price: 12,
    image: '🍰',
    category: 'Dessert',
    cookingTime: '8-12 menit',
    rating: 4.9,
    featured: false
  },
  { 
    id: 6, 
    name: 'Craft Cocktails', 
    description: 'Koktail signature yang dibuat oleh mixologist ahli kami', 
    price: 14,
    image: '🍹',
    category: 'Beverages',
    cookingTime: '5-8 menit',
    rating: 4.8,
    featured: false
  }
];

export default function Home() {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    
    showToast(`✅ ${product.name} ditambahkan ke keranjang!`, 'success');
  };

  const showToast = (message, type = 'info') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 ${type === 'success' ? 'bg-green-500' : 'bg-blue-500'} text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-fade-in-up flex items-center space-x-2`;
    toast.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()" class="text-white hover:text-gray-200">✕</button>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 4000);
  };

  const categories = ['Semua', 'Italian', 'American', 'Seafood', 'Vegetarian', 'Dessert', 'Beverages'];
  const filteredMenu = activeCategory === 'Semua' 
    ? restaurantMenu 
    : restaurantMenu.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      {/* Navigation */}
      <nav className="glass-nav sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">BistroAI</h1>
                <p className="text-xs text-orange-600 font-medium">Restaurant & Kitchen</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-orange-600 font-semibold border-b-2 border-orange-600 pb-1 transition-all">
                Beranda
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-orange-600 transition-colors duration-300 font-medium">
                Panel Admin
              </Link>
              <Link href="/cart" className="relative text-gray-600 hover:text-orange-600 transition-colors duration-300 font-medium">
                <span className="flex items-center space-x-1">
                  <span>🛒</span>
                  <span>Keranjang</span>
                </span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block animate-bounce mb-6">
              <span className="text-6xl">👨‍🍳</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              Selamat Datang di
              <span className="block text-yellow-300 mt-2">BistroAI</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Tempat kecerdasan buatan bertemu dengan keunggulan kuliner. Rasakan masa depan fine dining.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admin" className="bg-white text-orange-600 font-bold py-4 px-8 rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2">
                <span>🤖</span>
                <span>Coba Panel Admin AI</span>
              </Link>
              <Link href="#menu" className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-orange-600 transition-all duration-300">
                Lihat Menu Kami
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating food elements */}
        <div className="absolute top-10 left-10 text-4xl animate-float">🍕</div>
        <div className="absolute top-20 right-20 text-3xl animate-float delay-1000">🍔</div>
        <div className="absolute bottom-10 left-1/4 text-4xl animate-float delay-500">🍰</div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white/80 backdrop-blur-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeCategory === category 
                    ? 'bg-orange-500 text-white shadow-lg transform scale-105' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>
      {/* Menu Section */}
      <section id="menu" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Menu <span className="text-orange-600">Signature</span> Kami
            </h2>
            <p className="text-gray-600 text-lg">Karya terbaik yang dikurasi oleh chef AI kami</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMenu.map((product, index) => (
              <div 
                key={product.id}
                className="restaurant-card group overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center relative overflow-hidden">
                    <span className="text-6xl text-white z-10">{product.image}</span>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300"></div>
                  </div>
                  
                  {product.featured && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        ⭐ Featured
                      </span>
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                      {product.rating} ⭐
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <span className="text-2xl font-black text-orange-600">
                      {formatRupiah(product.price)}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                    {product.description}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                    <span className="text-gray-500 text-sm">{product.cookingTime}</span>
                  </div>
                  
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 group/btn"
                  >
                    <span>+ Tambah ke Keranjang</span>
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white border-t border-orange-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: '🤖', 
                title: 'AI Powered', 
                desc: 'Manajemen menu cerdas dengan pengenalan produk otomatis menggunakan teknologi terkini' 
              },
              { 
                icon: '⚡', 
                title: 'Layanan Cepat', 
                desc: 'Pemrosesan pesanan cepat dengan update real-time ke dapur untuk pengalaman terbaik' 
              },
              { 
                icon: '🌟', 
                title: 'Kualitas Premium', 
                desc: 'Hanya bahan-bahan terpilih untuk hidangan yang luar biasa dan memuaskan' 
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-8 restaurant-card hover-lift">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-6">
            Siap Merasakan Makanan AI?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Bergabunglah dengan masa depan manajemen restaurant hari ini
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admin" className="bg-white text-orange-600 font-bold py-4 px-8 rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              Mulai dengan Panel Admin
            </Link>
            <Link href="/cart" className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-orange-600 transition-all duration-300">
              Lihat Keranjang Anda
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <h3 className="text-2xl font-bold">BistroAI Restaurant</h3>
          </div>
          <p className="text-gray-400 mb-2">Kecerdasan Buatan untuk Keunggulan Kuliner</p>
          <p className="text-gray-500 text-sm">Dibangun untuk Technical Brief - Junior Full Stack AI Developer Test</p>
        </div>
      </footer>
    </div>
  );
}
