-- Add subscription fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT,
ADD COLUMN IF NOT EXISTS is_subscribed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS subscription_tier TEXT,
ADD COLUMN IF NOT EXISTS subscription_created_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_updated_at TIMESTAMPTZ;

-- Create index for stripe_customer_id
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);

-- Create index for subscription_id
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_id ON profiles(subscription_id);

-- Create index for is_subscribed
CREATE INDEX IF NOT EXISTS idx_profiles_is_subscribed ON profiles(is_subscribed);

-- Create a function to update subscription_updated_at
CREATE OR REPLACE FUNCTION update_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.subscription_updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update subscription_updated_at
DROP TRIGGER IF EXISTS update_profiles_subscription_updated_at ON profiles;
CREATE TRIGGER update_profiles_subscription_updated_at
BEFORE UPDATE OF subscription_id, subscription_status, is_subscribed, subscription_tier
ON profiles
FOR EACH ROW
WHEN (OLD.subscription_id IS DISTINCT FROM NEW.subscription_id OR
      OLD.subscription_status IS DISTINCT FROM NEW.subscription_status OR
      OLD.is_subscribed IS DISTINCT FROM NEW.is_subscribed OR
      OLD.subscription_tier IS DISTINCT FROM NEW.subscription_tier)
EXECUTE FUNCTION update_subscription_updated_at();
