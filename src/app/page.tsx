'use client';
import { useState } from 'react';
import { ShoppingCart, Search } from 'lucide-react';
import MenuList from '@/components/menu/MenuList';
import CartSidebar from '@/components/cart/CartSidebar';
import { Product, CartItem } from '@/types';

const dummyProducts: Product[] = [
  {
    id: '1', 
    name: 'Nasi Goreng Spesial', 
    description: 'Nasi goreng dengan telur, ayam, dan sayuran segar', 
    price: 25000, 
    image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop&auto=format',
    category: 'main-course', 
    created_at: new Date().toISOString()
  },
  {
    id: '2', 
    name: 'Ayam Bakar Madu', 
    description: 'Ayam bakar dengan bumbu madu spesial', 
    price: 35000, 
    image_url: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400&h=300&fit=crop&auto=format',
    category: 'main-course', 
    created_at: new Date().toISOString()
  },
  {
    id: '3', 
    name: 'Gado-Gado', 
    description: 'Salad sayuran dengan bumbu kacang khas', 
    price: 20000, 
    image_url: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=400&h=300&fit=crop&auto=format',
    category: 'appetizer', 
    created_at: new Date().toISOString()
  },
  {
    id: '4', 
    name: 'Es Jeruk Segar', 
    description: 'Minuman jeruk segar dengan es', 
    price: 8000, 
    image_url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop&auto=format',
    category: 'beverage', 
    created_at: new Date().toISOString()
  },
  {
    id: '5', 
    name: 'Sate Ayam', 
    description: 'Sate ayam dengan bumbu kacang', 
    price: 30000, 
    image_url: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400&h=300&fit=crop&auto=format',
    category: 'main-course', 
    created_at: new Date().toISOString()
  },
  {
    id: '6', 
    name: 'Es Teh Manis', 
    description: 'Teh manis dingin yang menyegarkan', 
    price: 5000, 
    image_url: 'https://images.unsplash.com/photo-1597481499750-87cacb57f816?w=400&h=300&fit=crop&auto=format',
    category: 'beverage', 
    created_at: new Date().toISOString()
  },
  {
    id: '7', 
    name: 'Rendang Daging', 
    description: 'Daging sapi dimasak dengan bumbu rempah khas Padang', 
    price: 45000, 
    image_url: 'https://images.unsplash.com/photo-1559311645-0c0d6a4d6d7c?w=400&h=300&fit=crop&auto=format',
    category: 'main-course', 
    created_at: new Date().toISOString()
  },
  {
    id: '8', 
    name: 'Soto Ayam', 
    description: 'Soto ayam hangat dengan suwiran ayam dan tauge', 
    price: 22000, 
    image_url: 'https://images.unsplash.com/photo-1563245372-f20324a0f381?w=400&h=300&fit=crop&auto=format',
    category: 'main-course', 
    created_at: new Date().toISOString()
  },
  {
    id: '9', 
    name: 'Bakso Malang', 
    description: 'Bakso urat dengan mie dan pangsit goreng', 
    price: 18000, 
    image_url: 'https://images.unsplash.com/photo-1582610115987-49b84f104a08?w=400&h=300&fit=crop&auto=format',
    category: 'main-course', 
    created_at: new Date().toISOString()
  }
];

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all'];
  dummyProducts.forEach(product => {
    if (!categories.includes(product.category)) {
      categories.push(product.category);
    }
  });

  const filteredProducts = dummyProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCartItems(prev => {
        const existingItem = prev.find(item => item.product.id === productId);
        if (existingItem) {
          return prev.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          );
        }
        const product = dummyProducts.find(p => p.id === productId);
        if (product) {
          return [...prev, { product, quantity }];
        }
        return prev;
      });
    }
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    alert('Checkout functionality will be implemented with payment gateway!');
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-3xl">🍽️</span>
              <h1 className="text-2xl font-bold text-gray-800">Restaurant AI</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                <ShoppingCart size={24} />
                {getTotalCartItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {getTotalCartItems()}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex space-x-2 mt-4 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Our Delicious Menu</h2>
          <p className="text-lg text-gray-600">Fresh ingredients, authentic flavors</p>
        </div>

        <MenuList products={filteredProducts} />
      </main>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
