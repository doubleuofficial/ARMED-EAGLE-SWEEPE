'use client'

import React, { useState, useEffect } from 'react'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import { 
  ShieldCheck, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Smartphone 
} from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface MFASetupModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
  onSuccess: () => void
}

export default function MFASetupModal({ isOpen, onClose, userEmail, onSuccess }: MFASetupModalProps) {
  const supabase = createClientComponentClient()
  const [step, setStep] = useState(1)
  const [secret, setSecret] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // 1. Initialize TOTP Secret and QR Code
  useEffect(() => {
    if (isOpen && step === 1) {
      generateSetupData()
    }
  }, [isOpen])

  const generateSetupData = async () => {
    try {
      const newSecret = authenticator.generateSecret()
      setSecret(newSecret)

      // Generate the otpauth:// URI for the authenticator app
      const otpauth = authenticator.keyuri(
        userEmail,
        'Armed Eagle Vault',
        newSecret
      )

      // Generate QR code locally (no external API calls)
      const url = await QRCode.toDataURL(otpauth, {
        width: 250,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
      setQrCodeUrl(url)
    } catch (err) {
      setError('Failed to generate MFA setup. Please try again.')
    }
  }

  // 2. Verify and Save to Supabase
  const handleVerifyAndEnable = async () => {
    setLoading(true)
    setError('')

    try {
      // Validate the 6-digit code using otplib
      const isValid = authenticator.check(verificationCode, secret)

      if (!isValid) {
        setError('Invalid verification code. Please check your app.')
        setLoading(false)
        return
      }

      // Save to user_mfa table
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('User not found')

      const { error: dbError } = await supabase
        .from('user_mfa')
        .upsert({
          user_id: user.id,
          mfa_type: 'totp',
          totp_secret: secret,
          enabled: true,
          created_at: new Date().toISOString()
        })

      if (dbError) throw dbError

      setStep(3) // Success state
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'An error occurred during verification.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secret)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        
        {/* Header */}
        <div className="border-b border-zinc-100 dark:border-zinc-800 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
              <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Secure Your Vault</h2>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                <p>1. Install an authenticator app (Google Authenticator, Authy, or Microsoft Authenticator).</p>
                <p className="mt-2">2. Scan this QR code or enter the secret key manually.</p>
              </div>

              <div className="flex justify-center bg-white p-4 rounded-xl border border-zinc-100">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="MFA QR Code" className="h-48 w-48" />
                ) : (
                  <div className="flex h-48 w-48 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Secret Key</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-lg bg-zinc-100 p-3 text-sm font-mono dark:bg-zinc-800 dark:text-zinc-300">
                    {secret}
                  </code>
                  <button 
                    onClick={copyToClipboard}
                    className="rounded-lg border border-zinc-200 p-3 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full rounded-xl bg-zinc-900 py-3 font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Continue to Verification
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Smartphone className="h-4 w-4" />
                <span>Enter the 6-digit code from your app</span>
              </div>

              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-center text-3xl font-bold tracking-[0.5em] focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border border-zinc-200 py-3 font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyAndEnable}
                  disabled={verificationCode.length !== 6 || loading}
                  className="flex-[2] rounded-xl bg-zinc-900 py-3 font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : 'Enable MFA'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/30">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">MFA Enabled!</h3>
              <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
                Your vault is now protected with two-factor authentication.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 3 && (
          <div className="bg-zinc-50 p-4 text-center dark:bg-zinc-800/50">
            <button 
              onClick={onClose}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              Cancel Setup
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
