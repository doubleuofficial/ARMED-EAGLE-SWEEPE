'use client'

import React, { useState, useEffect } from 'react'
import { Gift, Timer, Zap, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

const initialRewards = [
  { id: 1, name: 'DAILY RATIONS', platform: 'Stake.us', status: 'Available', amount: '$1.00 SC' },
  { id: 2, name: 'SUPPLY DROP', platform: 'Luckyland', status: 'Claimed', amount: '$0.30 SC' },
  { id: 3, name: 'INTEL BONUS', platform: 'Chumba', status: 'Available', amount: '$1.00 SC' },
  { id: 4, name: 'FIELD CREDIT', platform: 'Pulsz', status: 'Locked', amount: '$0.50 SC', timer: 3600 * 4 },
  { id: 5, name: 'AMMO REFILL', platform: 'Fortune Coins', status: 'Claimed', amount: '100 FC' },
]

export default function RewardsPage() {
  const [rewards] = useState(initialRewards)
  const [timeLeft, setTimeLeft] = useState(3600 * 14 + 120) // 14h 2m example

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter text-white uppercase italic">Supply Chain</h2>
          <p className="text-tactical-muted font-mono text-xs uppercase tracking-[0.2em] mt-1">Objective: Harvest Daily Rations | Efficiency: 88%</p>
        </div>
        <div className="top-secret-border bg-gold/10 flex items-center gap-4 px-8 py-3">
          <div className="text-right">
            <div className="text-[8px] font-mono text-gold uppercase opacity-60">Global Reset In</div>
            <div className="text-xl font-mono text-gold font-bold">{formatTime(timeLeft)}</div>
          </div>
          <Timer className="text-gold" size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="tactical-header">Active Supply Line</div>
          {rewards.map((reward, i) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className={cn(
                "tactical-grid flex items-center justify-between p-4 group cursor-pointer border-l-4",
                reward.status === 'Available' ? "border-l-gold" : 
                reward.status === 'Claimed' ? "border-l-green-500 opacity-60" : "border-l-red-500"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-sm rotate-45 border",
                    reward.status === 'Available' ? "border-gold text-gold" : "border-tactical-border text-tactical-muted"
                  )}>
                    <Gift size={18} className="-rotate-45" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wider font-mono uppercase">{reward.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-tactical-muted font-mono uppercase">{reward.platform}</span>
                      <span className="w-1 h-1 bg-tactical-border rounded-full" />
                      <span className="text-[10px] text-gold font-mono">{reward.amount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {reward.timer && (
                    <div className="flex items-center gap-2 text-red-500 font-mono text-xs">
                      <Timer size={12} />
                      {formatTime(reward.timer)}
                    </div>
                  )}
                  {reward.status === 'Available' ? (
                    <Button size="sm" className="bg-gold text-black hover:bg-gold-hover font-bold px-4 py-2">
                       Harvest
                    </Button>
                  ) : reward.status === 'Claimed' ? (
                    <div className="flex items-center gap-2 text-green-500 font-mono text-[10px] uppercase">
                       <CheckCircle2 size={14} /> Secured
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-tactical-muted font-mono text-[10px] uppercase">
                       Pending
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
          <Card title="Extraction Statistics" icon={<Zap size={14} />}>
            <div className="space-y-6 py-2">
              <div>
                <div className="flex justify-between text-[10px] font-mono text-tactical-muted uppercase mb-2">
                  <span>Weekly Harvest Rate</span>
                  <span>72%</span>
                </div>
                <div className="h-1 bg-tactical-border rounded-full overflow-hidden">
                  <div className="h-full bg-gold w-[72%]" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-black/40 border border-tactical-border">
                  <div className="text-[8px] font-mono text-tactical-muted uppercase mb-1">Weekly Profit</div>
                  <div className="tactical-value text-lg">+$74.50</div>
                </div>
                <div className="p-3 bg-black/40 border border-tactical-border">
                  <div className="text-[8px] font-mono text-tactical-muted uppercase mb-1">Loyalty Rank</div>
                  <div className="tactical-value text-lg">SERGEANT</div>
                </div>
              </div>

              <div className="p-4 top-secret-border bg-gold/5 mt-4">
                <p className="text-[10px] font-mono text-gold italic leading-relaxed">
                  "Continuous harvesting ensures optimal supply line stability. Do not miss a ration drop."
                </p>
                <div className="text-right text-[8px] font-mono text-gold/60 mt-2">— COMMAND</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
