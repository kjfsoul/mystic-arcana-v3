-- This is a test script to verify the trigger works
-- You can run this in the Supabase SQL Editor

-- First, check if the trigger exists
SELECT tgname, tgrelid::regclass, tgtype, tgenabled
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- Check if the function exists
SELECT proname, pronamespace::regnamespace, prosrc
FROM pg_proc
WHERE proname = 'handle_new_user';

-- Check if the users table exists and has the correct structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'users';

-- Check if there are any existing users in the public.users table
SELECT COUNT(*) FROM public.users;

-- Check if there are any existing users in the auth.users table
SELECT COUNT(*) FROM auth.users;
