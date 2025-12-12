import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://hztnwtbrlxtvvqairxit.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6dG53dGJybHh0dnZxYWlyeGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0MjMzNzgsImV4cCI6MjA4MDk5OTM3OH0.kaJcc-NhbbnhdZMrj2qQrDMBKA-OEKcORlaXNpkiZDc";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
