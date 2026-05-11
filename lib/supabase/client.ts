import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error('Supabase credentials missing. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment.')
    // Return a dummy client or handle it gracefully in caller
    // For now, we allow the SSR client to fail if called without keys to maintain type safety
  }

  return createBrowserClient(
    url || '',
    key || ''
  )
}
