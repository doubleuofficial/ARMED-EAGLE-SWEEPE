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
  Target,
  Settings,
  Shield
} from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Vault', href: '/vault', icon: Lock },
  { name: 'Rewards', href: '/rewards', icon: Gift },
  { name: 'Directory', href: '/directory', icon: Database },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="w-20 border-r-2 border-tactical-border bg-tactical-card flex flex-col items-center py-8 gap-8 shrink-0 z-40">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link 
            key={item.name} 
            href={item.href}
            title={item.name}
            className={cn(
              "p-3 transition-all duration-300 relative group rounded-sm",
              isActive 
                ? "bg-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]" 
                : "text-tactical-muted hover:text-gold hover:bg-tactical-border/30"
            )}
          >
            <item.icon size={24} className={cn(isActive ? "stroke-[3px]" : "stroke-[1.5px]")} />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-3 py-1 bg-tactical-card border border-gold text-gold text-[10px] font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              {item.name}
            </div>

            {isActive && (
              <motion.div 
                layoutId="sidebar-active"
                className="absolute -left-4 w-1 h-8 bg-gold rounded-r-full"
              />
            )}
          </Link>
        )
      })}

      <div className="mt-auto flex flex-col gap-6">
        <button className="p-3 text-tactical-muted hover:text-gold transition-colors">
          <Settings size={20} />
        </button>
        <button className="p-3 text-tactical-muted hover:text-red-500 transition-colors">
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  )
}
