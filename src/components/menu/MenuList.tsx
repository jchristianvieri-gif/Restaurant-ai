'use client';
import { useState } from 'react';
import { Product } from '@/types';
import { ShoppingCart, Plus, Minus, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface MenuListProps {
  products: Product[];
}

export default function MenuList({ products }: MenuListProps) {
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId] -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getCartCount = (productId: string) => cart[productId] || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => {
        const count = getCartCount(product.id);
        
        return (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48 bg-gray-200">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <ImageIcon className="text-gray-400" size={48} />
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h3>
              <p className="text-gray-600 mb-3 text-sm line-clamp-2">{product.description}</p>
              <p className="text-lg font-bold text-green-600 mb-4">
                Rp {product.price.toLocaleString('id-ID')}
              </p>
              
              <div className="flex items-center justify-between">
                {count > 0 ? (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold min-w-[20px] text-center">{count}</span>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(product.id)}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                  >
                    <ShoppingCart size={16} />
                    <span>Add to Cart</span>
                  </button>
                )}
                
                {count > 0 && (
                  <span className="text-sm text-green-600 font-semibold">
                    Rp {(product.price * count).toLocaleString('id-ID')}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
