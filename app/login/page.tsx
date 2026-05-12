'use client'
import React, { useState } from 'react'
import { Target, Shield, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { error } = await signIn(email, password)
      if (error) throw error
      router.push('/vault') // Redirect to Secure Vault [4]
    } catch (err: any) {
      setError(err.message || 'Could not authenticate user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#1A1A1A] border border-[#2D2D2D] p-8 rounded-lg top-secret-border"
      >
        <div className="flex flex-col items-center mb-8">
          <Target className="w-12 h-12 text-[#D4AF37] mb-2" />
          <h1 className="text-2xl font-bold text-[#E5E5E5] tracking-tighter">AGENT LOGIN</h1>
          <p className="text-[#888888] text-sm">Secure Intelligence Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-3 rounded flex items-center gap-2 text-red-500 text-sm">
              <AlertTriangle className="w-4 h-4" /> {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-mono text-[#D4AF37] uppercase mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#050505] border border-[#2D2D2D] p-3 rounded text-white focus:border-[#D4AF37] outline-none" 
              required 
            />
          </div>
          <div className="relative">
            <label className="block text-xs font-mono text-[#D4AF37] uppercase mb-2">Access Key</label>
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#050505] border border-[#2D2D2D] p-3 rounded text-white focus:border-[#D4AF37] outline-none" 
              required 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-[#888888]"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <Button disabled={loading} className="w-full bg-[#D4AF37] hover:bg-[#F1C40F] text-black font-bold">
            {loading ? "INITIALIZING..." : "AUTHORIZE ACCESS"}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm">
          <Link href="/signup" className="text-[#888888] hover:text-[#D4AF37]">Request New Credentials</Link>
        </div>
      </motion.div>
    </div>
  )
}
