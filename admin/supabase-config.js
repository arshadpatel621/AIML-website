// Supabase Configuration
// IMPORTANT: In production, use environment variables for credentials

const SUPABASE_URL = 'https://nazeyrzodnnvcqwttrvr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hemV5cnpvZG5udmNxd3R0cnZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzOTIyNzksImV4cCI6MjA3Njk2ODI3OX0.oHOUT6pUyumaOBs3OO3GDEWFXMkpaI4m6ui0ajOACEs';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabase = supabaseClient;
