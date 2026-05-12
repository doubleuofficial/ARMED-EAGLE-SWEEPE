-- Migration: Add user onboarding and tutorial system
-- Run this in your Supabase SQL editor

-- Create user_onboarding table for tracking tutorial progress
CREATE TABLE IF NOT EXISTS user_onboarding (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  tutorial_completed BOOLEAN DEFAULT FALSE,
  vault_tutorial_shown BOOLEAN DEFAULT FALSE,
  dashboard_tutorial_shown BOOLEAN DEFAULT FALSE,
  security_tutorial_shown BOOLEAN DEFAULT FALSE,
  rewards_tutorial_shown BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table for advanced settings
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  theme TEXT DEFAULT 'tactical' CHECK (theme IN ('tactical', 'dark', 'light')),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  auto_lock_vault BOOLEAN DEFAULT TRUE,
  auto_lock_timeout INTEGER DEFAULT 30, -- minutes
  password_strength_indicator BOOLEAN DEFAULT TRUE,
  audit_log_retention INTEGER DEFAULT 90, -- days
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create advanced analytics table
CREATE TABLE IF NOT EXISTS sweepstake_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_id UUID REFERENCES vault_entries(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  entry_date DATE NOT NULL,
  amount_entered DECIMAL(10,2) DEFAULT 0,
  potential_win DECIMAL(10,2) DEFAULT 0,
  actual_win DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'won', 'lost', 'pending')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rewards tracking table
CREATE TABLE IF NOT EXISTS user_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('cash', 'points', 'bonus', 'free_entry')),
  platform TEXT NOT NULL,
  amount DECIMAL(10,2),
  description TEXT,
  claimed BOOLEAN DEFAULT FALSE,
  claimed_date TIMESTAMP WITH TIME ZONE,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create security alerts table
CREATE TABLE IF NOT EXISTS security_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('password_exposed', 'unusual_activity', 'weak_password', 'mfa_disabled')),
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message TEXT NOT NULL,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_onboarding_user_id ON user_onboarding(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_sweepstake_analytics_user_id ON sweepstake_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_sweepstake_analytics_entry_date ON sweepstake_analytics(entry_date);
CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_security_alerts_user_id ON security_alerts(user_id);

-- Enable RLS
ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE sweepstake_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only access their own onboarding data"
  ON user_onboarding FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own preferences"
  ON user_preferences FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own analytics"
  ON sweepstake_analytics FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own rewards"
  ON user_rewards FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own security alerts"
  ON security_alerts FOR ALL USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_user_onboarding_updated_at
  BEFORE UPDATE ON user_onboarding
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sweepstake_analytics_updated_at
  BEFORE UPDATE ON sweepstake_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();