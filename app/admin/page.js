'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { extractProductInfoFromImage } from '../../lib/aiProcessor';
import { useDemoMode } from '../../lib/config';

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    popularCategory: 'Main Course'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ Error fetching products:', error);
        return;
      }
      
      if (data) {
        setProducts(data);
        const revenue = data.reduce((sum, product) => sum + (product.price || 0), 0);
        setStats({
          totalProducts: data.length,
          totalRevenue: revenue,
          popularCategory: data.length > 0 ? 'Main Course' : 'No products'
        });
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showNotification('❌ Please select a valid image file', 'error');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      showNotification('❌ File size must be less than 10MB', 'error');
      return;
    }

    setLoading(true);

    try {
      let imageUrl;

      if (!useDemoMode) {
        // Step 1: Upload image to Supabase Storage
        console.log('📤 Uploading image to Supabase Storage...');
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        console.log('✅ Image uploaded successfully');

        // Step 2: Get public URL
        const { data: { publicUrl } } = await supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
        console.log('🔗 Public URL:', publicUrl);
      } else {
        // Demo mode: use a placeholder URL
        imageUrl = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&demo=${Date.now()}`;
        console.log('🎭 Demo mode: using placeholder URL');
      }

      // Step 3: Process with AI
      console.log('🤖 Sending to AI for analysis...');
      const productInfo = await extractProductInfoFromImage(imageUrl);
      
      console.log('✅ AI Analysis complete:', productInfo);

      // Step 4: Save to database
      console.log('💾 Saving to database...');
      const newProduct = {
        name: productInfo.name,
        description: productInfo.description,
        price: productInfo.price,
        image_url: imageUrl,
        category: ['main', 'drink', 'dessert'][Math.floor(Math.random() * 3)],
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        preparation: `${5 + Math.floor(Math.random() * 20)}-${10 + Math.floor(Math.random() * 25)} min`,
      };

      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('✅ Product saved to database:', data[0]);

      // Update UI
      setProducts([data[0], ...products]);
      setStats(prev => ({
        ...prev,
        totalProducts: prev.totalProducts + 1,
        totalRevenue: prev.totalRevenue + productInfo.price
      }));
      
      // Success notification
      showNotification(`🎉 <strong>${productInfo.name}</strong> berhasil ditambahkan!`, 'success');
      
      event.target.value = '';
    } catch (error) {
      console.error('❌ Error:', error);
      showNotification(`❌ Gagal: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce-in max-w-sm`;
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  };

  const deleteProduct = async (productId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));
      setStats(prev => ({
        ...prev,
        totalProducts: prev.totalProducts - 1
      }));
      showNotification('🗑️ Produk berhasil dihapus', 'success');
    } catch (error) {
      showNotification(`❌ Gagal menghapus: ${error.message}`, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
                <span className="text-2xl text-white">🤖</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">GourmetAI Dashboard</h1>
                <p className="text-gray-600">AI-Powered Restaurant Management</p>
                <div className="flex items-center space-x-2 mt-1">
                  {useDemoMode ? (
                    <>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-yellow-600">Demo Mode - Local Testing</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600">Production Mode - Live Data</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <a 
              href="/" 
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              ← Kembali ke Restaurant
            </a>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Produk</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalProducts}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Nilai Menu</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">Rp {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Kategori Populer</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.popularCategory}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${
                activeTab === 'upload' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              🚀 Upload Produk AI
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${
                activeTab === 'products' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              📦 Kelola Produk ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-all duration-300 ${
                activeTab === 'analytics' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              📈 Analytics
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'upload' && (
              <div className="text-center">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">AI-Powered Product Recognition</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Upload foto makanan dan AI kami akan otomatis mengekstrak nama, deskripsi, 
                    dan menyarankan harga yang sesuai berdasarkan analisis pasar.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-dashed border-blue-300 rounded-3xl p-12 mb-8 max-w-2xl mx-auto">
                  <div className="text-6xl mb-6">🤖</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Foto Makanan</h3>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={loading}
                    className="hidden"
                    id="product-upload"
                  />
                  <label
                    htmlFor="product-upload"
                    className={`cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-block ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-3">
                        <div className="loading-spinner"></div>
                        <span>AI Memproses Gambar...</span>
                      </div>
                    ) : (
                      '📸 Upload Foto Makanan'
                    )}
                  </label>
                  
                  <p className="text-gray-500 mt-4 text-sm">
                    Mendukung JPG, PNG, WEBP • Maks 10MB • Pemrosesan AI Real-time
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center card-hover">
                    <div className="text-3xl mb-3">🔍</div>
                    <h4 className="font-semibold text-gray-800 mb-2">Analisis AI Real</h4>
                    <p className="text-gray-600 text-sm">GPT-4 Vision menganalisis konten makanan</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center card-hover">
                    <div className="text-3xl mb-3">📝</div>
                    <h4 className="font-semibold text-gray-800 mb-2">Deskripsi Cerdas</h4>
                    <p className="text-gray-600 text-sm">Deskripsi menu yang menarik dan kontekstual</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center card-hover">
                    <div className="text-3xl mb-3">💰</div>
                    <h4 className="font-semibold text-gray-800 mb-2">Harga Pasar</h4>
                    <p className="text-gray-600 text-sm">Saran harga kompetitif berdasarkan analisis</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Katalog Produk</h2>
                  <span className="text-gray-600">{products.length} produk</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden card-hover">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
                        }}
                      />
                      <div className="p-6">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-green-600 font-bold text-lg">Rp {product.price?.toLocaleString()}</span>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>⭐ {product.rating}</span>
                            <span>•</span>
                            <span>⏱️ {product.preparation}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors text-sm">
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => deleteProduct(product.id)}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {products.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum ada produk</h3>
                    <p className="text-gray-500">Gunakan fitur upload AI untuk menambahkan produk pertama Anda!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-6">📈</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Analytics Lanjutan</h2>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  Lacak performa penjualan, preferensi pelanggan, dan insight optimasi menu 
                  yang didukung oleh analytics AI.
                </p>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold inline-block">
                  Segera Hadir
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}