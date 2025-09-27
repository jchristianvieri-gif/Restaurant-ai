'use client';
import { useState } from 'react';
import { Upload, Image, DollarSign, Tag, Loader } from 'lucide-react';

export default function AdminPage() {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Simulate AI processing
    setUploading(true);
    setTimeout(() => {
      setProductInfo({
        name: 'Nasi Goreng Spesial',
        description: 'Nasi goreng dengan telur dan ayam',
        price: '25000',
        category: 'main-course'
      });
      setUploading(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to database
    alert('Product saved! (Database integration pending)');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-blue-100">Manage your restaurant menu with AI assistance</p>
          </div>

          {/* Upload Section */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Upload className="mr-2" size={20} />
              Upload Product Image
            </h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="product-image"
              />
              
              <label htmlFor="product-image" className="cursor-pointer">
                {previewImage ? (
                  <div className="relative">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="max-w-full h-48 object-cover rounded mx-auto"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Loader className="animate-spin text-white" size={32} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <Image size={48} className="mx-auto mb-2" />
                    <p>Click to upload product image</p>
                    <p className="text-sm">AI will automatically extract product information</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Product Form */}
          {previewImage && !uploading && (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Tag className="mr-2" size={18} />
                Product Information (AI Extracted)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={productInfo.name}
                    onChange={(e) => setProductInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (IDR)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      value={productInfo.price}
                      onChange={(e) => setProductInfo(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={productInfo.description}
                    onChange={(e) => setProductInfo(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={productInfo.category}
                    onChange={(e) => setProductInfo(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="main-course">Main Course</option>
                    <option value="appetizer">Appetizer</option>
                    <option value="beverage">Beverage</option>
                    <option value="dessert">Dessert</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewImage(null);
                    setProductInfo({ name: '', description: '', price: '', category: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save Product
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Features Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">🛒 Shopping Cart</h3>
            <p className="text-sm text-gray-600">Full cart functionality with quantity management</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">🤖 AI Integration Ready</h3>
            <p className="text-sm text-gray-600">Upload image to auto-extract product info</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">💳 Payment Ready</h3>
            <p className="text-sm text-gray-600">Integrated with payment gateway (Midtrans/Xendit)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
