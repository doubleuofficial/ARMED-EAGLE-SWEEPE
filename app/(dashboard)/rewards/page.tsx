'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Gift, Timer, CheckCircle, ChevronRight, Zap, Trophy, Shield } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

const sweepstakes = [
  { id: 1, name: 'Stake.us', amount: '1.00 SC', frequency: '24h', lastClaimed: '22h ago', status: 'ready' },
  { id: 2, name: 'Chumba Casino', amount: '1.00 SC', frequency: '24h', lastClaimed: '2h ago', status: 'waiting' },
  { id: 3, name: 'Luckyland Slots', amount: '0.50 SC', frequency: '24h', lastClaimed: '4h ago', status: 'waiting' },
  { id: 4, name: 'Pulsz', amount: '1.00 SC', frequency: '24h', lastClaimed: '23h ago', status: 'ready' },
  { id: 5, name: 'WOW Vegas', amount: '0.30 SC', frequency: '24h', lastClaimed: '1d ago', status: 'ready' },
  { id: 6, name: 'Fortune Coins', amount: '100 FC', frequency: '24h', lastClaimed: '10h ago', status: 'waiting' },
]

export default function RewardsPage() {
  const [timeLeft, setTimeLeft] = useState('02:14:55')

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">Supply Drop Protocol</h2>
          <p className="text-tactical-muted font-mono text-xs uppercase tracking-[0.2em] mt-1">Status: Active Extraction // Priority High</p>
        </div>
        <div className="bg-tactical-card border-2 border-gold/50 p-4 rounded flex items-center gap-6 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
           <div className="flex flex-col">
              <span className="text-[9px] font-mono text-gold uppercase font-bold tracking-widest">Next Major Drop</span>
              <span className="text-2xl font-black text-white font-mono">{timeLeft}</span>
           </div>
           <Button className="h-full py-4 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
             <Zap size={14} className="mr-2" /> CLAIM ALL
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sweepstakes.map((site, i) => (
          <motion.div
            key={site.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card 
              className={cn(
                "group relative overflow-hidden transition-all duration-500",
                site.status === 'ready' 
                  ? "border-gold bg-gold/[0.03] shadow-[0_0_30px_rgba(212,175,55,0.05)]" 
                  : "border-tactical-border opacity-70"
              )}
            >
              {/* Status Badge */}
              <div className={cn(
                "absolute top-0 right-0 px-4 py-1 text-[9px] font-black uppercase tracking-widest rounded-bl-sm z-10",
                site.status === 'ready' ? "bg-gold text-black" : "bg-tactical-border text-tactical-muted"
              )}>
                {site.status === 'ready' ? 'Deploy Ready' : 'In Transit'}
              </div>

              <div className="flex items-start justify-between mb-6">
                 <div className="w-12 h-12 rounded-sm bg-black/40 border border-tactical-border grid place-items-center relative group-hover:border-gold transition-colors">
                    <Gift size={20} className={cn(site.status === 'ready' ? "text-gold" : "text-tactical-muted")} />
                    {site.status === 'ready' && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping" />}
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-mono text-tactical-muted uppercase tracking-widest">Amount</p>
                    <p className="text-xl font-black text-white">{site.amount}</p>
                 </div>
              </div>

              <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-4">{site.name}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[10px] uppercase font-mono tracking-widest text-tactical-muted">
                  <span>Last Extraction</span>
                  <span className="text-white">{site.lastClaimed}</span>
                </div>
                <div className="h-1 bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full transition-all duration-1000", site.status === 'ready' ? "bg-gold w-full" : "bg-tactical-border w-2/3")} 
                  />
                </div>
              </div>

              <Button 
                variant={site.status === 'ready' ? 'primary' : 'outline'} 
                className="w-full h-12 font-black italic tracking-tighter uppercase text-xs"
                disabled={site.status !== 'ready'}
              >
                {site.status === 'ready' ? 'Initialize Extraction' : 'Awaiting Window'}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Rewards Log */}
      <Card title="Historical Field Logs" icon={<Trophy size={14} />}>
         <div className="space-y-3">
            {[
              { site: 'Stake.us', date: '2024-05-10', val: '+1.00 SC', status: 'SECURED' },
              { site: 'Chumba', date: '2024-05-10', val: '+1.00 SC', status: 'SECURED' },
              { site: 'Luckyland', date: '2024-05-10', val: '+0.50 SC', status: 'SECURED' },
              { site: 'WOW Vegas', date: '2024-05-09', val: '+0.30 SC', status: 'SECURED' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-black/20 rounded border border-tactical-border/30 hover:border-gold/30 transition-all">
                <div className="flex items-center gap-4">
                  <Shield size={16} className="text-gold" />
                  <div>
                    <p className="text-[11px] font-black text-white tracking-widest">{log.site}</p>
                    <p className="text-[9px] text-tactical-muted font-mono italic mt-0.5">{log.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-green-500 font-mono">{log.val}</p>
                  <p className="text-[8px] text-tactical-muted uppercase tracking-[0.3em]">{log.status}</p>
                </div>
              </div>
            ))}
         </div>
      </Card>
    </div>
  )
}
