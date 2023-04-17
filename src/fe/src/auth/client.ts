import { createClient } from '@supabase/supabase-js';

const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseClient = () => {
  if (import.meta.env.DEV) {
    return createClient(
      'https://cgwfxuokgmjuaxftrnka.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnd2Z4dW9rZ21qdWF4ZnRybmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA5OTAxMjQsImV4cCI6MTk5NjU2NjEyNH0.UgblSY4dpSjFINw7urWArzgz-Je0b0Ql3n1NwkUZnc4',
    );
  } else {
    return createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
  }
};
