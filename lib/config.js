// Configuration for different environments
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Demo mode fallback
export const useDemoMode = isDevelopment || !process.env.OPENAI_API_KEY;

console.log(`🎯 Environment: ${process.env.NODE_ENV}`);
console.log(`🔧 Demo Mode: ${useDemoMode}`);
