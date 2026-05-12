'use client'

import React, { useState } from 'react'
import { Target, Shield, Mail, AlertTriangle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { resetPassword } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await resetPassword(email)

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
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
              <Mail size={14} className="text-gold" />
              Reset Code Sent
            </div>

            <div className="mb-6">
              <p className="text-tactical-muted text-sm mb-4">
                A secure reset link has been dispatched to your email address.
                Check your inbox and follow the instructions to establish a new access code.
              </p>
              <p className="text-tactical-muted text-xs">
                If you don't see the message, check your spam folder.
              </p>
            </div>

            <Link href="/login">
              <Button className="w-full flex items-center justify-center gap-2">
                <ArrowLeft size={16} />
                Return to Login
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

      {/* Reset Box */}
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
            Access Code Reset
          </div>

          <p className="text-tactical-muted text-sm mb-6">
            Enter your agent email address. A secure reset link will be dispatched to re-establish your access credentials.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-tactical-muted tracking-widest pl-1">Agent Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border-b-2 border-tactical-border py-3 px-4 font-mono text-sm text-white focus:outline-none focus:border-gold transition-colors"
                  placeholder="ENTER EMAIL..."
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
                    <Mail size={16} />
                    Send Reset Code
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-tactical-border/50 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[10px] font-mono text-tactical-muted italic leading-tight">
              <AlertTriangle className="text-yellow-500 shrink-0" size={14} />
              <span>Reset requests are logged for security purposes.</span>
            </div>
            <div className="flex justify-center text-[10px] font-mono uppercase tracking-widest">
              <Link href="/login" className="hover:text-gold transition-colors">
                Back to Login
              </Link>
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