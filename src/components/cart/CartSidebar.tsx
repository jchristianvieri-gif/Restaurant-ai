'use client';
import { useState } from 'react';
import { Product } from '@/types';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: { product: Product; quantity: number }[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

export default function CartSidebar({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem,
  onCheckout 
}: CartSidebarProps) {
  const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <ShoppingBag className="mr-2" size={20} />
            Shopping Cart
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="h-full overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded">
                  <img 
                    src={item.product.image_url} 
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{item.product.name}</h3>
                    <p className="text-green-600 font-semibold">
                      Rp {item.product.price.toLocaleString('id-ID')}
                    </p>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="text-lg font-bold text-green-600">
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 font-semibold"
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
