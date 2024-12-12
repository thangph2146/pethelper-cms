
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://arbeqbuvldpudlsqpyqm.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || 'default_supabase_key'
if (!process.env.SUPABASE_KEY) {
  throw new Error('SUPABASE_KEY is not defined')
}
const supabase = createClient(supabaseUrl, supabaseKey)

// Example usage to avoid "value is never read" error
supabase.auth.getSession().then(({ data: { session } }) => {
  console.log(session)
})