import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient('https://vrpxweazkhztaeweaujf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycHh3ZWF6a2h6dGFld2VhdWpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyOTkxMjEsImV4cCI6MjA1MDg3NTEyMX0.XlkphtC-iiDXHbbU5sKSpdWoa1QSzHMlHtsdDzFmYEY')
