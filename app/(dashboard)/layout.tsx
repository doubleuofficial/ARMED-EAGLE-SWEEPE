'use client'

import React from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Target } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

function DashboardHeader() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="h-16 border-b-2 border-gold bg-tactical-card flex items-center justify-between px-6 shrink-0 z-50">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gold grid place-items-center rounded-sm rotate-45 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
          <Target className="text-black -rotate-45" size={24} />
        </div>
        <div>
           <h1 className="text-xl font-black tracking-tighter uppercase italic text-gold leading-none">
             Armed Eagle <span className="text-white not-italic font-bold">Tactical Ops</span>
           </h1>
           <p className="text-[8px] font-mono text-tactical-muted uppercase tracking-[0.4em] mt-0.5">Operation: Digital Siphon</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end pr-6 border-r border-tactical-border/50">
          <span className="text-[9px] uppercase font-bold text-gold tracking-[0.2em]">Security Level</span>
          <span className="text-[10px] font-mono text-white">CLASSIFIED // LEVEL 05</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-bold text-white font-mono">{user?.email || 'AGENT HARTMAN'}</div>
            <div className="text-[8px] text-green-500 font-mono animate-pulse">TERMINAL ACTIVE</div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-gold overflow-hidden bg-black/40 relative">
             <Image
               src="https://api.dicebear.com/7.x/bottts/svg?seed=Eagle"
               alt="Agent"
               fill
               className="p-1"
               referrerPolicy="no-referrer"
             />
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="ml-2 border-red-500/50 text-red-400 hover:border-red-500 hover:text-red-300"
          >
            <LogOut size={14} />
          </Button>
        </div>
      </div>
    </header>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-tactical-bg border-4 border-gold">
      <DashboardHeader />

      <div className="flex flex-1 min-h-0 bg-tactical-bg relative">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8 relative">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
          />
          <div className="relative z-10 max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Bento Footer */}
      <footer className="h-8 border-t-2 border-tactical-border bg-tactical-card flex items-center justify-between px-6 text-[9px] font-mono shrink-0 z-50">
        <div className="text-gold flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
          TERMINAL CONNECTION: SECURE // ENCRYPTION AES-256
        </div>
        <div className="text-tactical-muted uppercase tracking-widest">
          System Time: {new Date().toISOString().split('T')[0].replace(/-/g, '.')} // {new Date().toLocaleTimeString()} UTC
        </div>
      </footer>
    </div>
  )
}
