-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category VARCHAR(100) DEFAULT 'food',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'pending',
  midtrans_order_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category) VALUES
('Nasi Goreng Spesial', 'Nasi goreng dengan telur, ayam, dan sayuran segar', 25000, '/images/nasi-goreng.jpg', 'main course'),
('Ayam Bakar Madu', 'Ayam bakar dengan bumbu madu spesial', 35000, '/images/ayam-bakar.jpg', 'main course'),
('Es Teh Manis', 'Es teh segar dengan gula aren', 8000, '/images/es-teh.jpg', 'beverage'),
('Juice Alpukat', 'Juice alpukat segar dengan susu', 15000, '/images/juice-alpukat.jpg', 'beverage'),
('Gado-gado', 'Salad tradisional dengan bumbu kacang', 20000, '/images/gado-gado.jpg', 'appetizer');
