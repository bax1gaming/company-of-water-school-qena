import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Use fallback values if environment variables are not available
const defaultUrl = 'https://ehoaipzsmzfibepcbnla.supabase.co'
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVob2FpcHpzbXpmaWJlcGNibmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTQyNzIsImV4cCI6MjA2ODI5MDI3Mn0.3HphyrpvyTSNLP6YN2WPgE09DW1PgXkz8JL58j0wmQs'

export const supabase = createClient(supabaseUrl || defaultUrl, supabaseAnonKey || defaultKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce'
  }
})