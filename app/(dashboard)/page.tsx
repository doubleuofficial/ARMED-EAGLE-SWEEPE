'use client'

import React, { useState } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ShieldCheck, 
  Zap,
  BarChart3,
  Calendar,
  ChevronRight,
  Plus
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

const data = [
  { name: '05/01', profit: 450 },
  { name: '05/02', profit: 320 },
  { name: '05/03', profit: 800 },
  { name: '05/04', profit: 650 },
  { name: '05/05', profit: 900 },
  { name: '05/06', profit: 1200 },
  { name: '05/07', profit: 1100 },
]

const stats = [
  { label: 'Total Balance', value: '$2,450.00', icon: ShieldCheck, trend: '+12.5%', isUp: true },
  { label: 'Active Platforms', value: '14', icon: Activity, trend: 'Stable', isUp: true },
  { label: 'Profit Ratio', value: '1:4.2', icon: BarChart3, trend: '+2.1%', isUp: true },
  { label: 'Daily Streak', value: '7 Days', icon: Zap, trend: 'On Target', isUp: true },
]

const recentActivity = [
  { platform: 'Chumba Casino', amount: '+$50.00', type: 'Redemption', status: 'Completed', date: '2h ago' },
  { platform: 'Fortune Coins', amount: '-$10.00', type: 'Playthrough', status: 'In Progress', date: '5h ago' },
  { platform: 'Pulsz', amount: '+$120.00', type: 'Daily Drop', status: 'Completed', date: '1d ago' },
]

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-8 pb-12">
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

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter text-white">SITREP: ALPHA</h2>
          <p className="text-tactical-muted font-mono text-xs uppercase tracking-[0.2em] mt-1">Personnel: Agent Hartman | Location: Sector 7G</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus size={14} /> New Asset
          </Button>
          <Button size="sm">Initiate Scan</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="hover:border-gold/50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="tactical-header">
                  <stat.icon size={14} />
                  <span>{stat.label}</span>
                </div>
                <div className={stat.isUp ? "text-green-500 font-mono text-[10px]" : "text-red-500 font-mono text-[10px]"}>
                  {stat.trend}
                </div>
              </div>
              <div className="tactical-value text-2xl mt-2">{stat.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <Card title="Performance Analytics" icon={<BarChart3 size={14} />}>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2C2C2C" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#141414', 
                      border: '1px solid #2C2C2C', 
                      borderRadius: '4px',
                      fontFamily: 'monospace'
                    }}
                    itemStyle={{ color: '#D4AF37' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#D4AF37" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorProfit)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <Card title="Recent Field Logs" icon={<Calendar size={14} />}>
            <div className="space-y-4 mt-2">
              {recentActivity.map((log, i) => (
                <div key={i} className="flex items-center justify-between p-3 border-b border-tactical-border last:border-0 hover:bg-white/5 transition-colors cursor-pointer group">
                  <div>
                    <div className="font-mono text-xs text-white uppercase tracking-wider">{log.platform}</div>
                    <div className="text-[10px] text-tactical-muted uppercase font-mono mt-0.5">{log.type} // {log.date}</div>
                  </div>
                  <div className="text-right">
                    <div className={cn("tactical-value text-xs", log.amount.startsWith('+') ? "text-green-500" : "text-red-500")}>
                      {log.amount}
                    </div>
                    <div className="text-[8px] text-tactical-muted uppercase font-mono">{log.status}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-[10px]">View Full Dossier</Button>
          </Card>
        </div>
      </div>

      {/* Directory Quick View */}
      <Card title="Operational Status Report" icon={<Activity size={14} />}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-tactical-border">
                <th className="pb-4 font-mono text-[10px] uppercase text-tactical-muted tracking-widest">Platform</th>
                <th className="pb-4 font-mono text-[10px] uppercase text-tactical-muted tracking-widest">Login Efficiency</th>
                <th className="pb-4 font-mono text-[10px] uppercase text-tactical-muted tracking-widest">Redeemable</th>
                <th className="pb-4 font-mono text-[10px] uppercase text-tactical-muted tracking-widest">Progress</th>
                <th className="pb-4 font-mono text-[10px] uppercase text-tactical-muted tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tactical-border/30">
              {[
                { name: 'Luckyland Slots', streak: '98%', redeem: '$45.00', progress: 75 },
                { name: 'Stake.us', streak: '100%', redeem: '$120.50', progress: 100 },
                { name: 'WOW Vegas', streak: '85%', redeem: '$12.00', progress: 20 },
              ].map((row, i) => (
                <tr key={i} className="group hover:bg-gold/5 transition-colors">
                  <td className="py-4 font-mono text-xs text-white">{row.name}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                       <div className="w-24 h-1 bg-tactical-border rounded-full overflow-hidden">
                        <div className="h-full bg-gold" style={{ width: row.streak }} />
                      </div>
                      <span className="font-mono text-[10px] text-tactical-muted">{row.streak}</span>
                    </div>
                  </td>
                  <td className="py-4 tactical-value text-xs">{row.redeem}</td>
                  <td className="py-4">
                     <div className="flex items-center gap-2">
                       <div className="w-24 h-1 bg-tactical-border rounded-full overflow-hidden">
                        <div className={cn("h-full", row.progress === 100 ? "bg-green-500" : "bg-blue-500")} style={{ width: `${row.progress}%` }} />
                      </div>
                      <span className="font-mono text-[10px] text-tactical-muted">{row.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <Button variant="ghost" size="sm" className="p-2 h-auto"><ChevronRight size={14} /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
