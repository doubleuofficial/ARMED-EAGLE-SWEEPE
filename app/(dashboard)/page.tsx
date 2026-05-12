'use client'

import React, { useState, useEffect } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ShieldCheck,
  Zap,
  BarChart3,
  Calendar,
  ChevronRight,
  Plus,
  Target,
  Database,
  Lock,
  Gift
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { Tutorial } from '@/components/tutorial'
import { createClient } from '@/lib/supabase/client'

const data = [
  { name: '05/01', profit: 450 },
  { name: '05/02', profit: 320 },
  { name: '05/03', profit: 800 },
  { name: '05/04', profit: 650 },
  { name: '05/05', profit: 900 },
  { name: '05/06', profit: 1200 },
  { name: '05/07', profit: 1100 },
]

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const { user } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      checkUserOnboarding()
    }
  }, [user])

  const checkUserOnboarding = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('tutorial_completed')
        .eq('user_id', user.id)
        .single()

      if (error && error.code === 'PGRST116') {
        // No onboarding record exists, user is new
        setIsNewUser(true)
        setShowTutorial(true)
      } else if (data && !data.tutorial_completed) {
        // Tutorial not completed
        setShowTutorial(true)
      }
    } catch (err) {
      console.error('Error checking onboarding:', err)
    }
  }

  const handleTutorialComplete = () => {
    setShowTutorial(false)
    setIsNewUser(false)
  }

  return (
    <div className="space-y-6 pb-12 h-full">
      {/* Search Protocol Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="COMMAND: REGISTER NEW ASSET"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase text-tactical-muted tracking-widest pl-1">Platform Designation</label>
            <input 
              type="text" 
              className="w-full bg-black/40 border border-tactical-border p-3 font-mono text-xs text-white focus:outline-none focus:border-gold transition-colors"
              placeholder="E.G. CHUMBA_CASINO"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-tactical-muted tracking-widest pl-1">Initial Intel Balance</label>
              <input 
                type="text" 
                className="w-full bg-black/40 border border-tactical-border p-3 font-mono text-xs text-white focus:outline-none focus:border-gold transition-colors"
                placeholder="$0.00"
              />
            </div>
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-tactical-muted tracking-widest pl-1">Security Rating</label>
              <select className="w-full bg-black/40 border border-tactical-border p-3 font-mono text-xs text-white focus:outline-none focus:border-gold transition-colors appearance-none">
                <option>LEVEL_ALPHA</option>
                <option>LEVEL_BETA</option>
                <option>LEVEL_GAMMA</option>
              </select>
            </div>
          </div>
          <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-sm">
            <p className="text-[10px] font-mono text-yellow-500 italic">
               NOTE: All new entries are subjected to mandatory background encryption and audit logging.
            </p>
          </div>
        </div>
      </Modal>

      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter text-white uppercase italic">Sitrep: Alpha</h2>
          <p className="text-tactical-muted font-mono text-xs uppercase tracking-[0.2em] mt-1">
            Agent: {user?.email || 'UNKNOWN'} // Active Surveillance
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus size={14} /> New Asset
          </Button>
          <Button size="sm">Initiate Scan</Button>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-max">
        
        {/* Status Report (Large Analytics Card) */}
        <Card 
          className="lg:col-span-2 flex flex-col min-h-[400px] relative overflow-hidden group"
          title="Field Intelligence Report"
          icon={<BarChart3 size={14} />}
          headerAction={
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-green-500 uppercase font-mono">Real-time Node Active</span>
            </div>
          }
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-8xl rotate-12 select-none group-hover:rotate-6 transition-transform">INTEL</div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
             <div className="bg-black/30 p-4 border-b-2 border-gold rounded-sm">
                <p className="text-[10px] uppercase text-tactical-muted font-bold mb-1">Win/Loss Ratio</p>
                <p className="text-3xl font-black text-white">2.4<span className="text-xs text-tactical-muted font-normal ml-1">/NODE</span></p>
             </div>
             <div className="bg-black/30 p-4 border-b-2 border-green-500 rounded-sm">
                <p className="text-[10px] uppercase text-tactical-muted font-bold mb-1">Net Extraction</p>
                <p className="text-3xl font-black text-green-500">+$1,452</p>
             </div>
             <div className="bg-black/30 p-4 border-b-2 border-gold rounded-sm">
                <p className="text-[10px] uppercase text-tactical-muted font-bold mb-1">Extraction Level</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-2 bg-tactical-border/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gold w-[65%]" />
                  </div>
                  <span className="text-xs font-mono text-gold">65%</span>
                </div>
             </div>
          </div>

          <div className="flex-1 min-h-[200px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorProfitDashboard" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #2D2D2D', fontSize: '10px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#D4AF37" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorProfitDashboard)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Priority Objective (Daily Rewards) */}
        <Card 
          className="lg:col-span-1 border-gold/50 flex flex-col items-center justify-center text-center py-10 relative bg-gold/[0.03]"
          title="PRIORITY: SUPPLY DROP"
          icon={<Gift size={14} />}
        >
          <Target className="w-16 h-16 text-gold mb-6 opacity-80" />
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">Daily Supply Node</h3>
          <p className="text-[11px] text-tactical-muted mt-2 mb-8 max-w-[200px] uppercase leading-relaxed tracking-wide">
            Harvest <span className="text-gold font-bold">1.00 SC</span> from all active frontline outposts
          </p>
          <div className="bg-black/60 px-6 py-3 border-2 border-gold/30 rounded font-mono text-2xl text-gold mb-8 shadow-inner">
            14:22:08
          </div>
          <Button className="w-full py-4 text-sm group" onClick={() => window.location.href = '/rewards'}>
            Initialize Extraction <ChevronRight size={16} className="inline ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Card>

        {/* Account Vault (List View) */}
        <Card 
          className="lg:col-span-1 flex flex-col min-h-[350px]"
          title="Account Vault"
          icon={<Lock size={14} />}
          headerAction={<Button variant="ghost" size="sm" onClick={() => window.location.href = '/vault'}>Expand</Button>}
        >
          <div className="space-y-3 mt-2 flex-1">
            {[
              { name: 'STAKE.US', user: 'EAGLE_EYE_01', color: 'border-gold' },
              { name: 'WOW VEGAS', user: 'PATRIOT_GEM', color: 'border-gold/50' },
              { name: 'PULSZ', user: 'COMMANDER_X', color: 'border-gold/50' },
              { name: 'CHUMBA', user: 'AGENT_H', color: 'border-gold' },
            ].map((acc, i) => (
              <div key={i} className={cn("p-3 bg-black/20 rounded border-l-2 hover:bg-gold/5 transition-all cursor-pointer group", acc.color)}>
                 <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[11px] font-black text-white tracking-widest">{acc.name}</p>
                      <p className="text-[9px] text-tactical-muted font-mono italic mt-0.5">ID: {acc.user}</p>
                    </div>
                    <Lock size={12} className="text-tactical-muted group-hover:text-gold" />
                 </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Operations (Table View) */}
        <Card 
          className="lg:col-span-2"
          title="Active Field Operations"
          icon={<Database size={14} />}
        >
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase text-gold font-bold border-b border-tactical-border/50">
                  <th className="pb-3">Outpost</th>
                  <th className="pb-3 px-4">Intel (SC)</th>
                  <th className="pb-3">Objective</th>
                  <th className="pb-3 text-right">Protocol</th>
                </tr>
              </thead>
              <tbody className="text-[11px]">
                {[
                  { name: 'Stake.us', bal: '45.22', progress: '12% LEFT', status: 'DEPLOY', ready: false },
                  { name: 'Chumba Casino', bal: '108.00', progress: 'SECURED', status: 'REDEEM', ready: true },
                  { name: 'McLuck', bal: '14.50', progress: '85% LEFT', status: 'DEPLOY', ready: false },
                  { name: 'LuckyLand', bal: '32.10', progress: 'READY', status: 'REDEEM', ready: true },
                ].map((op, i) => (
                  <tr key={i} className="border-b border-tactical-border/30 hover:bg-white/[0.02] group">
                    <td className="py-3 font-bold text-white">{op.name}</td>
                    <td className="py-3 px-4 font-mono text-gold">{op.bal}</td>
                    <td className="py-3 font-mono">
                      <span className={op.ready ? "text-green-500" : "text-red-500"}>{op.progress}</span>
                    </td>
                    <td className="py-3 text-right">
                      <button className={cn(
                        "px-3 py-1 rounded text-[9px] font-bold uppercase tracking-widest border transition-all",
                        op.ready ? "bg-gold text-black border-gold" : "text-gold border-gold/50 hover:bg-gold/10"
                      )}>
                        {op.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

      </div>

      {/* Tutorial for new users */}
      {showTutorial && (
        <Tutorial onComplete={handleTutorialComplete} />
      )}
    </div>
  )
}
