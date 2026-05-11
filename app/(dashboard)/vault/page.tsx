'use client'

import React, { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff, Search, Plus, ExternalLink, Shield, Key, Terminal, Fingerprint } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import { NewEntryModal } from '@/components/vault/new-entry-modal'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { decryptPassword } from '@/lib/encryption'

interface VaultEntry {
  id: string
  platform: string
  username: string
  encrypted_password: string
  created_at: string
}

export default function VaultPage() {
  const [entries, setEntries] = useState<VaultEntry[]>([])
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      loadEntries()
    }
  }, [user])

  const loadEntries = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('vault_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEntries(data || [])
    } catch (err) {
      console.error('Error loading entries:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleVisibility = async (entryId: string) => {
    const isVisible = visiblePasswords[entryId]

    if (!isVisible) {
      // Log audit trail for viewing password
      await supabase
        .from('audit_logs')
        .insert({
          user_id: user?.id,
          action: 'view_password',
          details: `Viewed password for entry ${entryId}`,
          timestamp: new Date().toISOString(),
        })
    }

    setVisiblePasswords(prev => ({ ...prev, [entryId]: !prev[isVisible ? entryId : entryId] }))
  }

  const getDecryptedPassword = (entry: VaultEntry) => {
    try {
      return decryptPassword(entry.encrypted_password)
    } catch (err) {
      console.error('Error decrypting password:', err)
      return 'DECRYPTION FAILED'
    }
  }

  const filteredEntries = entries.filter(entry =>
    entry.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-tactical-muted font-mono">Loading vault...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">The Vault</h2>
          <p className="text-tactical-muted font-mono text-xs uppercase tracking-[0.2em] mt-1">Status: Encrypted | Protocol: Zero-Knowledge</p>
        </div>
        <div className="flex flex-1 md:max-w-md relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-tactical-muted group-focus-within:text-gold transition-colors" size={16} />
          <input
            type="text"
            placeholder="SEARCH CRYPTOGRAPHIC ASSETS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border-2 border-tactical-border pl-12 pr-4 py-4 font-mono text-xs text-white focus:outline-none focus:border-gold transition-all rounded-sm tracking-widest placeholder:opacity-50"
          />
        </div>
        <Button
          className="h-14 px-8 shadow-[0_0_20px_rgba(212,175,55,0.2)] font-black uppercase italic tracking-tighter shrink-0"
          onClick={() => setIsNewEntryModalOpen(true)}
        >
          <Plus size={18} className="mr-2" /> NEW ENTRY
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredEntries.map((entry, i) => (
            <motion.div
              key={entry.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card
                className="group relative overflow-hidden flex flex-col min-h-[280px]"
                headerAction={
                  <div className="w-8 h-8 rounded-full border grid place-items-center bg-black/40 border-green-500 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                    <Shield size={14} className="animate-pulse" />
                  </div>
                }
              >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-2 h-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex-1 flex flex-col">
                  <div>
                    <div className="text-[9px] font-mono text-gold uppercase font-bold tracking-[0.3em] mb-1 italic opacity-70">
                      // ENCRYPTED ASSET
                    </div>
                    <div className="text-2xl font-black text-white tracking-tighter uppercase italic flex items-center justify-between">
                      {entry.platform}
                      <ExternalLink size={14} className="text-tactical-muted hover:text-gold cursor-pointer transition-colors" />
                    </div>
                  </div>

                  <div className="mt-8 space-y-6 flex-1">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] font-mono text-tactical-muted uppercase font-bold tracking-widest pl-1">Agent Identification</span>
                      <div className="bg-black/30 p-3 border border-tactical-border/50 rounded-sm flex items-center justify-between">
                        <span className="font-mono text-xs text-white">{entry.username}</span>
                        <Fingerprint size={12} className="text-tactical-muted" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] font-mono text-tactical-muted uppercase font-bold tracking-widest pl-1">Access Protocol</span>
                      <div className="bg-black/30 p-3 border border-tactical-border/50 rounded-sm flex items-center justify-between group/pass">
                        <span className={cn(
                          "font-mono text-xs transition-all duration-300",
                          visiblePasswords[entry.id] ? "text-gold" : "text-white/40 tracking-[0.4em]"
                        )}>
                          {visiblePasswords[entry.id] ? getDecryptedPassword(entry) : '••••••••••••'}
                        </span>
                        <button
                          onClick={() => toggleVisibility(entry.id)}
                          className="text-tactical-muted hover:text-gold transition-colors"
                        >
                          {visiblePasswords[entry.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="outline" className="h-10 text-[9px] font-black uppercase tracking-widest bg-white/[0.02]">
                       Modify
                    </Button>
                    <Button variant="outline" className="h-10 text-[9px] font-black uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-colors">
                       Purge
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State / Add Card */}
        <motion.button
          layout
          onClick={() => setIsNewEntryModalOpen(true)}
          className="tactical-grid flex flex-col items-center justify-center p-8 border-dashed border-4 border-tactical-muted/30 hover:border-gold/50 transition-all group bg-gold/[0.01] hover:bg-gold/[0.03] min-h-[280px]"
        >
          <div className="w-16 h-16 rounded-full border-4 border-tactical-muted/30 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/10 transition-all mb-6">
            <Plus size={32} className="text-tactical-muted group-hover:text-gold group-hover:rotate-90 transition-all duration-500" />
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] font-black italic text-tactical-muted group-hover:text-white transition-colors">
            DEPLOY NEW INTELLIGENCE ASSET
          </span>
          <p className="text-[9px] font-mono text-tactical-muted mt-3 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Secure Entry Protocol Required
          </p>
        </motion.button>
      </div>

      {/* Security Advisory */}
      <Card className="bg-red-500/5 border-red-500/20" title="Security Advisory" icon={<Terminal size={14} className="text-red-500" />}>
        <div className="flex items-start gap-4">
          <Key className="text-red-500 shrink-0 mt-1" size={20} />
           <p className="text-[10px] font-mono text-red-100/70 leading-relaxed uppercase tracking-widest">
             <span className="text-red-500 font-black">Warning:</span> All credentials stored in the vault are encrypted using military-grade AES-256 protocols. Manual decryption logs are audited in real-time. Unauthorized attempts to bypass bio-authentication will result in immediate terminal lockout.
           </p>
        </div>
      </Card>

      <NewEntryModal
        isOpen={isNewEntryModalOpen}
        onClose={() => setIsNewEntryModalOpen(false)}
        onSuccess={loadEntries}
      />
    </div>
  )
}
