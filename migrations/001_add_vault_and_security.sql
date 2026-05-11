-- Migration: Add vault and security features
-- Run this in your Supabase SQL editor

-- Create vault_entries table for storing encrypted passwords
CREATE TABLE IF NOT EXISTS vault_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  username TEXT NOT NULL,
  encrypted_password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table for tracking sensitive actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'view_password', 'create_entry', 'modify_entry', 'delete_entry'
  details TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_mfa table for MFA settings
CREATE TABLE IF NOT EXISTS user_mfa (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  mfa_type TEXT NOT NULL CHECK (mfa_type IN ('totp', 'sms')),
  totp_secret TEXT, -- Only for TOTP
  phone_number TEXT, -- Only for SMS
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vault_entries_user_id ON vault_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_mfa_user_id ON user_mfa(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE vault_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mfa ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vault_entries
CREATE POLICY "Users can only access their own vault entries"
  ON vault_entries
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for audit_logs
CREATE POLICY "Users can only access their own audit logs"
  ON audit_logs
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for user_mfa
CREATE POLICY "Users can only access their own MFA settings"
  ON user_mfa
  FOR ALL
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_vault_entries_updated_at
  BEFORE UPDATE ON vault_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_mfa_updated_at
  BEFORE UPDATE ON user_mfa
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();