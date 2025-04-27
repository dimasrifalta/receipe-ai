import { createClient } from '@supabase/supabase-js';

// Check if environment variables are defined
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// For development purposes, use a mock client if environment variables are missing
let supabaseClient;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found in environment variables. Using mock Supabase client for development.');
  
  // Mock implementation of Supabase client for development
  const mockStorage = {
    recipes: []
  };
  
  // Extended mock client with auth methods
  supabaseClient = {
    from: (table) => ({
      select: () => ({
        order: () => ({
          data: mockStorage[table] || [],
          error: null
        }),
        eq: () => ({
          single: () => ({
            data: null,
            error: null
          })
        })
      }),
      insert: (data) => {
        if (!mockStorage[table]) {
          mockStorage[table] = [];
        }
        mockStorage[table].push(data);
        return { data, error: null };
      }
    }),
    auth: {
      signUp: ({ email, password }) => {
        console.log('Mock signup:', email);
        return Promise.resolve({
          data: { user: { id: 'mock-user-id', email } },
          error: null
        });
      },
      signInWithPassword: ({ email, password }) => {
        console.log('Mock sign in:', email);
        return Promise.resolve({
          data: { user: { id: 'mock-user-id', email } },
          error: null
        });
      },
      signOut: () => {
        console.log('Mock sign out');
        return Promise.resolve({ error: null });
      },
      getSession: () => {
        return Promise.resolve({
          data: { session: null },
          error: null
        });
      },
      onAuthStateChange: (callback) => {
        // No-op for mock
        return { data: { subscription: { unsubscribe: () => {} } } };
      }
    }
  };
} else {
  // Use actual Supabase client if credentials are available
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseClient;