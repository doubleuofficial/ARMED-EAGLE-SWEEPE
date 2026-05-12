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
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Tactical Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <KeyRound className="text-cyan-500" size={28} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
            Credential Recovery
          </h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] mt-2">
            Establish New Security Protocol
          </p>
        </div>

        <div className="bg-black border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600" />

          {!success ? (
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl text-white placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl text-white placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/5 border border-red-500/20 text-red-500 text-xs font-mono italic">
                  <ShieldAlert size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
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
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 mb-2">
                <CheckCircle2 className="text-green-500" size={40} />
              </div>
              <h2 className="text-white font-bold text-lg uppercase tracking-tight">Protocol Updated</h2>
              <p className="text-zinc-500 text-sm font-mono">
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
              className="text-zinc-600 hover:text-zinc-400 text-[10px] font-mono uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft size={12} /> Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
