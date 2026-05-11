'use client'

import React, { useState } from 'react'
import { Lock, Eye, EyeOff, Search, Plus, ExternalLink, Shield, Key, Terminal, Fingerprint } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

const initialAccounts = [
  { id: 1, platform: 'Chumba Casino', username: 'hartman_agent01', password: 'password123', security: 'High', type: 'GOVERNMENT' },
  { id: 2, platform: 'Luckyland Slots', username: 'eagle_eye_2024', password: 'secure_pass_456', security: 'Medium', type: 'PRIVATE' },
  { id: 3, platform: 'Stake.us', username: 'crypto_eagle', password: 'stake_master_99', security: 'High', type: 'ENCRYPTED' },
  { id: 4, platform: 'Pulsz', username: 'pulsz_user_x', password: 'pulsz_pass_123', security: 'Medium', type: 'PRIVATE' },
]

export default function VaultPage() {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({})
  const [searchQuery, setSearchQuery] = useState('')

  const toggleVisibility = (id: number) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredAccounts = accounts.filter(acc => 
    acc.platform.toLowerCase().includes(searchQuery.toLowerCase()) || 
    acc.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        <Button className="h-14 px-8 shadow-[0_0_20px_rgba(212,175,55,0.2)] font-black uppercase italic tracking-tighter shrink-0">
          <Plus size={18} className="mr-2" /> NEW ENTRY
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredAccounts.map((account, i) => (
            <motion.div
              key={account.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card 
                className="group relative overflow-hidden flex flex-col min-h-[280px]"
                headerAction={
                  <div className={cn(
                    "w-8 h-8 rounded-full border grid place-items-center bg-black/40",
                    account.security === 'High' ? "border-green-500 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]" : "border-yellow-500 text-yellow-500"
                  )}>
                    <Shield size={14} className={account.security === 'High' ? "animate-pulse" : ""} />
                  </div>
                }
              >
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-2 h-full bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex-1 flex flex-col">
                  <div>
                    <div className="text-[9px] font-mono text-gold uppercase font-bold tracking-[0.3em] mb-1 italic opacity-70">
                      // {account.type} ASSET
                    </div>
                    <div className="text-2xl font-black text-white tracking-tighter uppercase italic flex items-center justify-between">
                      {account.platform}
                      <ExternalLink size={14} className="text-tactical-muted hover:text-gold cursor-pointer transition-colors" />
                    </div>
                  </div>

                  <div className="mt-8 space-y-6 flex-1">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] font-mono text-tactical-muted uppercase font-bold tracking-widest pl-1">Agent Identification</span>
                      <div className="bg-black/30 p-3 border border-tactical-border/50 rounded-sm flex items-center justify-between">
                        <span className="font-mono text-xs text-white">{account.username}</span>
                        <Fingerprint size={12} className="text-tactical-muted" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] font-mono text-tactical-muted uppercase font-bold tracking-widest pl-1">Access Protocol</span>
                      <div className="bg-black/30 p-3 border border-tactical-border/50 rounded-sm flex items-center justify-between group/pass">
                        <span className={cn(
                          "font-mono text-xs transition-all duration-300",
                          visiblePasswords[account.id] ? "text-gold" : "text-white/40 tracking-[0.4em]"
                        )}>
                          {visiblePasswords[account.id] ? account.password : '••••••••••••'}
                        </span>
                        <button 
                          onClick={() => toggleVisibility(account.id)}
                          className="text-tactical-muted hover:text-gold transition-colors"
                        >
                          {visiblePasswords[account.id] ? <EyeOff size={14} /> : <Eye size={14} />}
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
    </div>
  )
}
