import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xhuqhmgcfeehylewzbcj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodXFobWdjZmVlaHlsZXd6YmNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMTc1MzMsImV4cCI6MjA5NDY5MzUzM30.qPSl4xvpHANG0d4bfV0ilaUyfXQJ9ZXWA9Z5CCgipb0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
