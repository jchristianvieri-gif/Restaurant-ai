import { createClient } from '@supabase/supabase-js';
import { useDemoMode, hasSupabaseConfig } from './config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Demo data storage
let demoProducts = [
  {
    id: 'demo-1',
    name: "Wagyu Beef Burger",
    description: "Premium wagyu beef with truffle aioli and aged cheddar",
    price: 125000,
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=300&fit=crop",
    category: 'main',
    rating: 4.9,
    preparation: '20-25 min',
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-2',
    name: "Truffle Pasta",
    description: "Fresh pasta with black truffle and parmesan cream sauce",
    price: 98000,
    image_url: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=300&fit=crop",
    category: 'main',
    rating: 4.8,
    preparation: '15-20 min',
    created_at: new Date().toISOString()
  }
];

let demoStorage = [];

// Real Supabase client
let supabase;

if (hasSupabaseConfig && !useDemoMode) {
  console.log('🚀 Using REAL Supabase');
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.log('🎭 Using DEMO Supabase');
  
  // Mock Supabase client untuk demo
  supabase = {
    from: (table) => ({
      select: (columns = '*') => {
        console.log(`🎭 DEMO DB: SELECT ${columns} from ${table}`);
        return {
          order: (column, options) => ({
            then: (callback) => {
              const data = table === 'products' ? demoProducts : [];
              return callback({ data, error: null });
            }
          }),
          then: (callback) => {
            const data = table === 'products' ? demoProducts : [];
            return callback({ data, error: null });
          }
        };
      },
      insert: (data) => {
        console.log(`🎭 DEMO DB: INSERT into ${table}`, data);
        return {
          select: () => ({
            then: (callback) => {
              const newItem = { 
                id: `demo-${Date.now()}`, 
                ...data[0],
                created_at: new Date().toISOString()
              };
              if (table === 'products') {
                demoProducts.unshift(newItem);
              }
              return callback({ data: [newItem], error: null });
            }
          }),
          then: (callback) => {
            const newItem = { 
              id: `demo-${Date.now()}`, 
              ...data[0],
              created_at: new Date().toISOString()
            };
            if (table === 'products') {
              demoProducts.unshift(newItem);
            }
            return callback({ data: [newItem], error: null });
          }
        };
      },
      delete: () => ({
        eq: (column, value) => ({
          then: (callback) => {
            console.log(`🎭 DEMO DB: DELETE from ${table} WHERE ${column} = ${value}`);
            if (table === 'products') {
              demoProducts = demoProducts.filter(item => item.id !== value);
            }
            return callback({ data: [], error: null });
          }
        })
      }),
      update: (data) => ({
        eq: (column, value) => ({
          then: (callback) => {
            console.log(`🎭 DEMO DB: UPDATE ${table} SET`, data, `WHERE ${column} = ${value}`);
            return callback({ data: [], error: null });
          }
        })
      })
    }),
    storage: {
      from: (bucket) => ({
        upload: (path, file) => {
          console.log(`🎭 DEMO Storage: UPLOAD to ${bucket}/${path}`);
          return new Promise(resolve => {
            setTimeout(() => {
              const demoUrl = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&name=${encodeURIComponent(path)}`;
              demoStorage.push({ path, url: demoUrl });
              resolve({ error: null, data: { path } });
            }, 1000);
          });
        },
        getPublicUrl: (path) => {
          console.log(`🎭 DEMO Storage: GET URL for ${path}`);
          const demoUrl = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&name=${encodeURIComponent(path)}`;
          return { data: { publicUrl: demoUrl } };
        }
      })
    }
  };
}

export { supabase };