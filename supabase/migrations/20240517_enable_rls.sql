-- Enable Row Level Security (RLS) on all public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_traits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profile_embeddings ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for users table
CREATE POLICY "Users can view their own user data" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own user data" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create basic RLS policies for profiles table
CREATE POLICY "Profiles are viewable by users who created them" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profiles" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profiles" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create basic RLS policies for journal_entries table
CREATE POLICY "Journal entries are viewable by users who created them" 
  ON public.journal_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries" 
  ON public.journal_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal entries" 
  ON public.journal_entries 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal entries" 
  ON public.journal_entries 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create basic RLS policies for journals table
CREATE POLICY "Journals are viewable by users who created them" 
  ON public.journals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journals" 
  ON public.journals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journals" 
  ON public.journals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journals" 
  ON public.journals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create basic RLS policies for user_traits table
CREATE POLICY "User traits are viewable by users who created them" 
  ON public.user_traits 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own traits" 
  ON public.user_traits 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own traits" 
  ON public.user_traits 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create basic RLS policies for user_profile_embeddings table
CREATE POLICY "User profile embeddings are viewable by users who created them" 
  ON public.user_profile_embeddings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile embeddings" 
  ON public.user_profile_embeddings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile embeddings" 
  ON public.user_profile_embeddings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create basic RLS policies for survey_responses table
CREATE POLICY "Survey responses are viewable by users who created them" 
  ON public.survey_responses 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own survey responses" 
  ON public.survey_responses 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own survey responses" 
  ON public.survey_responses 
  FOR UPDATE 
  USING (auth.uid() = user_id);
