-- Enable the pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the spiritual_profiles table
CREATE TABLE IF NOT EXISTS spiritual_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sun_sign TEXT,
  moon_sign TEXT,
  rising_sign TEXT,
  birth_chart JSONB,
  draw_history JSONB DEFAULT '[]'::jsonb,
  significator_card TEXT,
  preferred_spreads TEXT[] DEFAULT '{}',
  mood_trend TEXT[] DEFAULT '{}',
  emotion_vector VECTOR(1536),
  journal_themes JSONB DEFAULT '[]'::jsonb,
  journal_sentiment JSONB DEFAULT '{"positive": 0, "negative": 0, "neutral": 0}'::jsonb,
  time_of_day_preference TEXT DEFAULT 'evening',
  weekday_preference INTEGER[] DEFAULT '{0, 0, 0, 0, 0, 0, 0}',
  session_frequency INTEGER DEFAULT 0,
  visual_theme TEXT DEFAULT 'cosmic',
  reading_tone TEXT DEFAULT 'supportive',
  profile_embedding VECTOR(1536),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for similarity search on spiritual profiles
CREATE INDEX IF NOT EXISTS spiritual_profiles_embedding_idx 
ON spiritual_profiles USING ivfflat (profile_embedding vector_cosine_ops) WITH (lists = 100);

-- Create the user_interactions table
CREATE TABLE IF NOT EXISTS user_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on user_id and interaction_type
CREATE INDEX IF NOT EXISTS user_interactions_user_id_idx ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS user_interactions_interaction_type_idx ON user_interactions(interaction_type);

-- Create the personalized_recommendations table
CREATE TABLE IF NOT EXISTS personalized_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL,
  content TEXT NOT NULL,
  tone TEXT DEFAULT 'supportive',
  visual_theme TEXT DEFAULT 'cosmic',
  related_cards TEXT[] DEFAULT '{}',
  related_themes TEXT[] DEFAULT '{}',
  feedback INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on user_id and recommendation_type
CREATE INDEX IF NOT EXISTS personalized_recommendations_user_id_idx ON personalized_recommendations(user_id);
CREATE INDEX IF NOT EXISTS personalized_recommendations_recommendation_type_idx ON personalized_recommendations(recommendation_type);

-- Create a function to find similar spiritual profiles
CREATE OR REPLACE FUNCTION match_spiritual_profiles(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  sun_sign TEXT,
  moon_sign TEXT,
  rising_sign TEXT,
  mood_trend TEXT[],
  journal_themes JSONB,
  visual_theme TEXT,
  reading_tone TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    spiritual_profiles.id,
    spiritual_profiles.user_id,
    spiritual_profiles.sun_sign,
    spiritual_profiles.moon_sign,
    spiritual_profiles.rising_sign,
    spiritual_profiles.mood_trend,
    spiritual_profiles.journal_themes,
    spiritual_profiles.visual_theme,
    spiritual_profiles.reading_tone,
    1 - (spiritual_profiles.profile_embedding <=> query_embedding) AS similarity
  FROM spiritual_profiles
  WHERE 
    spiritual_profiles.profile_embedding IS NOT NULL
    AND 1 - (spiritual_profiles.profile_embedding <=> query_embedding) > match_threshold
  ORDER BY spiritual_profiles.profile_embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create RLS policies
ALTER TABLE spiritual_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalized_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for spiritual_profiles
CREATE POLICY "Users can view their own spiritual profile"
  ON spiritual_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own spiritual profile"
  ON spiritual_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own spiritual profile"
  ON spiritual_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for user_interactions
CREATE POLICY "Users can view their own interactions"
  ON user_interactions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions"
  ON user_interactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for personalized_recommendations
CREATE POLICY "Users can view their own recommendations"
  ON personalized_recommendations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations"
  ON personalized_recommendations
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recommendations"
  ON personalized_recommendations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
