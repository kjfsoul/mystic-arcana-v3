# Supabase Setup Guide for MysticArcana

This guide will help you properly set up and configure Supabase for the MysticArcana application.

## Prerequisites

- Supabase account (free tier is sufficient for development)
- Basic understanding of SQL and database concepts
- Access to the MysticArcana codebase

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com/) and sign in or create an account
2. Click "New Project"
3. Enter a name for your project (e.g., "mysticarcana-dev")
4. Choose a database password (save this securely)
5. Select your region (choose one closest to your users)
6. Click "Create new project"

## Step 2: Get Your API Keys

1. After your project is created, go to the project dashboard
2. In the left sidebar, click on "Project Settings" (the gear icon)
3. Click on "API" in the settings menu
4. You'll find two important values:
   - **Project URL** - This is your `SUPABASE_URL`
   - **anon/public** key - This is your `SUPABASE_ANON_KEY`
   - **service_role** key - This is your `SUPABASE_SERVICE_ROLE_KEY` (keep this secure!)

## Step 3: Set Up Environment Variables

For the MysticArcana application to connect to Supabase correctly, you need to set up environment variables in the proper format.

### Local Development

Create a `.env` file in the root of your project with the following variables:

```
# Backend/Server Environment Variables
SUPABASE_URL=https://your-project-url.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Frontend Environment Variables (used by Vite)
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Important Note**: The `VITE_` prefix is necessary for frontend variables to be accessible in browser code. The non-prefixed variables are only used in server-side code (like Netlify Functions).

### Netlify Deployment

For deploying to Netlify, add these same environment variables in the Netlify dashboard:

1. Go to your Netlify site dashboard
2. Navigate to Site settings > Build & deploy > Environment
3. Add the variables listed above
4. Redeploy your site for the changes to take effect

You can also use our script to set this up:

```bash
node scripts/setup-netlify-env.js
```

## Step 4: Create Required Database Tables

Supabase uses PostgreSQL as its database. MysticArcana requires several tables to function properly.

### Core Tables

Run the following SQL in the Supabase SQL Editor to create the necessary tables:

```sql
-- Users table (extends Supabase Auth)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_premium BOOLEAN DEFAULT false
);

-- Tarot Cards table
CREATE TABLE public.tarot_cards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  arcana TEXT NOT NULL CHECK (arcana IN ('major', 'minor')),
  suit TEXT CHECK (suit IN ('wands', 'cups', 'swords', 'pentacles')),
  meaning_upright TEXT NOT NULL,
  meaning_reversed TEXT NOT NULL,
  image_id TEXT,
  normalized_name TEXT,
  keywords JSONB DEFAULT '[]'::jsonb,
  element TEXT,
  zodiac_sign TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Readings table
CREATE TABLE public.user_readings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  card_id TEXT REFERENCES public.tarot_cards(id),
  reading_type TEXT NOT NULL,
  is_reversed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_saved BOOLEAN DEFAULT false
);

-- User Subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) UNIQUE,
  status TEXT NOT NULL DEFAULT 'inactive',
  plan_id TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);
```

### Row Level Security (RLS) Policies

Set up RLS policies to secure your data:

```sql
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarot_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Public access to tarot_cards
CREATE POLICY "Allow public read access to tarot_cards" 
ON public.tarot_cards FOR SELECT 
TO public 
USING (true);

-- Users can read and update their own data
CREATE POLICY "Users can read own data" 
ON public.users FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can update own data" 
ON public.users FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Users can CRUD their own readings
CREATE POLICY "Users can CRUD own readings" 
ON public.user_readings 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id);

-- Users can read their own subscriptions
CREATE POLICY "Users can read own subscriptions" 
ON public.user_subscriptions 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);
```

## Step 5: Seed Tarot Card Data

Run the provided seed script to populate your database with tarot card data:

```bash
node scripts/seed-tarot-data.js
```

Or manually insert card data using the SQL Editor.

## Step 6: Set Up Supabase Auth

1. In the Supabase dashboard, go to Authentication > Providers
2. Ensure Email auth is enabled (it is by default)
3. Optional: Configure additional providers like Google, GitHub, etc.

## Step 7: Set Up Storage (Optional)

If you need to store user uploads (like custom card images):

1. Go to Storage in the Supabase dashboard
2. Create a new bucket called "tarot-assets"
3. Set up RLS policies for your bucket

## Troubleshooting

### Common Issues

1. **Incorrect Environment Variables**: Double check that your environment variables match exactly what's in the Supabase dashboard.

2. **CORS Errors**: If you get CORS errors, check your Supabase project settings:
   - Go to Project Settings > API > API Settings
   - Add your site URL to the allowed domains list

3. **Auth Issues**: Ensure that your RLS policies are correctly configured.

4. **Function Not Working**: When Netlify Functions can't connect to Supabase, check:
   - Environment variables in Netlify dashboard
   - Ensure you're using `process.env.SUPABASE_URL` (not `VITE_SUPABASE_URL`) in serverless functions

5. **Card Images Not Loading**: Verify that image paths in the tarot_cards table match your file structure.

### Check Connection

To verify your Supabase connection, visit:

```
/check-supabase-url.html
```

This page will test your connection and show any configuration issues.

## Next Steps

Once Supabase is properly set up, you should be able to:

1. Run the application locally with working tarot card features
2. Create user accounts and authenticate
3. Save readings to user history
4. Deploy to Netlify with proper environment configuration

For advanced Supabase features like realtime subscriptions, edge functions, or database triggers, refer to the official [Supabase documentation](https://supabase.com/docs).