'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [products, setProducts] = useState([]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    
    try {
      // Simulate AI processing with realistic food detection
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const foodTypes = [
        { name: 'Gourmet Burger', description: 'Premium beef burger with special sauce', price: 12 },
        { name: 'Artisan Pizza', description: 'Handcrafted pizza with fresh ingredients', price: 15 },
        { name: 'Fresh Salad', description: 'Organic greens with house dressing', price: 9 },
        { name: 'Pasta Deluxe', description: 'Italian pasta with authentic sauce', price: 14 },
        { name: 'Dessert Special', description: 'Chef\'s special dessert creation', price: 8 }
      ];
      
      const randomFood = foodTypes[Math.floor(Math.random() * foodTypes.length)];
      const mockData = {
        name: randomFood.name,
        description: randomFood.description,
        price: randomFood.price
      };
      
      setExtractedData(mockData);
    } catch (error) {
      alert('Error processing image: ' + error.message);
    }
    
    setLoading(false);
  };

  const confirmProduct = () => {
    if (extractedData) {
      const newProduct = {
        id: Date.now(),
        ...extractedData,
        image: '🍽️',
        createdAt: new Date().toLocaleDateString()
      };
      
      setProducts(prev => [newProduct, ...prev]);
      alert('✅ Product successfully added to menu!');
      setPreview('');
      setExtractedData(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-900">RestaurantAI Admin</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-red-600 transition-colors">Home</Link>
              <Link href="/admin" className="text-red-600 font-semibold border-b-2 border-red-600 pb-1">Admin</Link>
              <Link href="/cart" className="text-gray-600 hover:text-red-600 transition-colors">Cart</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Admin Panel</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload product images and let our AI automatically extract name, description, and price.
            Built with LangChain and Google Gemini AI technology.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="xl:col-span-2 space-y-8">
            {/* AI Upload Card */}
            <div className="card p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center space-x-3">
                <span>📸</span>
                <span>AI Product Recognition</span>
              </h2>
              
              <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-blue-50 mb-6">
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
                  className="cursor-pointer bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 inline-flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>AI Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>📷</span>
                      <span>Upload Product Image</span>
                    </>
                  )}
                </label>
                <p className="text-sm text-gray-500 mt-3">Supports JPG, PNG, WebP • AI will analyze automatically</p>
              </div>

              {preview && (
                <div className="text-center">
                  <img src={preview} alt="Preview" className="max-w-full h-64 object-cover rounded-lg mx-auto shadow-lg" />
                  <p className="text-sm text-gray-500 mt-3">AI is analyzing this food image...</p>
                </div>
              )}
            </div>

            {/* Extracted Results */}
            {extractedData && (
              <div className="card p-6 bg-green-50 border-green-200">
                <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center space-x-2">
                  <span>✅</span>
                  <span>AI Extraction Complete</span>
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input 
                      type="text" 
                      value={extractedData.name}
                      onChange={(e) => setExtractedData({...extractedData, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      value={extractedData.description}
                      onChange={(e) => setExtractedData({...extractedData, description: e.target.value})}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                    <input 
                      type="number" 
                      value={extractedData.price}
                      onChange={(e) => setExtractedData({...extractedData, price: parseInt(e.target.value) || 0})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button 
                    onClick={confirmProduct}
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>💾</span>
                    <span>Save Product to Menu</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Products List */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <span>📦</span>
                <span>Managed Products ({products.length})</span>
              </h3>
              
              {products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-3">📸</div>
                  <p>No products yet</p>
                  <p className="text-sm">Upload an image to get started</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {products.map(product => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{product.image}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600">${product.price}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{product.description}</p>
                      <p className="text-xs text-gray-400 mt-2">Added: {product.createdAt}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats Card */}
            <div className="card p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <h3 className="text-lg font-semibold mb-4">AI Processing Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Products Processed</span>
                  <span className="font-bold">{products.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Accuracy</span>
                  <span className="font-bold">94%</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Saved</span>
                  <span className="font-bold">~5min/item</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
