'use client'

import React from 'react'
import { Target, Shield, Lock, Database, Gift, BarChart3, Users, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-tactical-bg flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mb-12"
          >
            <div className="w-20 h-20 bg-gold grid place-items-center rounded-sm rotate-45 mb-8 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <Target className="text-black -rotate-45" size={40} />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic mb-4">
              Armed Eagle
            </h1>
            <p className="text-2xl md:text-3xl font-bold text-gold uppercase tracking-widest mb-2">
              Tactical Sweepstake Tracker
            </p>
            <p className="text-tactical-muted font-mono text-sm uppercase tracking-[0.3em]">
              Strategic Intelligence Interface
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              Welcome, Agent {user?.email?.split('@')[0]?.toUpperCase() || 'OPERATIVE'}. You have accessed the
              <span className="text-gold font-bold"> ARMED EAGLE </span>
              command center - a military-grade platform for tracking, managing, and optimizing your sweepstake operations.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="top-secret-border bg-tactical-card p-6 text-left">
                <div className="tactical-header mb-4">
                  <Shield className="text-gold" size={16} />
                  Mission Objective
                </div>
                <p className="text-tactical-muted text-sm leading-relaxed">
                  ARMED EAGLE provides tactical intelligence for sweepstake enthusiasts. Track entries,
                  monitor performance, secure your data with military-grade encryption, and maximize your
                  strategic advantage in the competitive sweepstakes arena.
                </p>
              </Card>

              <Card className="top-secret-border bg-tactical-card p-6 text-left">
                <div className="tactical-header mb-4">
                  <Lock className="text-gold" size={16} />
                  Security Clearance
                </div>
                <p className="text-tactical-muted text-sm leading-relaxed">
                  Your operations are protected by AES-256 encryption, multi-factor authentication,
                  and secure vault storage. All data transmission is encrypted and your personal
                  information remains classified.
                </p>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button className="flex items-center gap-2 px-8 py-3">
                  <Target size={18} />
                  Enter Command Center
                </Button>
              </Link>
              <Link href="/dashboard/vault">
                <Button variant="outline" className="flex items-center gap-2 px-8 py-3 border-tactical-border hover:border-gold">
                  <Database size={18} />
                  Access Secure Vault
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-tactical-card/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider mb-4">
              Tactical Capabilities
            </h2>
            <p className="text-tactical-muted font-mono text-sm uppercase tracking-[0.2em]">
              Advanced Tools for Sweepstake Operations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Database,
                title: 'Secure Vault',
                description: 'Encrypted storage for all your sweepstake data and credentials.'
              },
              {
                icon: BarChart3,
                title: 'Analytics Dashboard',
                description: 'Real-time tracking of entries, wins, and performance metrics.'
              },
              {
                icon: Gift,
                title: 'Rewards Tracker',
                description: 'Monitor and manage your sweepstake rewards and achievements.'
              },
              {
                icon: Shield,
                title: 'Security Center',
                description: 'Advanced security settings and access controls.'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="top-secret-border bg-tactical-bg p-6 h-full hover:border-gold/50 transition-colors">
                  <div className="flex flex-col items-center text-center">
                    <feature.icon className="text-gold mb-4" size={32} />
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-tactical-muted text-sm">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white uppercase tracking-wider mb-8">
              Operational Status
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Active Agents', value: '1,247', icon: Users },
                { label: 'Total Entries', value: '45,892', icon: Target },
                { label: 'Success Rate', value: '12.4%', icon: Zap },
                { label: 'Security Level', value: 'MAXIMUM', icon: Shield }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="top-secret-border bg-tactical-card p-4">
                    <div className="flex flex-col items-center">
                      <stat.icon className="text-gold mb-2" size={24} />
                      <div className="text-2xl font-bold text-gold mb-1">{stat.value}</div>
                      <div className="text-xs font-mono text-tactical-muted uppercase tracking-widest">{stat.label}</div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-tactical-border bg-tactical-card">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-tactical-muted font-mono text-xs uppercase tracking-[0.2em] mb-4">
            ARMED EAGLE // TACTICAL SWEEPSTAKE TRACKER
          </p>
          <p className="text-tactical-muted text-sm">
            All operations conducted under strict security protocols.
            Unauthorized access is prohibited and monitored.
          </p>
        </div>
      </footer>
    </div>
  )
}