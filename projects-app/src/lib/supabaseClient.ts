import {createClient} from '@supabase/supabase-js';
import type {Database} from '../../database/types'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
)
export const getProjectBySlug = async (slug: string) => {
  return supabase
    .from('projects')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()
}



