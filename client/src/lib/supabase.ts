import { createClient } from '@supabase/supabase-js';

// Frontend Supabase client - for authenticated user operations
// Uses the anon key which has row-level security enabled
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables in frontend client');
}

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Helper hook to get the current session
export const getSession = async () => {
  const { data, error } = await supabaseClient.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error.message);
    return null;
  }
  
  return data.session;
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  const session = await getSession();
  return session?.user ?? null;
};

// Helper function to check if a user is authenticated
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return !!user;
};

// Simple hook to provide auth state
export const useAuth = () => {
  // This is just a placeholder to ensure we have useAuth defined
  // A complete implementation would track auth state with useState and useEffect
  return {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    signIn: async () => {},
    signOut: async () => {},
  };
};

// Export types for better TypeScript support
export type { User, Session } from '@supabase/supabase-js';