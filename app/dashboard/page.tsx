'use client'

import React from 'react'
import { 
  Target, 
  Activity, 
  Users, 
  TrendingUp, 
  Shield, 
  Clock, 
  Database,
  LayoutDashboard,
  AlertTriangle,
  Menu,
  Terminal
} from 'lucide-react'
import { motion } from 'motion/react'

export default function DashboardPage() {
  // Operational metrics derived from strategic intelligence reports
  const stats = [
    { label: 'Active Agents', value: '1,247', icon: Users, color: '#D4AF37' },
    { label: 'Total Entries', value: '45,892', icon: Activity, color: '#D4AF37' },
    { label: 'Mission Success', value: '12.4%', icon: TrendingUp, color: '#2ECC71' },
    { label: 'Encryption', value: 'AES-256', icon: Shield, color: '#3498DB' }
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] font-sans">
      {/* Tactical Navigation Bar */}
      <nav className="border-b border-[#2D2D2D] bg-[#0A0A0A] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Target className="text-[#D4AF37] w-6 h-6" />
          <span className="text-lg font-bold tracking-tighter uppercase font-mono">Armed Eagle</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-4 text-[10px] font-mono text-[#888888] uppercase tracking-widest">
            <span className="text-[#D4AF37]">● Command Center</span>
            <span>○ Secure Vault</span>
            <span>○ Analytics</span>
          </div>
          <button className="p-2 border border-[#2D2D2D] rounded hover:bg-[#1A1A1A]">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <main className="p-6 space-y-8 max-w-7xl mx-auto">
        {/* Dashboard Title [1] */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight uppercase">
            Tactical Sweepstakes Surveillance Dashboard [1]
          </h1>
          <p className="text-[#888888] text-xs font-mono">Intelligence Interface v2.4.0 | Global Feed: ACTIVE</p>
        </div>

        {/* Intelligence Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#1A1A1A] border border-[#2D2D2D] p-5 rounded-lg hover:border-[#D4AF37]/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                <span className="text-[10px] font-mono text-[#888888] uppercase">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold font-mono tracking-tight">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Central Analytics: Field Intelligence Reports */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg p-6 min-h-[400px]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-mono text-[#D4AF37] uppercase flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Field Intelligence Reports
                </h2>
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-green-500 uppercase tracking-tighter">Live Feed</span>
                </div>
              </div>
              
              {/* Data Visualization Placeholder */}
              <div className="flex flex-col items-center justify-center h-64 border border-dashed border-[#2D2D2D] rounded-lg">
                <Terminal className="w-8 h-8 text-[#2D2D2D] mb-4" />
                <p className="text-[#888888] font-mono text-[10px] uppercase tracking-widest text-center px-4">
                  Initializing Neural Analytics Engine... <br />
                  Awaiting Uplink from Remote Extraction Units
                </p>
              </div>
            </section>
          </div>

          {/* Tactical Sidebar */}
          <div className="space-y-6">
            {/* Supply Drop Protocol */}
            <section className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg p-6">
              <h2 className="text-sm font-mono text-[#D4AF37] uppercase mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Supply Drop Protocol
              </h2>
              <div className="space-y-3">
                <div className="bg-[#0A0A0A] border border-[#2D2D2D] p-3 rounded flex justify-between items-center group cursor-pointer hover:border-[#D4AF37] transition-all">
                  <p className="text-xs font-bold">STAKE.US BONUS</p>
                  <p className="text-[#D4AF37] font-mono text-xs uppercase">Claimed</p>
                </div>
                <div className="bg-[#0A0A0A] border border-[#2D2D2D] p-3 rounded flex justify-between items-center">
                  <p className="text-xs font-bold">CHUMBA DAILY</p>
                  <p className="text-white font-mono text-xs">04:22:11</p>
                </div>
              </div>

              {/* Progress Tracker Section (FIXED) */}
              <div className="mt-8 pt-8 border-t border-[#2D2D2D]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#D4AF37] text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                    <Target className="w-3 h-3" /> Extraction Progress
                  </span>
                  <span className="text-white text-xs font-mono">12.4%</span>
                </div>
                <div className="h-2 w-full bg-[#050505] rounded-full border border-[#2D2D2D] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '12.4%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                  />
                </div>
                <p className="text-[10px] text-[#888888] mt-3 font-mono italic leading-relaxed">
                  * Real-time extraction progress based on 45,892 verified entries.
                </p>
              </div>
            </section>

            {/* System Status Alert */}
            <section className="bg-red-500/5 border border-red-500/20 rounded-lg p-6">
              <h2 className="text-sm font-mono text-red-500 uppercase mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Threat Assessment
              </h2>
              <p className="text-[10px] text-[#888888] font-mono leading-tight">
                ENCRYPTION: AES-256 ACTIVE<br />
                MFA PROTOCOL: ENFORCED<br />
                THREAT LEVEL: LOW
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
