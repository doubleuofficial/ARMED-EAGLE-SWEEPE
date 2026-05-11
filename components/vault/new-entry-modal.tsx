'use client'

import React, { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Shield, Lock, Eye, EyeOff } from 'lucide-react'
import { checkPasswordStrength, PasswordStrength } from '@/lib/password-strength'
import { encryptPassword } from '@/lib/encryption'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'

interface NewEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function NewEntryModal({ isOpen, onClose, onSuccess }: NewEntryModalProps) {
  const [platform, setPlatform] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const supabase = createClient()

  const passwordStrength = checkPasswordStrength(password)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (passwordStrength.score < 2) {
      setError('Password must be at least medium strength')
      return
    }

    setLoading(true)
    setError('')

    try {
      const encryptedPassword = encryptPassword(password)

      const { error } = await supabase
        .from('vault_entries')
        .insert({
          user_id: user.id,
          platform,
          username,
          encrypted_password: encryptedPassword,
          created_at: new Date().toISOString(),
        })

      if (error) throw error

      // Log audit trail
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action: 'create_entry',
          details: `Created entry for ${platform}`,
          timestamp: new Date().toISOString(),
        })

      onSuccess()
      onClose()
      // Reset form
      setPlatform('')
      setUsername('')
      setPassword('')
    } catch (err) {
      console.error('Error creating entry:', err)
      setError('Failed to create entry')
    } finally {
      setLoading(false)
    }
  }

  const getStrengthBarColor = (strength: PasswordStrength) => {
    switch (strength.score) {
      case 0: return 'bg-red-500'
      case 1: return 'bg-red-400'
      case 2: return 'bg-yellow-500'
      case 3: return 'bg-green-500'
      case 4: return 'bg-green-400'
      default: return 'bg-gray-500'
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="NEW INTELLIGENCE ASSET">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase text-tactical-muted tracking-widest pl-1">
            Platform / Service
          </label>
          <input
            type="text"
            required
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full bg-black/40 border-b-2 border-tactical-border py-3 px-4 font-mono text-sm text-white focus:outline-none focus:border-gold transition-colors"
            placeholder="ENTER PLATFORM NAME..."
          />
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase text-tactical-muted tracking-widest pl-1">
            Agent Identification
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-black/40 border-b-2 border-tactical-border py-3 px-4 font-mono text-sm text-white focus:outline-none focus:border-gold transition-colors"
            placeholder="ENTER USERNAME..."
          />
        </div>

        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase text-tactical-muted tracking-widest pl-1">
            Access Protocol
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border-b-2 border-tactical-border py-3 px-4 pr-12 font-mono text-sm text-white focus:outline-none focus:border-gold transition-colors"
              placeholder="ENTER PASSWORD..."
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-tactical-muted hover:text-gold transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase tracking-widest text-tactical-muted">
                  Security Level
                </span>
                <span className={`text-[10px] font-mono font-bold ${passwordStrength.color}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-sm transition-colors ${
                      level <= passwordStrength.score
                        ? getStrengthBarColor(passwordStrength)
                        : 'bg-tactical-border'
                    }`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[8px] font-mono">
                <div className={`flex items-center gap-1 ${passwordStrength.checks.length ? 'text-green-500' : 'text-red-500'}`}>
                  <div className={`w-1 h-1 rounded-full ${passwordStrength.checks.length ? 'bg-green-500' : 'bg-red-500'}`} />
                  8+ chars
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength.checks.uppercase ? 'text-green-500' : 'text-red-500'}`}>
                  <div className={`w-1 h-1 rounded-full ${passwordStrength.checks.uppercase ? 'bg-green-500' : 'bg-red-500'}`} />
                  Uppercase
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength.checks.lowercase ? 'text-green-500' : 'text-red-500'}`}>
                  <div className={`w-1 h-1 rounded-full ${passwordStrength.checks.lowercase ? 'bg-green-500' : 'bg-red-500'}`} />
                  Lowercase
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength.checks.numbers ? 'text-green-500' : 'text-red-500'}`}>
                  <div className={`w-1 h-1 rounded-full ${passwordStrength.checks.numbers ? 'bg-green-500' : 'bg-red-500'}`} />
                  Numbers
                </div>
                <div className={`flex items-center gap-1 ${passwordStrength.checks.special ? 'text-green-500' : 'text-red-500'}`}>
                  <div className={`w-1 h-1 rounded-full ${passwordStrength.checks.special ? 'bg-green-500' : 'bg-red-500'}`} />
                  Special
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-sm">
            <p className="text-red-400 text-xs font-mono">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-4 border-t border-tactical-border pt-6">
          <Button type="button" variant="ghost" onClick={onClose} size="sm" disabled={loading}>
            Abort
          </Button>
          <Button type="submit" size="sm" disabled={loading || passwordStrength.score < 2}>
            {loading ? (
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Shield className="w-4 h-4 mr-2" />
            )}
            Deploy Asset
          </Button>
        </div>
      </form>
    </Modal>
  )
}