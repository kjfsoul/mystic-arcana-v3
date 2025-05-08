-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create journal_entries table with vector support
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  emotion_tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);

-- Create user_cards table to track card usage
CREATE TABLE IF NOT EXISTS user_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_name TEXT NOT NULL,
  count INTEGER DEFAULT 1,
  first_drawn_at TIMESTAMPTZ DEFAULT NOW(),
  last_drawn_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, card_name)
);

-- Create index on user_id
CREATE INDEX IF NOT EXISTS idx_user_cards_user_id ON user_cards(user_id);

-- Create index on count for quick retrieval of most drawn cards
CREATE INDEX IF NOT EXISTS idx_user_cards_count ON user_cards(count DESC);

-- Create user_feedback table
CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interpretation_id UUID,
  explicit_feedback TEXT,
  time_spent_ms INTEGER,
  scroll_depth FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);

-- Create daily_content table
CREATE TABLE IF NOT EXISTS daily_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  card_of_the_day TEXT,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on date
CREATE INDEX IF NOT EXISTS idx_daily_content_date ON daily_content(date);

-- Create scheduled_posts table
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT NOT NULL,
  content JSONB NOT NULL,
  image_url TEXT,
  scheduled_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on status
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_status ON scheduled_posts(status);

-- Create index on scheduled_time
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_time ON scheduled_posts(scheduled_time);

-- Add fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS zodiac_placements JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS most_drawn_cards TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS preferred_themes TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS archetype_vector VECTOR(1536);

-- Create function to match journal entries by vector similarity
CREATE OR REPLACE FUNCTION match_journal_entries(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  user_id UUID
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    journal_entries.id,
    journal_entries.content,
    1 - (journal_entries.embedding <=> query_embedding) AS similarity
  FROM journal_entries
  WHERE journal_entries.user_id = match_journal_entries.user_id
  AND 1 - (journal_entries.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
