import { createClient } from '@/lib/supabase/server' // Adjust this path to your server client
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // 'next' is where we want to send them after they are logged in
  const next = searchParams.get('next') ?? '/vault'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If something goes wrong, send them to a login page with an error
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
