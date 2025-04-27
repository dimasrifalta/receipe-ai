import { createClient } from '@supabase/supabase-js';

// Check if environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug log to check if environment variables are available
console.log('Supabase environment variables:', { 
  hasUrl: !!supabaseUrl, 
  url: supabaseUrl?.substring(0, 10) + '...',
  hasAnonKey: !!supabaseAnonKey,
  key: supabaseAnonKey ? 'PROVIDED' : 'MISSING'
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials not found in environment variables. Check your .env file.');
}

// Create the real Supabase client
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'supabase-auth',
  }
});

console.log('Real Supabase client initialized with credentials');

export const supabase = supabaseClient;