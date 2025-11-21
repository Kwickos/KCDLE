import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bfzmtiuthynmyykxplly.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmem10aXV0aHlubXl5a3hwbGx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MjY0NTgsImV4cCI6MjA3OTMwMjQ1OH0.u2Kn28gGRj3Ir5u3nNWJhQaQ09tzvw9E4YJcJpAaCFc'

export const supabase = createClient(supabaseUrl, supabaseKey)
