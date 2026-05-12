'use client'

import React, { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { KeyRound, ShieldAlert, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage() {
  // Initialize Supabase Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('Credentials do not match. Verification failed.')
      return
    }

    if (password.length < 6) {
      setError('Security protocol requires at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) throw updateError

      setSuccess(true)
      // Redirect to login after 3 seconds
      setTimeout(() => {
        window.location.href = '/login'
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to update credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-tactical-bg flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Tactical Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gold/10 border border-gold/20 mb-4 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <KeyRound className="text-gold" size={28} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
            Credential Recovery
          </h1>
          <p className="text-tactical-muted font-mono text-[10px] uppercase tracking-[0.3em] mt-2">
            Establish New Security Protocol
          </p>
        </div>

        <div className="bg-tactical-card border-2 border-gold rounded-lg p-8 shadow-[0_0_20px_rgba(212,175,55,0.1)] relative overflow-hidden">
          {/* Subtle Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-yellow-500" />

          {!success ? (
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-tactical-muted uppercase tracking-widest ml-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-tactical-border p-4 rounded-sm text-white placeholder:text-tactical-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-tactical-muted uppercase tracking-widest ml-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-tactical-border p-4 rounded-sm text-white placeholder:text-tactical-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/50 transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 rounded-sm bg-red-500/5 border border-red-500/30 text-red-400 text-xs font-mono italic">
                  <ShieldAlert size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gold text-black py-4 rounded-sm font-black uppercase tracking-widest hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  'Authorize Update'
                )}
              </button>
            </form>
          ) : (
            <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 mb-2">
                <CheckCircle2 className="text-green-500" size={40} />
              </div>
              <h2 className="text-white font-bold text-lg uppercase tracking-tight">Protocol Updated</h2>
              <p className="text-tactical-muted text-sm font-mono">
                Your new credentials have been established. Redirecting to login...
              </p>
            </div>
          )}
        </div>

        {/* Back to Login Link */}
        {!success && (
          <div className="mt-8 text-center">
            <Link 
              href="/login" 
              className="text-tactical-muted hover:text-gold text-[10px] font-mono uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft size={12} /> Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
