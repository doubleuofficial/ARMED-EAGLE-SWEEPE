'use client'
import React, { useState } from 'react'
import { Target, UserPlus, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) return setError("Passwords do not match")
    setLoading(true)
    setError('')
    
    try {
      const { error } = await signUp(email, password)
      if (error) throw error
      setSuccess(true) [6]
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-[#D4AF37] mx-auto" />
          <h2 className="text-2xl font-bold text-white">RECRUITMENT INITIATED</h2>
          <p className="text-[#888888]">Check your communication channel for verification.</p>
          <Link href="/login"><Button className="bg-[#D4AF37] text-black">RETURN TO BASE</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <motion.div className="w-full max-w-md bg-[#1A1A1A] border border-[#2D2D2D] p-8 rounded-lg">
        <div className="flex flex-col items-center mb-8">
          <UserPlus className="w-12 h-12 text-[#D4AF37] mb-2" />
          <h1 className="text-2xl font-bold text-white uppercase">New Agent Registration</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email and Password inputs similar to Login component */}
          <div>
            <label className="block text-xs font-mono text-[#D4AF37] uppercase mb-1">Confirm Access Key</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#050505] border border-[#2D2D2D] p-3 rounded text-white" 
              required 
            />
          </div>
          <Button disabled={loading} className="w-full bg-[#D4AF37] text-black uppercase font-bold">
            {loading ? "PROCESSING..." : "REGISTER AGENT"}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
