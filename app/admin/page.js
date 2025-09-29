'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { extractProductInfoFromImage } from '@/lib/aiProcessor';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setProducts(data);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    const toastId = toast.loading('AI sedang memproses gambar...');

    try {
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // Extract product info using AI directly
      const productInfo = await extractProductInfoFromImage(publicUrl);

      // Save to database
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: productInfo.name,
            description: productInfo.description,
            price: productInfo.price,
            image_url: publicUrl,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;

      setProducts([...products, data[0]]);
      toast.success('Produk berhasil ditambahkan dengan AI!', { id: toastId });
      
      event.target.value = '';
    } catch (error) {
      console.error('Error:', error);
      toast.error('Gagal menambahkan produk', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel - Restaurant AI</h1>
        
        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Tambah Produk dengan AI</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
              className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'AI Sedang Memproses...' : 'Upload Gambar Menu'}
            </label>
            <p className="text-gray-500 mt-2">AI akan otomatis mengekstrak nama, deskripsi, dan harga</p>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Daftar Produk ({products.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-md mb-3"
                />
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <p className="text-green-600 font-bold">Rp {product.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
