'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Star, Clock, Shield } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { ProductCard } from '../components/ProductCard'
import { Cart } from '../components/Cart'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
}

interface CartItem {
  product: Product
  quantity: number
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'Nasi Goreng Spesial',
        description: 'Nasi goreng dengan telur, ayam, dan sayuran segar',
        price: 25000,
        image_url: '',
        category: 'main course'
      },
      {
        id: '2',
        name: 'Ayam Bakar Madu',
        description: 'Ayam bakar dengan bumbu madu spesial',
        price: 35000,
        image_url: '',
        category: 'main course'
      },
      {
        id: '3',
        name: 'Es Teh Manis',
        description: 'Es teh segar dengan gula aren',
        price: 8000,
        image_url: '',
        category: 'beverage'
      },
      {
        id: '4',
        name: 'Juice Alpukat',
        description: 'Juice alpukat segar dengan susu',
        price: 15000,
        image_url: '',
        category: 'beverage'
      }
    ]
    setProducts(sampleProducts)
  }

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">🍔</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RestoAI
              </h1>
            </div>
            
            <Button 
              onClick={() => setIsCartOpen(true)}
              className="relative"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">Selamat Datang di RestoAI</h1>
          <p className="text-xl mb-8">Restoran modern dengan teknologi AI</p>
          <div className="flex justify-center space-x-4">
            <Button variant="secondary" size="lg">Lihat Menu</Button>
            <Button variant="outline" size="lg" className="border-white text-white">
              Pesan Sekarang
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Cepat & Mudah</h3>
              <p className="text-gray-600">Pesan dalam beberapa klik</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-teal-50 shadow-lg">
              <Star className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Kualitas Terbaik</h3>
              <p className="text-gray-600">Bahan-bahan segar</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg">
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Pembayaran Aman</h3>
              <p className="text-gray-600">Sistem terjamin</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Menu Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 RestoAI. All rights reserved.</p>
        </div>
      </footer>

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        setCart={setCart}
      />
    </div>
  )
}
