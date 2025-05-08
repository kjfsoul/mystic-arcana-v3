-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  subscription_level TEXT DEFAULT 'basic',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create spiritual_profiles table
CREATE TABLE IF NOT EXISTS public.spiritual_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  draw_history JSONB DEFAULT '[]'::jsonb,
  mood_trend JSONB DEFAULT '[]'::jsonb,
  emotion_vector JSONB DEFAULT '[]'::jsonb,
  journal_themes JSONB DEFAULT '[]'::jsonb,
  journal_sentiment JSONB DEFAULT '{}'::jsonb,
  preferred_spreads JSONB DEFAULT '[]'::jsonb,
  time_of_day_preference TEXT DEFAULT 'evening',
  weekday_preference INTEGER[] DEFAULT '{0,1,2,3,4,5,6}'::integer[],
  session_frequency INTEGER DEFAULT 0,
  visual_theme TEXT DEFAULT 'cosmic',
  reading_tone TEXT DEFAULT 'supportive',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_interactions table
CREATE TABLE IF NOT EXISTS public.user_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vector_embeddings table
CREATE TABLE IF NOT EXISTS public.vector_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  embedding VECTOR(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spiritual_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vector_embeddings ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own user data" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own user data" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create policies for user_profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create policies for spiritual_profiles table
CREATE POLICY "Users can view their own spiritual profile" 
  ON public.spiritual_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own spiritual profile" 
  ON public.spiritual_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own spiritual profile" 
  ON public.spiritual_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policies for user_interactions table
CREATE POLICY "Users can view their own interactions" 
  ON public.user_interactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions" 
  ON public.user_interactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policies for vector_embeddings table
CREATE POLICY "Users can view their own embeddings" 
  ON public.vector_embeddings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own embeddings" 
  ON public.vector_embeddings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into users table
  INSERT INTO public.users (id, username, email, subscription_level, created_at)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)), 
    NEW.email,
    'basic',
    NOW()
  );
  
  -- Insert into user_profiles table
  INSERT INTO public.user_profiles (id, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8))
  );
  
  -- Insert into spiritual_profiles table
  INSERT INTO public.spiritual_profiles (id, user_id)
  VALUES (
    uuid_generate_v4(),
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
