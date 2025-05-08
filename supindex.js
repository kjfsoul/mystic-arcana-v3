import { createClient } from "@supabase/supabase-js";

// Use environment variables for Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY; // Assuming ANON key is needed here

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("FATAL ERROR in supindex.js: Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.");
  // Exit or handle appropriately if this script relies on the client
  process.exit(1); // Exit if credentials are required for this script to run
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Supabase client initialized using environment variables.");
// Add a check to see if the client object looks valid if needed
// console.log("Supabase client object:", supabase);
