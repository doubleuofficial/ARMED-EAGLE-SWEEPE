'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Lock, 
  Gift, 
  Database, 
  ChevronRight,
  LogOut,
  Target
} from 'lucide-react'
import { motion } from 'motion/react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Account Vault', href: '/vault', icon: Lock },
  { name: 'Daily Rewards', href: '/rewards', icon: Gift },
  { name: 'Directory', href: '/directory', icon: Database },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 h-screen bg-tactical-card border-r border-tactical-border flex flex-col pt-8">
      {/* Brand */}
      <div className="px-6 mb-12 flex items-center gap-3">
        <div className="w-10 h-10 bg-gold grid place-items-center rounded-sm rotate-45">
          <Target className="text-black -rotate-45" size={24} />
        </div>
        <div>
          <h1 className="font-mono text-lg font-bold tracking-tighter text-white leading-none">ARMED EAGLE</h1>
          <p className="text-[10px] font-mono text-gold opacity-80 mt-1 uppercase tracking-widest">Operation: Sweep</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 group relative overflow-hidden",
                isActive 
                  ? "bg-gold/10 text-gold border-r-4 border-gold" 
                  : "text-tactical-muted hover:text-white hover:bg-tactical-border/50"
              )}
            >
              <item.icon size={18} className={cn(isActive ? "text-gold" : "text-tactical-muted group-hover:text-white")} />
              <span className="font-mono text-xs uppercase tracking-wider">{item.name}</span>
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-0 w-1 h-full bg-gold"
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Military Grade Indicator */}
      <div className="p-6 border-t border-tactical-border">
        <div className="top-secret-border bg-black/40">
          <div className="tactical-header">
            <span className="w-2 h-2 bg-green-500 animate-pulse rounded-full" />
            Security Level: 04
          </div>
          <p className="text-[10px] font-mono text-tactical-muted leading-relaxed">
            SYSTEM STATUS: ENCRYPTED. 
            AUTH TOKEN ACTIVE.
          </p>
        </div>

        <button className="flex items-center gap-2 mt-8 text-tactical-muted hover:text-red-500 transition-colors px-4 py-2 w-full font-mono text-[10px] uppercase tracking-widest">
          <LogOut size={14} />
          Terminate Connection
        </button>
      </div>
    </div>
  )
}
