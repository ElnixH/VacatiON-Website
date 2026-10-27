import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://rdawaagwkopqogwnvbsy.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkYXdhYWd3a29wcW9nd252YnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMDU3NjksImV4cCI6MjEwODY4MTc2OX0.tjmDNPgMSSOcbAKa3pPy1nGXotvo8sBCCBqyr1Ml0M8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
