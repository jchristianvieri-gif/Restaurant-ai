// Configuration for different environments
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Check if we have all required environment variables
export const hasSupabaseConfig = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export const hasOpenAIConfig = !!process.env.OPENAI_API_KEY;

export const hasMidtransConfig = !!(
  process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY && 
  process.env.MIDTRANS_SERVER_KEY
);

// Demo mode fallback - use demo when missing configs
export const useDemoMode = !hasSupabaseConfig || !hasOpenAIConfig;

// Logging for debugging
if (typeof window === 'undefined') { // Server-side only
  console.log(`🎯 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔧 Demo Mode: ${useDemoMode}`);
  console.log(`📊 Supabase Config: ${hasSupabaseConfig ? '✅' : '❌'}`);
  console.log(`🤖 OpenAI Config: ${hasOpenAIConfig ? '✅' : '❌'}`);
  console.log(`💳 Midtrans Config: ${hasMidtransConfig ? '✅' : '❌'}`);
}