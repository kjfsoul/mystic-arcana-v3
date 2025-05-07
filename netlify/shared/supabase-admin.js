// Supabase Admin Client for Netlify Functions
// This client uses the service role key and should only be used in trusted server environments

import { createClient } from '@supabase/supabase-js';

// Check for required environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required Supabase environment variables for admin client');
}

// Create the admin client with service role privileges
// This bypasses RLS policies - use with caution!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to verify if admin client is properly configured
export const verifyAdminConnection = async () => {
  try {
    // Try a simple query to verify the connection
    const { data, error } = await supabaseAdmin
      .from('tarot_cards')
      .select('count', { count: 'exact' })
      .limit(1);
      
    if (error) {
      console.error('Admin client connection error:', error.message);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Failed to verify admin connection:', err);
    return false;
  }
};

// Helper function to get a user by ID
export const getUserById = async (userId) => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching user:', error.message);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Error in getUserById:', err);
    return null;
  }
};

// Helper function to check if a user has premium access
export const isPremiumUser = async (userId) => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabaseAdmin
      .from('user_subscriptions')
      .select('status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
      
    if (error) {
      console.error('Error checking premium status:', error.message);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error('Error in isPremiumUser:', err);
    return false;
  }
};

export default supabaseAdmin;