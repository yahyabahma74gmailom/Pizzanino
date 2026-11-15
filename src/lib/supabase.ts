import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? 'https://ixqbjoayybxpywfoiajb.supabase.co',
  import.meta.env.VITE_SUPABASE_KEY ?? 'sb_publishable_9gRfqDAvCZp8GGmWSa4ezw_yjy_R_lB')
export const LOGO = '🍕'
export const APP_NAME = 'Pizza Socia'
