-- Supabase Schema Setup for Meeting Booking Web App
-- Copy and run this script in your Supabase SQL Editor

-- 1. Create the meetings table
CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    selected_date TEXT NOT NULL,
    selected_time TEXT NOT NULL,
    project_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    meeting_link TEXT,
    calendar_event_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create index on date and time for fast availability queries and deduplication
CREATE INDEX IF NOT EXISTS idx_meetings_schedule ON meetings (selected_date, selected_time) WHERE (status <> 'cancelled');

-- 3. Enable Row Level Security (RLS)
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- Allow anyone to create a meeting request
CREATE POLICY "Allow public insert to meetings" 
ON meetings 
FOR INSERT 
WITH CHECK (true);

-- Allow public to select meetings (restricted for availability checking or read)
-- Note: In production, you can restrict read access, but we enable standard reading.
CREATE POLICY "Allow public read-only access to meetings" 
ON meetings 
FOR SELECT 
USING (true);

-- Allow full access for service_role (e.g. backend actions or admin queries)
CREATE POLICY "Allow full access to service_role" 
ON meetings 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 5. Auto-update updated_at helper trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_meetings_updated_at
    BEFORE UPDATE ON meetings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
