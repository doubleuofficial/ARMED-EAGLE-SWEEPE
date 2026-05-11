'use client'

import React, { useState } from 'react'
import { Database, Search, ArrowUpDown, ExternalLink, Filter } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const initialDirectory = [
  { name: 'Chumba Casino', type: 'VGW', balance: '$452.00', progress: 100, status: 'Operational' },
  { name: 'Luckyland Slots', type: 'VGW', balance: '$82.50', progress: 85, status: 'Operational' },
  { name: 'Stake.us', type: 'Stake', balance: '$1,240.20', progress: 40, status: 'Operational' },
  { name: 'Pulsz', type: 'Yellow Social', balance: '$12.00', progress: 10, status: 'Degraded' },
  { name: 'WOW Vegas', type: 'MW', balance: '$0.00', progress: 0, status: 'Operational' },
  { name: 'Fortune Coins', type: 'Blazesoft', balance: '$340.00', progress: 100, status: 'Operational' },
  { name: 'McLuck', type: 'B2Services', balance: '$5.00', progress: 5, status: 'Offline' },
]

export default function DirectoryPage() {
  const [data] = useState(initialDirectory)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter text-white uppercase tracking-widest">ASSET DIRECTORY</h2>
          <p className="text-tactical-muted font-mono text-xs uppercase tracking-[0.2em] mt-1">Intelligence Database // Registered Platforms: {data.length}</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter size={14} /> Filter
          </Button>
          <Button size="sm">Export CSV</Button>
        </div>
      </div>

      <Card>
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tactical-muted" size={16} />
          <input 
            type="text" 
            placeholder="SEARCH INTELLIGENCE DATABASE..." 
            className="w-full bg-black/40 border border-tactical-border pl-10 pr-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-tactical-border/50">
                <th className="pb-3 px-2 font-mono text-[10px] uppercase text-tactical-muted tracking-widest">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                    Platform Name <ArrowUpDown size={10} />
                  </div>
                </th>
                <th className="pb-3 px-2 font-mono text-[10px] uppercase text-tactical-muted tracking-widest">Type</th>
                <th className="pb-3 px-2 font-mono text-[10px] uppercase text-tactical-muted tracking-widest text-right">Redeemable</th>
                <th className="pb-3 px-2 font-mono text-[10px] uppercase text-tactical-muted tracking-widest">Playthrough</th>
                <th className="pb-3 px-2 font-mono text-[10px] uppercase text-tactical-muted tracking-widest">Status</th>
                <th className="pb-3 px-2 font-mono text-[10px] uppercase text-tactical-muted tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tactical-border/20">
              {data.map((row, i) => (
                <tr key={i} className="group hover:bg-gold/5 transition-colors">
                  <td className="py-4 px-2">
                    <div className="font-bold text-white tracking-tight">{row.name}</div>
                  </td>
                  <td className="py-4 px-2 font-mono text-[10px] text-tactical-muted uppercase">{row.type}</td>
                  <td className="py-4 px-2 text-right">
                    <div className="tactical-value text-sm">{row.balance}</div>
                  </td>
                  <td className="py-4 px-2 min-w-[150px]">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-tactical-border rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all duration-500", 
                            row.progress === 100 ? "bg-green-500" : "bg-gold"
                          )} 
                          style={{ width: `${row.progress}%` }} 
                        />
                      </div>
                      <span className="font-mono text-[10px] text-tactical-muted w-8">{row.progress}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className={cn(
                      "flex items-center gap-2 font-mono text-[8px] uppercase px-2 py-1 border rounded-sm w-fit",
                      row.status === 'Operational' ? "border-green-500/30 text-green-500 bg-green-500/5" :
                      row.status === 'Degraded' ? "border-yellow-500/30 text-yellow-500 bg-yellow-500/5" :
                      "border-red-500/30 text-red-500 bg-red-500/5"
                    )}>
                      <span className={cn("w-1 h-1 rounded-full", 
                        row.status === 'Operational' ? "bg-green-500" :
                        row.status === 'Degraded' ? "bg-yellow-500" : "bg-red-500"
                      )} />
                      {row.status}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="p-2 h-auto hover:text-gold"><ExternalLink size={14} /></Button>
                    </div>
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
