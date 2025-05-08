-- Create the tarot_card_interpretations table
CREATE TABLE IF NOT EXISTS tarot_card_interpretations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  arcana TEXT NOT NULL,
  suit TEXT,
  number INTEGER,
  keywords TEXT[] DEFAULT '{}',
  elemental_association TEXT,
  astrological_association TEXT,
  numerological_association TEXT,
  general_meaning TEXT,
  upright_meaning TEXT,
  reversed_meaning TEXT,
  symbols TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  figures TEXT[] DEFAULT '{}',
  story TEXT,
  journey TEXT,
  lessons TEXT[] DEFAULT '{}',
  psychological_implications TEXT,
  shadow_aspects TEXT,
  growth_opportunities TEXT,
  relationship_context TEXT,
  career_context TEXT,
  spiritual_context TEXT,
  health_context TEXT,
  financial_context TEXT,
  complementary_cards TEXT[] DEFAULT '{}',
  opposing_cards TEXT[] DEFAULT '{}',
  progression_cards TEXT[] DEFAULT '{}',
  sources JSONB,
  personalization JSONB,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  version TEXT DEFAULT '1.0.0',
  contributors TEXT[] DEFAULT '{}'
);

-- Create the personalized_interpretations table
CREATE TABLE IF NOT EXISTS personalized_interpretations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL,
  is_reversed BOOLEAN DEFAULT false,
  spread_position TEXT,
  spread_type TEXT,
  question TEXT,
  focus_area TEXT,
  other_cards TEXT[],
  current_mood TEXT,
  time_of_day TEXT,
  interpretation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  detailed_interpretation TEXT NOT NULL,
  personal_insight TEXT,
  advice TEXT,
  challenge TEXT,
  opportunity TEXT,
  relation_to_question TEXT,
  relation_to_other_cards TEXT,
  suggested_image_url TEXT,
  suggested_colors TEXT[],
  sources_used JSONB,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  personalization_level INTEGER DEFAULT 5
);

-- Create the interpretation_ratings table
CREATE TABLE IF NOT EXISTS interpretation_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  interpretation_id UUID REFERENCES personalized_interpretations(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the community_interpretations table
CREATE TABLE IF NOT EXISTS community_interpretations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL,
  interpretation TEXT NOT NULL,
  rating FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create the youtube_transcripts table
CREATE TABLE IF NOT EXISTS youtube_transcripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  creator TEXT NOT NULL,
  transcript TEXT NOT NULL,
  card_mappings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS personalized_interpretations_user_id_idx ON personalized_interpretations(user_id);
CREATE INDEX IF NOT EXISTS personalized_interpretations_card_id_idx ON personalized_interpretations(card_id);
CREATE INDEX IF NOT EXISTS interpretation_ratings_user_id_idx ON interpretation_ratings(user_id);
CREATE INDEX IF NOT EXISTS interpretation_ratings_interpretation_id_idx ON interpretation_ratings(interpretation_id);
CREATE INDEX IF NOT EXISTS community_interpretations_card_id_idx ON community_interpretations(card_id);
CREATE INDEX IF NOT EXISTS community_interpretations_user_id_idx ON community_interpretations(user_id);
CREATE INDEX IF NOT EXISTS youtube_transcripts_video_id_idx ON youtube_transcripts(video_id);

-- Create RLS policies
ALTER TABLE tarot_card_interpretations ENABLE ROW LEVEL SECURITY;
ALTER TABLE personalized_interpretations ENABLE ROW LEVEL SECURITY;
ALTER TABLE interpretation_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_interpretations ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_transcripts ENABLE ROW LEVEL SECURITY;

-- Create policies for tarot_card_interpretations
CREATE POLICY "Anyone can view tarot card interpretations"
  ON tarot_card_interpretations
  FOR SELECT
  USING (true);

-- Create policies for personalized_interpretations
CREATE POLICY "Users can view their own personalized interpretations"
  ON personalized_interpretations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own personalized interpretations"
  ON personalized_interpretations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for interpretation_ratings
CREATE POLICY "Users can view their own interpretation ratings"
  ON interpretation_ratings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interpretation ratings"
  ON interpretation_ratings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for community_interpretations
CREATE POLICY "Anyone can view community interpretations"
  ON community_interpretations
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own community interpretations"
  ON community_interpretations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own community interpretations"
  ON community_interpretations
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for youtube_transcripts
CREATE POLICY "Anyone can view YouTube transcripts"
  ON youtube_transcripts
  FOR SELECT
  USING (true);
