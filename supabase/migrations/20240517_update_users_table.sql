-- Update RLS policies for the actual users table structure
-- First, enable RLS on the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the users table
CREATE POLICY "Users can view their own user data" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own user data" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create a trigger function to automatically create a user record when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into users table with the actual structure
  INSERT INTO public.users (id, email, created_at)
  VALUES (
    NEW.id, 
    NEW.email,
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
