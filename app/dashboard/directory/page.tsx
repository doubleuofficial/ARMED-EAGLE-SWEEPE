'use client'

import React, { useState } from 'react'
import { Database, Search, ArrowUpDown, ExternalLink, Filter, Download, MoreHorizontal, AlertCircle, Activity } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const initialDirectory = [
  { name: 'Chumba Casino', type: 'VGW_UNIT', balance: '$452.00', progress: 100, status: 'Operational', risk: 'LOW' },
  { name: 'Luckyland Slots', type: 'VGW_UNIT', balance: '$82.50', progress: 85, status: 'Operational', risk: 'LOW' },
  { name: 'Stake.us', type: 'STAKE_NODE', balance: '$1,240.20', progress: 40, status: 'Operational', risk: 'LOW' },
  { name: 'Pulsz', type: 'YELLOW_SOC', balance: '$12.00', progress: 10, status: 'Degraded', risk: 'MED' },
  { name: 'WOW Vegas', type: 'MW_SYSTEM', balance: '$0.00', progress: 0, status: 'Operational', risk: 'LOW' },
  { name: 'Fortune Coins', type: 'BLAZE_NET', balance: '$340.00', progress: 100, status: 'Operational', risk: 'LOW' },
  { name: 'McLuck', type: 'B2_SECURE', balance: '$5.00', progress: 5, status: 'Offline', risk: 'HIGH' },
  { name: 'Global Sweepstakes', type: 'GLOBAL_HUB', balance: '$89.30', progress: 65, status: 'Operational', risk: 'LOW' },
  { name: 'Prize Picks', type: 'DAILY_PICK', balance: '$156.00', progress: 30, status: 'Operational', risk: 'MED' },
  { name: 'Sweepstakes Advantage', type: 'ADVANTAGE_CORE', balance: '$0.00', progress: 0, status: 'Maintenance', risk: 'LOW' },
]

export default function DirectoryPage() {
  const [data] = useState(initialDirectory)
  const [searchQuery, setSearchQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState('ALL')

  const filteredData = data.filter(item => 
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (riskFilter === 'ALL' || item.risk === riskFilter)
  )

  return (
    <div className="space-y-8 pb-12 h-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">Platform Index</h2>
          <p className="text-tactical-muted font-mono text-xs uppercase tracking-[0.2em] mt-1">Intelligence Database // Total Nodes: {data.length} // Filtered: {filteredData.length}</p>
        </div>
        <div className="flex items-center gap-4">
           <Button variant="outline" className="h-12 border-2 uppercase font-black tracking-widest text-[10px] italic">
            <Download size={14} className="mr-2" /> DATA_EXPORT.CSV
          </Button>
          <Button className="h-12 shadow-[0_0_20px_rgba(212,175,55,0.2)] font-black uppercase italic tracking-tighter shrink-0 px-8">
            SYNCHRONIZE GLOBAL INDEX
          </Button>
        </div>
      </div>

      {/* Platform Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Platforms', value: data.length, color: 'text-gold' },
          { label: 'Operational', value: data.filter(p => p.status === 'Operational').length, color: 'text-green-500' },
          { label: 'High Risk', value: data.filter(p => p.risk === 'HIGH').length, color: 'text-red-500' },
          { label: 'Avg Progress', value: `${Math.round(data.reduce((sum, p) => sum + p.progress, 0) / data.length)}%`, color: 'text-blue-500' },
        ].map((stat, i) => (
          <Card key={i} className="top-secret-border bg-tactical-card p-4 text-center">
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-xs text-tactical-muted font-mono uppercase tracking-widest">{stat.label}</div>
          </Card>
        ))}
      </div>

      <Card className="flex flex-col h-full bg-tactical-card/50">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-tactical-muted group-focus-within:text-gold transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="FILTER BY DESIGNATION OR OPERATOR..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border-2 border-tactical-border pl-12 pr-4 py-4 font-mono text-xs text-white focus:outline-none focus:border-gold transition-all rounded-sm tracking-[0.2em] placeholder:opacity-40"
            />
          </div>
          <Button variant="outline" className="h-14 border-2 px-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest">
            <Filter size={14} /> 
            <select 
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-[10px] uppercase tracking-widest"
            >
              <option value="ALL">ALL RISKS</option>
              <option value="LOW">LOW RISK</option>
              <option value="MED">MED RISK</option>
              <option value="HIGH">HIGH RISK</option>
            </select>
          </Button>
        </div>

        <div className="overflow-x-auto relative rounded-sm border border-tactical-border/30">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-gold uppercase font-black italic tracking-widest text-[10px]">
                <th className="p-6 border-b border-tactical-border w-1/4">Designation</th>
                <th className="p-6 border-b border-tactical-border">Operator Type</th>
                <th className="p-6 border-b border-tactical-border text-right">Extracted SC</th>
                <th className="p-6 border-b border-tactical-border">Extraction Progress</th>
                <th className="p-6 border-b border-tactical-border">Status</th>
                <th className="p-6 border-b border-tactical-border">Risk Level</th>
                <th className="p-6 border-b border-tactical-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tactical-border/20">
              {filteredData.map((row, i) => (
                <tr key={i} className="group hover:bg-gold/[0.03] transition-all duration-300">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gold opacity-30 group-hover:opacity-100 group-hover:shadow-[0_0_10px_#D4AF37] transition-all" />
                      <div className="font-black text-white text-base tracking-tight uppercase italic">{row.name}</div>
                    </div>
                  </td>
                  <td className="p-6 font-mono text-[10px] text-tactical-muted uppercase tracking-[0.15em]">{row.type}</td>
                  <td className="p-6 text-right">
                    <div className="text-xl font-black text-white font-mono tracking-tighter">{row.balance}</div>
                    <div className="text-[8px] text-tactical-muted font-bold uppercase tracking-widest mt-1">Ready for Redeem</div>
                  </td>
                  <td className="p-6 min-w-[200px]">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-[8px] font-mono font-bold uppercase tracking-widest">
                        <span className="text-tactical-muted">Node Readiness</span>
                        <span className={cn(row.progress === 100 ? "text-green-500" : "text-gold")}>{row.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-tactical-border/30">
                        <div 
                          className={cn(
                            "h-full transition-all duration-700 ease-out", 
                            row.progress === 100 ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" : "bg-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                          )} 
                          style={{ width: `${row.progress}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className={cn(
                      "flex items-center gap-2 font-mono text-[9px] font-black uppercase px-3 py-1.5 border-2 rounded-sm w-fit tracking-widest",
                      row.status === 'Operational' ? "border-green-500/20 text-green-500 bg-green-500/5 shadow-[0_0_15px_rgba(34,197,94,0.05)]" :
                      row.status === 'Degraded' ? "border-yellow-500/20 text-yellow-500 bg-yellow-500/5 shadow-[0_0_15px_rgba(234,179,8,0.05)]" :
                      row.status === 'Maintenance' ? "border-blue-500/20 text-blue-500 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.05)]" :
                      "border-red-500/20 text-red-500 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.05)]"
                    )}>
                      <Activity size={10} className={cn(row.status === 'Operational' ? "animate-pulse" : "")} />
                      {row.status}
                    </div>
                  </td>
                  <td className="p-6">
                    <div className={cn(
                      "font-mono text-[9px] font-black uppercase px-3 py-1.5 border-2 rounded-sm w-fit tracking-widest",
                      row.risk === 'LOW' ? "border-green-500/20 text-green-500 bg-green-500/5" :
                      row.risk === 'MED' ? "border-yellow-500/20 text-yellow-500 bg-yellow-500/5" :
                      "border-red-500/20 text-red-500 bg-red-500/5"
                    )}>
                      {row.risk}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end items-center gap-2">
                       <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full hover:bg-gold/10 hover:text-gold transition-colors">
                        <ExternalLink size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full hover:bg-black/40 transition-colors">
                        <MoreHorizontal size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex items-center justify-between p-6 bg-black/40 border border-tactical-border/30 rounded-sm">
           <div className="flex items-center gap-4 text-tactical-muted font-mono text-[10px] uppercase tracking-widest">
              <Download size={14} />
              Showing {filteredData.length} of {data.length} Global Intelligence Nodes
           </div>
           <div className="flex gap-2">
              <Button disabled variant="outline" size="sm" className="px-6 border-2 font-black text-[10px] uppercase italic">Previous</Button>
              <Button disabled variant="outline" size="sm" className="px-6 border-2 font-black text-[10px] uppercase italic">Next</Button>
           </div>
        </div>
      </Card>
    </div>
  )
}
