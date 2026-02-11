-- Create a table to store clinic-wide settings, including secure tokens
CREATE TABLE IF NOT EXISTS clinic_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies (Restrict to Admin/System roles in production)
ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;

-- Example: Insert placeholder for Google Calendar Config
-- INSERT INTO clinic_settings (key, value) VALUES 
-- ('google_calendar_auth', '{"refresh_token": null, "access_token": null, "expiry": null}');
