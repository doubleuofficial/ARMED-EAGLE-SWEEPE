'use client'

import React, { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Shield, Smartphone, Key, CheckCircle, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { authenticator } from '@otplib/preset-default'

interface MFASetupModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

type MFAType = 'totp' | 'sms'

export function MFASetupModal({ isOpen, onClose, onSuccess }: MFASetupModalProps) {
  const [step, setStep] = useState<'select' | 'setup' | 'verify'>('select')
  const [mfaType, setMfaType] = useState<MFAType | null>(null)
  const [secret, setSecret] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (step === 'setup' && mfaType === 'totp' && !secret) {
      generateTOTPSecret()
    }
  }, [step, mfaType])

  const generateTOTPSecret = async () => {
    const newSecret = authenticator.generateSecret()
    setSecret(newSecret)

    // Generate QR code URL
    const otpauth = authenticator.keyuri(
      user?.email || 'user',
      'Armed Eagle Vault',
      newSecret
    )
    setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth)}`)
  }

  const handleSelectType = (type: MFAType) => {
    setMfaType(type)
    setStep('setup')
  }

  const handleVerifyTOTP = async () => {
    if (!secret || !verificationCode) return

    setLoading(true)
    setError('')

    try {
      const isValid = authenticator.verify({
        token: verificationCode,
        secret: secret
      })

      if (!isValid) {
        setError('Invalid verification code')
        return
      }

      // Save MFA settings to database
      const { error } = await supabase
        .from('user_mfa')
        .upsert({
          user_id: user?.id,
          mfa_type: 'totp',
          totp_secret: secret,
          enabled: true,
          created_at: new Date().toISOString(),
        })

      if (error) throw error

      onSuccess()
      onClose()
      resetModal()
    } catch (err) {
      console.error('Error setting up MFA:', err)
      setError('Failed to setup MFA')
    } finally {
      setLoading(false)
    }
  }

  const handleSetupSMS = async () => {
    if (!phoneNumber) return

    setLoading(true)
    setError('')

    try {
      // In a real implementation, you'd send an SMS with a verification code
      // For now, we'll just save the phone number
      const { error } = await supabase
        .from('user_mfa')
        .upsert({
          user_id: user?.id,
          mfa_type: 'sms',
          phone_number: phoneNumber,
          enabled: true,
          created_at: new Date().toISOString(),
        })

      if (error) throw error

      onSuccess()
      onClose()
      resetModal()
    } catch (err) {
      console.error('Error setting up SMS MFA:', err)
      setError('Failed to setup SMS MFA')
    } finally {
      setLoading(false)
    }
  }

  const resetModal = () => {
    setStep('select')
    setMfaType(null)
    setSecret('')
    setQrCodeUrl('')
    setVerificationCode('')
    setPhoneNumber('')
    setError('')
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="MULTI-FACTOR AUTHENTICATION SETUP">
      <div className="space-y-6">
        {step === 'select' && (
          <div className="space-y-4">
            <p className="text-tactical-muted text-sm font-mono">
              Choose your preferred multi-factor authentication method:
            </p>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleSelectType('totp')}
                className="p-4 border border-tactical-border rounded-sm hover:border-gold transition-colors text-left group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Key className="text-gold group-hover:animate-pulse" size={20} />
                  <span className="font-mono text-sm font-bold text-white">Authenticator App (TOTP)</span>
                </div>
                <p className="text-tactical-muted text-xs font-mono">
                  Use Google Authenticator, Authy, or similar apps for time-based one-time passwords.
                </p>
              </button>

              <button
                onClick={() => handleSelectType('sms')}
                className="p-4 border border-tactical-border rounded-sm hover:border-gold transition-colors text-left group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Smartphone className="text-gold group-hover:animate-pulse" size={20} />
                  <span className="font-mono text-sm font-bold text-white">SMS Verification</span>
                </div>
                <p className="text-tactical-muted text-xs font-mono">
                  Receive verification codes via SMS to your mobile device.
                </p>
              </button>
            </div>
          </div>
        )}

        {step === 'setup' && mfaType === 'totp' && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-2">Setup Authenticator App</h3>
              <p className="text-tactical-muted text-sm font-mono mb-4">
                Scan the QR code with your authenticator app
              </p>
            </div>

            {qrCodeUrl && (
              <div className="flex justify-center">
                <img src={qrCodeUrl} alt="QR Code" className="border border-tactical-border rounded-sm" />
              </div>
            )}

            <div className="bg-black/30 p-3 border border-tactical-border rounded-sm">
              <p className="text-tactical-muted text-xs font-mono mb-1">Manual Entry Code:</p>
              <p className="text-gold font-mono text-sm font-bold break-all">{secret}</p>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-tactical-muted tracking-widest">
                Enter verification code from app:
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full bg-black/40 border-b-2 border-tactical-border py-3 px-4 font-mono text-sm text-white focus:outline-none focus:border-gold transition-colors"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="ghost" onClick={() => setStep('select')} size="sm">
                Back
              </Button>
              <Button onClick={handleVerifyTOTP} disabled={loading || verificationCode.length !== 6} size="sm">
                {loading ? 'Verifying...' : 'Verify & Enable'}
              </Button>
            </div>
          </div>
        )}

        {step === 'setup' && mfaType === 'sms' && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-white mb-2">Setup SMS Verification</h3>
              <p className="text-tactical-muted text-sm font-mono mb-4">
                Enter your phone number to receive verification codes
              </p>
            </div>

            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-tactical-muted tracking-widest">
                Phone Number:
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-black/40 border-b-2 border-tactical-border py-3 px-4 font-mono text-sm text-white focus:outline-none focus:border-gold transition-colors"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-sm">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="text-yellow-500" size={14} />
                <span className="text-yellow-400 text-xs font-mono font-bold">Note</span>
              </div>
              <p className="text-yellow-100/70 text-xs font-mono">
                SMS verification requires additional backend setup for production use.
                This is a placeholder implementation.
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="ghost" onClick={() => setStep('select')} size="sm">
                Back
              </Button>
              <Button onClick={handleSetupSMS} disabled={loading || !phoneNumber} size="sm">
                {loading ? 'Setting up...' : 'Enable SMS MFA'}
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-sm">
            <p className="text-red-400 text-xs font-mono">{error}</p>
          </div>
        )}
      </div>
    </Modal>
  )
}