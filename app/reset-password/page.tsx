'use client'
import React, { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { KeyRound, ShieldAlert, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ) [3]

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) return setError("Keys do not match")
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.updateUser({ password }) [7]
      if (error) throw error
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1A1A1A] border border-[#2D2D2D] p-8 rounded-lg top-secret-border">
        <div className="mb-8 text-center">
          <KeyRound className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
          <h1 className="text-2xl font-bold tracking-tight">UPDATE ACCESS KEY</h1>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
            <p className="text-green-500">Access Key Successfully Updated.</p>
            <Link href="/login" className="inline-flex items-center text-[#D4AF37] hover:underline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 p-3 rounded flex items-center gap-2 text-red-500">
                <ShieldAlert className="w-4 h-4" /> {error}
              </div>
            )}
            <input 
              type="password" 
              placeholder="NEW ACCESS KEY"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-[#2D2D2D] p-3 rounded"
            />
            <input 
              type="password" 
              placeholder="CONFIRM KEY"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-black border border-[#2D2D2D] p-3 rounded"
            />
            <button 
              disabled={loading}
              className="w-full bg-[#D4AF37] text-black font-bold p-3 rounded hover:bg-[#F1C40F] disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "EXECUTE UPDATE"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
]
