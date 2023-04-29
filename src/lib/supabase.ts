import { createClient } from '@supabase/supabase-js'


const SUPABASEURL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASESECRETKEY = process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY || ''

if (!SUPABASEURL && !SUPABASESECRETKEY) {
  throw new Error('Missing SUPABASEURL or SUPABASESECRETKEY')
}

export const supabase = createClient(
  SUPABASEURL,
  SUPABASESECRETKEY
)