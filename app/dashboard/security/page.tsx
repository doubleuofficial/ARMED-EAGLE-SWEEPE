'use client'

import React, { useState, useEffect } from 'react'
import { Shield, Smartphone, Key, CheckCircle, XCircle, Settings, AlertTriangle, Clock, Eye, Lock, Bell, Database } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MFASetupModal } from '@/components/auth/mfa-setup-modal'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'motion/react'

interface MFAStatus {
  enabled: boolean
  type: 'totp' | 'sms' | null
  phone_number?: string
}

interface SecurityAlert {
  id: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  created_at: string
  resolved: boolean
}

interface AuditLog {
  id: string
  action: string
  details: string
  timestamp: string
  ip_address?: string
}

export default function SecurityPage() {
  const [mfaStatus, setMfaStatus] = useState<MFAStatus>({ enabled: false, type: null })
  const [isMFAModalOpen, setIsMFAModalOpen] = useState(false)
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [preferences, setPreferences] = useState({
    autoLockVault: true,
    autoLockTimeout: 30,
    notificationsEnabled: true,
    auditLogRetention: 90
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  const handleUpdatePreferences = async (updates: Partial<typeof preferences>) => {
    const updatedPreferences = {
      ...preferences,
      ...updates,
    }

    setPreferences(updatedPreferences)

    if (!user) return

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert(
          {
            user_id: user.id,
            auto_lock_vault: updatedPreferences.autoLockVault,
            auto_lock_timeout: updatedPreferences.autoLockTimeout,
            notifications_enabled: updatedPreferences.notificationsEnabled,
            audit_log_retention: updatedPreferences.auditLogRetention,
            updated_at: new Date().toISOString(),
          },
          { onConflict: ['user_id'] }
        )

      if (error) throw error
    } catch (err) {
      console.error('Error updating preferences:', err)
    }
  }

  const resolveAlert = async (alertId: string) => {
    setSecurityAlerts((current) =>
      current.map((alert) =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    )

    if (!user) return

    try {
      const { error } = await supabase
        .from('security_alerts')
        .update({ resolved: true })
        .eq('id', alertId)
        .eq('user_id', user.id)

      if (error) throw error
    } catch (err) {
      console.error('Error resolving alert:', err)
    }
  }

  useEffect(() => {
    if (user) {
      loadSecurityData()
    }
  }, [user])

  const loadSecurityData = async () => {
    if (!user) return

    try {
      // Load MFA status
      const { data: mfaData } = await supabase
        .from('user_mfa')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (mfaData) {
        setMfaStatus({
          enabled: mfaData.enabled,
          type: mfaData.mfa_type,
          phone_number: mfaData.phone_number,
        })
      }

      // Load security alerts
      const { data: alertsData } = await supabase
        .from('security_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setSecurityAlerts(alertsData || [])

      // Load audit logs
      const { data: logsData } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(20)

      setAuditLogs(logsData || [])

      // Load user preferences
      const { data: prefsData } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (prefsData) {
        setPreferences({
          autoLockVault: prefsData.auto_lock_vault,
          autoLockTimeout: prefsData.auto_lock_timeout,
          notificationsEnabled: prefsData.notifications_enabled,
          auditLogRetention: prefsData.audit_log_retention
        })
      }
    } catch (err) {
      console.error('Error loading security data:', err)
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
        <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">Security Command Center</h2>
        <p className="text-tactical-muted font-mono text-xs uppercase tracking-[0.2em] mt-1">
          Advanced Security Protocols // Threat Detection & Response
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
          </div>
        </Card>

        {/* Security Preferences */}
        <Card
          title="Security Preferences"
          icon={<Settings size={14} />}
          className="min-h-[300px]"
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-tactical-muted" />
                  <span className="text-sm text-white">Auto-lock Vault</span>
                </div>
                <button
                  onClick={() => handleUpdatePreferences({ autoLockVault: !preferences.autoLockVault })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    preferences.autoLockVault ? 'bg-gold' : 'bg-tactical-border'
                  }`}
                >
                  <div className={`w-5 h-5 bg-black rounded-full transition-transform ${
                    preferences.autoLockVault ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {preferences.autoLockVault && (
                <div className="ml-6">
                  <label className="text-xs text-tactical-muted font-mono">Timeout (minutes):</label>
                  <select
                    value={preferences.autoLockTimeout}
                    onChange={(e) => handleUpdatePreferences({ autoLockTimeout: parseInt(e.target.value) })}
                    className="mt-1 w-full bg-black/40 border border-tactical-border px-2 py-1 text-xs font-mono text-white focus:outline-none focus:border-gold"
                  >
                    <option value={5}>5 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-tactical-muted" />
                <span className="text-sm text-white">Security Notifications</span>
              </div>
              <button
                onClick={() => handleUpdatePreferences({ notificationsEnabled: !preferences.notificationsEnabled })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  preferences.notificationsEnabled ? 'bg-gold' : 'bg-tactical-border'
                }`}
              >
                <div className={`w-5 h-5 bg-black rounded-full transition-transform ${
                  preferences.notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-tactical-muted font-mono">Audit Log Retention (days):</label>
              <select
                value={preferences.auditLogRetention}
                onChange={(e) => handleUpdatePreferences({ auditLogRetention: parseInt(e.target.value) })}
                className="w-full bg-black/40 border border-tactical-border px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-gold"
              >
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
                <option value={180}>180 days</option>
                <option value={365}>1 year</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Security Alerts */}
        <Card
          title="Security Alerts"
          icon={<AlertTriangle size={14} />}
          className="min-h-[400px]"
        >
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {securityAlerts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="text-tactical-muted text-sm">No security alerts</p>
              </div>
            ) : (
              securityAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 border rounded-sm ${
                    alert.resolved
                      ? 'border-green-500/20 bg-green-500/5'
                      : alert.severity === 'critical'
                      ? 'border-red-500/50 bg-red-500/10'
                      : alert.severity === 'high'
                      ? 'border-orange-500/50 bg-orange-500/10'
                      : 'border-yellow-500/50 bg-yellow-500/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={14} className={
                          alert.severity === 'critical' ? 'text-red-500' :
                          alert.severity === 'high' ? 'text-orange-500' :
                          'text-yellow-500'
                        } />
                        <span className="text-xs font-mono uppercase tracking-widest text-tactical-muted">
                          {alert.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-white mb-1">{alert.message}</p>
                      <p className="text-xs text-tactical-muted font-mono">
                        {new Date(alert.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!alert.resolved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resolveAlert(alert.id)}
                        className="text-xs"
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Card>

        {/* Audit Logs */}
        <Card
          title="Audit Logs"
          icon={<Database size={14} />}
          className="min-h-[400px]"
        >
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {auditLogs.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-tactical-muted mx-auto mb-4" />
                <p className="text-tactical-muted text-sm">No audit logs yet</p>
              </div>
            ) : (
              auditLogs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-black/20 border border-tactical-border/50 rounded-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-widest text-gold">
                      {log.action.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-tactical-muted font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {log.details && (
                    <p className="text-sm text-tactical-muted mb-1">{log.details}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <Eye size={12} className="text-tactical-muted" />
                    <span className="text-xs text-tactical-muted font-mono">
                      Session logged
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </div>

      <MFASetupModal
        isOpen={isMFAModalOpen}
        onClose={() => setIsMFAModalOpen(false)}
        userEmail={user?.email || ''}
        onSuccess={() => {
          setIsMFAModalOpen(false)
          loadSecurityData()
        }}
      />
    </div>
  )
}