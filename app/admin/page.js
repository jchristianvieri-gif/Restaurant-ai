'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('upload');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    
    // Simulate AI processing with realistic delay
    setTimeout(() => {
      const foodTypes = [
        { 
          name: 'Gourmet Burger', 
          description: 'Premium beef burger with special sauce and fresh vegetables', 
          price: 18,
          category: 'Main Course',
          cookingTime: '12-15 min'
        },
        { 
          name: 'Artisan Pizza', 
          description: 'Handcrafted pizza with fresh ingredients and mozzarella', 
          price: 22,
          category: 'Main Course',
          cookingTime: '15-20 min'
        },
        { 
          name: 'Fresh Garden Salad', 
          description: 'Organic greens with house dressing and croutons', 
          price: 14,
          category: 'Salads',
          cookingTime: '5-8 min'
        }
      ];
      
      const mockData = foodTypes[Math.floor(Math.random() * foodTypes.length)];
      setExtractedData(mockData);
      setLoading(false);
      setActiveTab('results');
    }, 3000);
  };

  const confirmProduct = () => {
    if (extractedData) {
      const newProduct = {
        id: Date.now(),
        ...extractedData,
        image: '🍽️',
        rating: 4.5 + Math.random() * 0.5,
        createdAt: new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      };
      
      setProducts(prev => [newProduct, ...prev]);
      showToast('✅ Product successfully added to menu!', 'success');
      setPreview('');
      setExtractedData(null);
      setActiveTab('products');
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="food-image">
                <span className="text-white">🤖</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GourmetAI Admin</h1>
                <p className="text-xs text-blue-600 font-medium">AI-Powered Management</p>
              </div>
            </Link>
            <div className="flex space-x-6">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Home</Link>
              <Link href="/admin" className="text-blue-600 font-bold border-b-2 border-blue-600 pb-1">Admin</Link>
              <Link href="/cart" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Cart</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-4">AI Restaurant Manager</h1>
          <p className="text-xl text-gray-600">Smart product management with artificial intelligence</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 bg-white rounded-2xl p-2 shadow-lg">
          {[
            { id: 'upload', label: '📸 AI Upload', icon: '📸' },
            { id: 'results', label: '🔍 Results', icon: '🔍', disabled: !extractedData },
            { id: 'products', label: `📦 Products (${products.length})`, icon: '📦' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                activeTab === tab.id 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-gray-100'
              } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="restaurant-card p-8">
          {activeTab === 'upload' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6">AI Product Recognition</h2>
              <p className="text-gray-600 mb-8">Upload a food image and our AI will automatically extract product details</p>
              
              <div className="border-3 border-dashed border-blue-300 rounded-2xl p-12 bg-blue-50 mb-8">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload}
                  disabled={loading}
                  className="hidden"
                  id="upload"
                />
                <label 
                  htmlFor="upload" 
                  className="cursor-pointer restaurant-button inline-flex items-center space-x-3 text-lg px-8 py-4"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>AI Processing Image...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">📷</span>
                      <span>Upload Food Image</span>
                    </>
                  )}
                </label>
                <p className="text-sm text-gray-500 mt-4">Supports JPG, PNG, WebP • AI will analyze automatically</p>
              </div>

              {preview && (
                <div className="text-center">
                  <img src={preview} alt="Preview" className="max-w-md h-64 object-cover rounded-2xl mx-auto shadow-lg" />
                  <p className="text-sm text-gray-500 mt-3">AI is analyzing this food image...</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'results' && extractedData && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-green-700 flex items-center space-x-2">
                <span>✅</span>
                <span>AI Analysis Complete</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">Product Name</label>
                    <input 
                      type="text" 
                      value={extractedData.name}
                      onChange={(e) => setExtractedData({...extractedData, name: e.target.value})}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="Enter product name"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">Description</label>
                    <textarea 
                      value={extractedData.description}
                      onChange={(e) => setExtractedData({...extractedData, description: e.target.value})}
                      rows="4"
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="Enter product description"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">Price ($)</label>
                    <input 
                      type="number" 
                      value={extractedData.price}
                      onChange={(e) => setExtractedData({...extractedData, price: e.target.value})}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="Enter price"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">Category</label>
                    <select 
                      value={extractedData.category}
                      onChange={(e) => setExtractedData({...extractedData, category: e.target.value})}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                      <option value="Main Course">Main Course</option>
                      <option value="Appetizers">Appetizers</option>
                      <option value="Salads">Salads</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Beverages">Beverages</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block font-semibold text-gray-700 mb-2">Cooking Time</label>
                    <input 
                      type="text" 
                      value={extractedData.cookingTime}
                      onChange={(e) => setExtractedData({...extractedData, cookingTime: e.target.value})}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      placeholder="e.g., 15-20 min"
                    />
                  </div>
                </div>
              </div>
              
              <button 
                onClick={confirmProduct}
                className="w-full restaurant-button bg-green-500 hover:bg-green-600 text-lg py-4 flex items-center justify-center space-x-2"
              >
                <span>💾</span>
                <span>Save to Menu</span>
              </button>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Managed Products</h2>
              {products.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-6xl mb-4">📸</div>
                  <p className="text-lg mb-2">No products yet</p>
                  <p>Upload an image to get started with AI product recognition</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map(product => (
                    <div key={product.id} className="restaurant-card p-6 hover-lift">
                      <div className="flex items-start space-x-4">
                        <div className="food-image">
                          {product.image}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
                            <span className="text-xl font-black text-orange-600">${product.price}</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium">
                              {product.category}
                            </span>
                            <span className="text-gray-500 text-sm">{product.cookingTime}</span>
                          </div>
                          <p className="text-gray-400 text-xs mt-3">Added: {product.createdAt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
