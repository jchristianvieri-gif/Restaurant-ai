import { createClient } from '@supabase/supabase-js'
import { useDemoMode } from './config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Demo data storage
let demoProducts = [];
let demoStorage = [];

// Real Supabase client
let supabase;

if (!useDemoMode && supabaseUrl && supabaseKey) {
  console.log('🚀 Using REAL Supabase');
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.log('🎭 Using DEMO Supabase');
  
  // Mock Supabase client untuk demo
  supabase = {
    from: (table) => ({
      select: (columns = '*') => {
        console.log(`🎭 DEMO DB: SELECT from ${table}`, columns);
        return Promise.resolve({ 
          data: table === 'products' ? demoProducts : [], 
          error: null 
        });
      },
      insert: (data) => {
        console.log(`🎭 DEMO DB: INSERT into ${table}`, data);
        const newItem = { 
          id: Math.random().toString(36).substr(2, 9), 
          ...data[0],
          created_at: new Date().toISOString()
        };
        demoProducts.unshift(newItem);
        return Promise.resolve({ data: [newItem], error: null });
      },
      delete: () => {
        console.log(`🎭 DEMO DB: DELETE from ${table}`);
        return Promise.resolve({ data: [], error: null });
      },
      update: () => {
        console.log(`🎭 DEMO DB: UPDATE ${table}`);
        return Promise.resolve({ data: [], error: null });
      }
    }),
    storage: {
      from: (bucket) => ({
        upload: (path, file) => {
          console.log(`🎭 DEMO Storage: UPLOAD to ${bucket}/${path}`);
          // Simulate upload delay
          return new Promise(resolve => {
            setTimeout(() => {
              const demoUrl = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&name=${path}`;
              demoStorage.push({ path, url: demoUrl });
              resolve({ error: null, data: { path } });
            }, 1000);
          });
        },
        getPublicUrl: (path) => {
          console.log(`🎭 DEMO Storage: GET URL for ${path}`);
          const demoUrl = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&name=${path}`;
          return { data: { publicUrl: demoUrl } };
        }
      })
    }
  };
}

export { supabase };
