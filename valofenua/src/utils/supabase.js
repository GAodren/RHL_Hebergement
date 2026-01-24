import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Vérifier que les variables sont configurées
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERREUR: Variables Supabase non configurées!')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
