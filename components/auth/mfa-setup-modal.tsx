'use client'

import React, { useState, useEffect } from 'react'
// In v13, everything is bundled in the main 'otplib' package
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
import { createBrowserClient } from '@supabase/ssr'

interface MFASetupModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
  onSuccess: () => void
}

export default function MFASetupModal({ isOpen, onClose, userEmail, onSuccess }: MFASetupModalProps) {
  // Initialize the modern SSR browser client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [step, setStep] = useState(1)
  const [secret, setSecret] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Generate secret and QR code on mount/open
  useEffect(() => {
    if (isOpen && step === 1) {
      generateSetupData()
    }
  }, [isOpen])

  const generateSetupData = async () => {
    try {
      // Step 1: Generate a unique secret
      const newSecret = authenticator.generateSecret()
      setSecret(newSecret)

      // Step 2: Create the URI for the QR Code
      const otpauth = authenticator.keyuri(
        userEmail,
        'Armed Eagle Vault', // App Name
        newSecret
      )

      // Step 3: Generate QR locally (No external APIs for security)
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
      setError('Failed to initialize MFA. Please refresh.')
    }
  }

  const handleVerifyAndEnable = async () => {
    setLoading(true)
    setError('')

    try {
      // Validate the code using v13 verify method
      const isValid = authenticator.verify({ 
        token: verificationCode, 
        secret: secret 
      })

      if (!isValid) {
        setError('Invalid code. Please check your authenticator app.')
        setLoading(false)
        return
      }

      // Save the secret to the database
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User session not found.')

      const { error: dbError } = await supabase
        .from('user_mfa')
        .upsert({
          user_id: user.id,
          mfa_type: 'totp',
          totp_secret: secret,
          enabled: true,
          updated_at: new Date().toISOString()
        })

      if (dbError) throw dbError

      setStep(3) // Success state
      setTimeout(() => {
        onSuccess()
        onClose()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Verification failed.')
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
        
        {/* Modal Header */}
        <div className="border-b border-zinc-100 dark:border-zinc-900 p-6 bg-zinc-50/50 dark:bg-zinc-900/30">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-cyan-500/10 p-2 border border-cyan-500/20">
              <ShieldCheck className="h-6 w-6 text-cyan-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Enable Vault Security</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Two-Factor Authentication (TOTP)</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
                <p>1. Open Google Authenticator or Authy.</p>
                <p>2. Scan the code below or enter the manual key.</p>
              </div>

              <div className="flex justify-center bg-white p-4 rounded-xl border border-zinc-100 shadow-inner">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="MFA QR Code" className="h-48 w-48" />
                ) : (
                  <div className="flex h-48 w-48 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Manual Entry Key</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded-lg bg-zinc-100 p-3 text-xs font-mono dark:bg-zinc-900 dark:text-cyan-400 border border-zinc-200 dark:border-zinc-800">
                    {secret}
                  </code>
                  <button 
                    onClick={copyToClipboard}
                    className="rounded-lg border border-zinc-200 p-3 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900 transition-colors"
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full rounded-xl bg-zinc-900 py-3.5 font-bold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Next Step
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Smartphone className="h-4 w-4" />
                <span>Enter the 6-digit verification code</span>
              </div>

              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                autoFocus
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="w-full rounded-xl border-2 border-zinc-200 bg-zinc-50 p-4 text-center text-3xl font-bold tracking-[0.5em] focus:border-cyan-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
              />

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border border-zinc-200 py-3 font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyAndEnable}
                  disabled={verificationCode.length !== 6 || loading}
                  className="flex-[2] rounded-xl bg-zinc-900 py-3 font-bold text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : 'Confirm & Enable'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center space-y-4 py-10 animate-in fade-in zoom-in duration-300">
              <div className="rounded-full bg-green-500/10 p-5 border border-green-500/20">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Security Enabled</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Your vault is now secure. Redirecting...
                </p>
              </div>
            </div>
          )}
        </div>

        {step !== 3 && (
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 text-center border-t border-zinc-100 dark:border-zinc-900">
            <button 
              onClick={onClose}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              Cancel setup
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
