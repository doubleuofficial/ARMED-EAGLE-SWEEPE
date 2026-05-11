'use client'

import React, { useState } from 'react'
import { Lock, Eye, EyeOff, Search, Plus, ExternalLink, Shield } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'motion/react'

const initialAccounts = [
  { id: 1, platform: 'Chumba Casino', username: 'hartman_agent01', password: 'password123', security: 'High' },
  { id: 2, platform: 'Luckyland Slots', username: 'eagle_eye_2024', password: 'secure_pass_456', security: 'Medium' },
  { id: 3, platform: 'Stake.us', username: 'crypto_eagle', password: 'stake_master_99', security: 'High' },
]

export default function VaultPage() {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({})

  const toggleVisibility = (id: number) => {
    setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter text-white uppercase">The Vault</h2>
          <p className="text-tactical-muted font-mono text-xs uppercase tracking-[0.2em] mt-1">Status: Encrypted | Protocol: Zero-Knowledge</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          New Asset
        </Button>
      </div>

      {/* Control Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tactical-muted" size={16} />
          <input 
            type="text" 
            placeholder="FILTER ASSETS..." 
            className="w-full bg-tactical-card border border-tactical-border pl-10 pr-4 py-2 font-mono text-xs text-white focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <Button variant="outline" size="sm">Audit Logs</Button>
      </div>

      {/* Vault Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {accounts.map((account, i) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card 
                className="group border-tactical-border/50 hover:border-gold/50"
                headerAction={
                  <div className={account.security === 'High' ? "text-green-500" : "text-yellow-500"}>
                    <Shield size={16} />
                  </div>
                }
              >
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] font-mono text-tactical-muted uppercase tracking-widest mb-1 italic">Platform Alpha</div>
                    <div className="text-lg font-bold text-white tracking-tight flex items-center justify-between">
                      {account.platform}
                      <ExternalLink size={14} className="text-tactical-muted group-hover:text-gold cursor-pointer" />
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-tactical-border/50">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-tactical-muted uppercase">Username</span>
                      <span className="font-mono text-xs text-white decoration-gold underline-offset-4 decoration-1 underline">{account.username}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-tactical-muted uppercase">Access Code</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-gold">
                          {visiblePasswords[account.id] ? account.password : '••••••••••••'}
                        </span>
                        <button 
                          onClick={() => toggleVisibility(account.id)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          {visiblePasswords[account.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <Button variant="ghost" className="flex-1 py-2 h-auto text-[10px]">Edit</Button>
                    <Button variant="ghost" className="flex-1 py-2 h-auto text-[10px] hover:text-red-500">Purge</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State / Add Card */}
        <button className="tactical-grid flex flex-col items-center justify-center p-8 border-dashed border-2 hover:border-gold/50 transition-all group bg-white/[0.02]">
          <div className="w-12 h-12 rounded-full border border-tactical-border flex items-center justify-center group-hover:border-gold group-hover:bg-gold/10 transition-all mb-4">
            <Plus className="text-tactical-muted group-hover:text-gold" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-tactical-muted group-hover:text-white">Register New Intelligence Asset</span>
        </button>
      </div>
    </div>
  )
}
