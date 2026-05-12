import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // The 'next' parameter determines the destination after a successful login.
  // The default is set to the Secure Vault.
  const next = searchParams.get('next') ?? '/vault'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Upon successful authorization, redirect the agent to their objective.
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // If the authentication protocol fails, redirect to the login portal with an error alert.
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
