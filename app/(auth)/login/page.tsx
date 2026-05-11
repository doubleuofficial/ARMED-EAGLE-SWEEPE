'use client'

import React, { useState } from 'react'
import { Target, Shield, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import Link from 'next/link'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Auth simulation
    setTimeout(() => {
      window.location.href = '/'
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-tactical-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Login Box */}
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
            Personnel Authentication Required
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-tactical-muted tracking-widest pl-1">Agent ID / Codename</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  className="w-full bg-black/40 border-b-2 border-tactical-border py-3 px-4 font-mono text-sm text-white focus:outline-none focus:border-gold transition-colors"
                  placeholder="ENTER ID..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-tactical-muted tracking-widest pl-1">Access Protocol</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="w-full bg-black/40 border-b-2 border-tactical-border py-3 px-4 pr-12 font-mono text-sm text-white focus:outline-none focus:border-gold transition-colors"
                  placeholder="ENTER CODE..."
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

            <div className="pt-4">
              <Button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 h-12">
                {loading ? (
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock size={16} />
                    Establish Connection
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-tactical-border/50 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[10px] font-mono text-tactical-muted italic leading-tight">
              <AlertTriangle className="text-yellow-500 shrink-0" size={14} />
              <span>Unauthorized access attempts are logged and reported to Central Command.</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
              <Link href="#" className="hover:text-gold transition-colors">Forgot Code</Link>
              <Link href="#" className="hover:text-gold transition-colors text-white">Request Clearance</Link>
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
