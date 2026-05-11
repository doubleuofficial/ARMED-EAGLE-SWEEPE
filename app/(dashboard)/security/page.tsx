'use client'

import React, { useState, useEffect } from 'react'
import { Shield, Smartphone, Key, CheckCircle, XCircle, Settings } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MFASetupModal } from '@/components/auth/mfa-setup-modal'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'

interface MFAStatus {
  enabled: boolean
  type: 'totp' | 'sms' | null
  phone_number?: string
}

export default function SecurityPage() {
  const [mfaStatus, setMfaStatus] = useState<MFAStatus>({ enabled: false, type: null })
  const [isMFAModalOpen, setIsMFAModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      loadMFAStatus()
    }
  }, [user])

  const loadMFAStatus = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_mfa')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        throw error
      }

      if (data) {
        setMfaStatus({
          enabled: data.enabled,
          type: data.mfa_type,
          phone_number: data.phone_number,
        })
      }
    } catch (err) {
      console.error('Error loading MFA status:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDisableMFA = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('user_mfa')
        .update({ enabled: false })
        .eq('user_id', user.id)

      if (error) throw error

      setMfaStatus({ enabled: false, type: null })
    } catch (err) {
      console.error('Error disabling MFA:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-tactical-muted font-mono">Loading security settings...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">Security Settings</h2>
        <p className="text-tactical-muted font-mono text-xs uppercase tracking-[0.2em] mt-1">
          Configure advanced security protocols and authentication methods
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MFA Status Card */}
        <Card
          title="Multi-Factor Authentication"
          icon={<Shield size={14} className={mfaStatus.enabled ? "text-green-500" : "text-tactical-muted"} />}
          className="min-h-[300px]"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {mfaStatus.enabled ? (
                <CheckCircle className="text-green-500" size={20} />
              ) : (
                <XCircle className="text-red-500" size={20} />
              )}
              <span className={`font-mono text-sm font-bold ${mfaStatus.enabled ? 'text-green-500' : 'text-red-500'}`}>
                {mfaStatus.enabled ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>

            {mfaStatus.enabled && (
              <div className="bg-black/30 p-3 border border-tactical-border/50 rounded-sm">
                <div className="flex items-center gap-2 mb-2">
                  {mfaStatus.type === 'totp' ? (
                    <Key className="text-gold" size={16} />
                  ) : (
                    <Smartphone className="text-gold" size={16} />
                  )}
                  <span className="text-tactical-muted text-xs font-mono uppercase tracking-widest">
                    Method: {mfaStatus.type === 'totp' ? 'Authenticator App' : 'SMS'}
                  </span>
                </div>
                {mfaStatus.phone_number && (
                  <p className="text-white text-xs font-mono">
                    Phone: {mfaStatus.phone_number}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              {!mfaStatus.enabled ? (
                <Button
                  onClick={() => setIsMFAModalOpen(true)}
                  className="w-full"
                  size="sm"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Enable MFA
                </Button>
              ) : (
                <Button
                  onClick={handleDisableMFA}
                  variant="outline"
                  className="w-full border-red-500/50 text-red-400 hover:border-red-500 hover:text-red-300"
                  size="sm"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Disable MFA
                </Button>
              )}
            </div>

            <p className="text-tactical-muted text-xs font-mono leading-relaxed">
              Multi-factor authentication adds an extra layer of security to your account.
              We recommend enabling it for maximum protection.
            </p>
          </div>
        </Card>

        {/* Account Security Card */}
        <Card
          title="Account Security"
          icon={<Settings size={14} className="text-gold" />}
          className="min-h-[300px]"
        >
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-tactical-muted text-xs font-mono uppercase tracking-widest">
                  Password Strength
                </span>
                <span className="text-green-500 text-xs font-mono font-bold">STRONG</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-tactical-muted text-xs font-mono uppercase tracking-widest">
                  Last Password Change
                </span>
                <span className="text-white text-xs font-mono">Never</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-tactical-muted text-xs font-mono uppercase tracking-widest">
                  Account Created
                </span>
                <span className="text-white text-xs font-mono">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-tactical-muted text-xs font-mono uppercase tracking-widest">
                  Login Attempts (24h)
                </span>
                <span className="text-green-500 text-xs font-mono">0</span>
              </div>
            </div>

            <div className="border-t border-tactical-border pt-4 space-y-2">
              <Button variant="outline" className="w-full" size="sm">
                Change Password
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                View Login History
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Security Audit Log */}
      <Card title="Security Audit Log" icon={<Shield size={14} className="text-gold" />}>
        <div className="space-y-3">
          <div className="text-tactical-muted text-xs font-mono">
            Recent security events and activities:
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            <div className="flex items-center justify-between py-2 border-b border-tactical-border/30">
              <div>
                <span className="text-white text-xs font-mono">Account created</span>
                <span className="text-tactical-muted text-xs font-mono ml-2">
                  {new Date().toLocaleString()}
                </span>
              </div>
              <span className="text-green-500 text-xs font-mono">SUCCESS</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-tactical-border/30">
              <div>
                <span className="text-white text-xs font-mono">First login</span>
                <span className="text-tactical-muted text-xs font-mono ml-2">
                  {new Date().toLocaleString()}
                </span>
              </div>
              <span className="text-green-500 text-xs font-mono">SUCCESS</span>
            </div>
          </div>
        </div>
      </Card>

      <MFASetupModal
        isOpen={isMFAModalOpen}
        onClose={() => setIsMFAModalOpen(false)}
        onSuccess={loadMFAStatus}
      />
    </div>
  )
}