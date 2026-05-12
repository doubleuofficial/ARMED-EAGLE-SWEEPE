'use client'

import React, { useState, useEffect } from 'react'
import { Target, Shield, Lock, Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    // Check if we have the required tokens from the URL
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')

    if (!accessToken || !refreshToken) {
      setError('Invalid reset link. Please request a new password reset.')
      return
    }

    // Set the session with the tokens from the URL
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
  }, [searchParams, supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-tactical-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md z-10"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gold grid place-items-center rounded-sm rotate-45 mb-6 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <Target className="text-black -rotate-45" size={32} />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter text-white uppercase italic">Armed Eagle</h1>
            <p className="text-tactical-muted font-mono text-[10px] uppercase tracking-[0.3em] mt-2">Strategic Intelligence Interface</p>
          </div>

          <div className="top-secret-border bg-tactical-card p-8 text-center">
            <div className="tactical-header mb-6">
              <CheckCircle size={14} className="text-green-500" />
              Access Code Updated
            </div>

            <div className="mb-6">
              <p className="text-tactical-muted text-sm mb-4">
                Your access code has been successfully updated. You will be redirected to the login terminal shortly.
              </p>
              <p className="text-tactical-muted text-xs">
                Please use your new credentials to establish connection.
              </p>
            </div>

            <Link href="/login">
              <Button className="w-full flex items-center justify-center gap-2">
                <Shield size={16} />
                Proceed to Login
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-tactical-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Update Password Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gold grid place-items-center rounded-sm rotate-45 mb-6 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
            <Target className="text-black -rotate-45" size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-white uppercase italic">Armed Eagle</h1>
          <p className="text-tactical-muted font-mono text-[10px] uppercase tracking-[0.3em] mt-2">Strategic Intelligence Interface</p>
        </div>

        <div className="top-secret-border bg-tactical-card p-8">
          <div className="tactical-header mb-6">
            <Shield size={14} className="text-gold" />
            Establish New Access Code
          </div>

          <p className="text-tactical-muted text-sm mb-6">
            Enter your new access code below. Ensure it meets security requirements for maximum protection.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-tactical-muted tracking-widest pl-1">New Access Code</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border-b-2 border-tactical-border py-3 px-4 pr-12 font-mono text-sm text-white focus:outline-none focus:border-gold transition-colors"
                  placeholder="ENTER NEW CODE..."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-tactical-muted hover:text-gold transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-tactical-muted tracking-widest pl-1">Confirm Access Code</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-black/40 border-b-2 border-tactical-border py-3 px-4 pr-12 font-mono text-sm text-white focus:outline-none focus:border-gold transition-colors"
                  placeholder="CONFIRM NEW CODE..."
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-sm">
                <p className="text-red-400 text-xs font-mono">{error}</p>
              </div>
            )}

            <div className="pt-4">
              <Button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 h-12">
                {loading ? (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock size={16} />
                    Update Access Code
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-tactical-border/50">
            <div className="flex items-center gap-3 text-[10px] font-mono text-tactical-muted italic leading-tight">
              <AlertTriangle className="text-yellow-500 shrink-0" size={14} />
              <span>Access codes must be at least 6 characters long for security clearance.</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[9px] font-mono text-tactical-muted uppercase tracking-[0.2em]">Secure Session // AES-256 Multi-Layer Encryption</p>
        </div>
      </motion.div>
    </div>
  )
}