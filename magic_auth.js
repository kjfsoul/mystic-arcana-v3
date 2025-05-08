// magic-auth.js
import { createClient } from "@supabase/supabase-js";

// Use environment variables for Supabase credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_KEY; // Assuming ANON key is needed here, adjust if SERVICE_ROLE is required

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("FATAL ERROR in magic_auth.js: Missing VITE_SUPABASE_URL or VITE_SUPABASE_KEY environment variables.");
  // Depending on the context, you might throw an error or handle this differently
  // For now, we'll allow initialization but log the error.
}

// Initialize client, potentially with null values if env vars are missing
export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");

// Sends a magic link to the user's email
export const signInWithMagicLink = async (email) => {
  const { error } = await supabase.auth.signInWithOtp({ email });

  if (error) {
    console.error("Error sending magic link:", error.message);
    return { success: false, message: error.message };
  }

  return { success: true, message: "Magic link sent! Check your inbox." };
};
