'use client'

import React, { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft, Target, Database, Shield, Gift, BarChart3, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { motion, AnimatePresence } from 'motion/react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'

interface TutorialStep {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  content: React.ReactNode
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to ARMED EAGLE',
    description: 'Your tactical command center for sweepstake operations',
    icon: Target,
    content: (
      <div className="space-y-4">
        <p className="text-tactical-muted">
          Congratulations, Agent. You have been granted access to the ARMED EAGLE Tactical Sweepstake Tracker.
          This advanced platform provides military-grade tools for managing your sweepstake operations.
        </p>
        <div className="bg-tactical-bg/50 p-4 rounded-sm border border-tactical-border">
          <h4 className="text-gold font-bold mb-2">MISSION BRIEFING:</h4>
          <ul className="text-sm text-tactical-muted space-y-1">
            <li>• Secure vault for credentials and data</li>
            <li>• Advanced analytics and tracking</li>
            <li>• Multi-factor authentication</li>
            <li>• Audit logging and security monitoring</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 'vault',
    title: 'Secure Vault',
    description: 'Store and manage your sweepstake credentials',
    icon: Database,
    content: (
      <div className="space-y-4">
        <p className="text-tactical-muted">
          The Secure Vault is your encrypted storage facility for all sweepstake-related data.
          All information is protected with AES-256 encryption.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-tactical-bg/50 p-3 rounded-sm border border-tactical-border">
            <h5 className="text-gold font-bold text-sm mb-1">ENCRYPTION</h5>
            <p className="text-xs text-tactical-muted">Military-grade AES-256</p>
          </div>
          <div className="bg-tactical-bg/50 p-3 rounded-sm border border-tactical-border">
            <h5 className="text-gold font-bold text-sm mb-1">AUDIT LOGS</h5>
            <p className="text-xs text-tactical-muted">All access tracked</p>
          </div>
        </div>
      </div>
    ),
    action: {
      label: 'Explore Vault',
      href: '/dashboard/vault'
    }
  },
  {
    id: 'analytics',
    title: 'Analytics Dashboard',
    description: 'Track performance and optimize strategies',
    icon: BarChart3,
    content: (
      <div className="space-y-4">
        <p className="text-tactical-muted">
          Monitor your sweepstake performance with real-time analytics, profit tracking,
          and strategic insights to maximize your success rate.
        </p>
        <div className="bg-tactical-bg/50 p-4 rounded-sm border border-tactical-border">
          <h4 className="text-gold font-bold mb-2">ANALYTICS FEATURES:</h4>
          <ul className="text-sm text-tactical-muted space-y-1">
            <li>• Real-time profit/loss tracking</li>
            <li>• Entry success rate analysis</li>
            <li>• Platform performance metrics</li>
            <li>• Trend analysis and forecasting</li>
          </ul>
        </div>
      </div>
    ),
    action: {
      label: 'View Analytics',
      href: '/dashboard'
    }
  },
  {
    id: 'security',
    title: 'Security Center',
    description: 'Advanced security and access controls',
    icon: Shield,
    content: (
      <div className="space-y-4">
        <p className="text-tactical-muted">
          Your security is paramount. Enable multi-factor authentication, monitor access logs,
          and maintain the highest level of operational security.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-tactical-bg/50 p-3 rounded-sm border border-tactical-border">
            <h5 className="text-gold font-bold text-sm mb-1">MFA</h5>
            <p className="text-xs text-tactical-muted">TOTP & SMS options</p>
          </div>
          <div className="bg-tactical-bg/50 p-3 rounded-sm border border-tactical-border">
            <h5 className="text-gold font-bold text-sm mb-1">AUDIT</h5>
            <p className="text-xs text-tactical-muted">Complete activity logs</p>
          </div>
        </div>
      </div>
    ),
    action: {
      label: 'Security Settings',
      href: '/dashboard/security'
    }
  },
  {
    id: 'rewards',
    title: 'Rewards Tracker',
    description: 'Manage and track your winnings',
    icon: Gift,
    content: (
      <div className="space-y-4">
        <p className="text-tactical-muted">
          Track all your sweepstake rewards, bonuses, and winnings in one centralized location.
          Never miss an opportunity or expiration date.
        </p>
        <div className="bg-tactical-bg/50 p-4 rounded-sm border border-tactical-border">
          <h4 className="text-gold font-bold mb-2">REWARDS FEATURES:</h4>
          <ul className="text-sm text-tactical-muted space-y-1">
            <li>• Automatic reward detection</li>
            <li>• Expiration date tracking</li>
            <li>• Claim status monitoring</li>
            <li>• Multi-platform integration</li>
          </ul>
        </div>
      </div>
    ),
    action: {
      label: 'Track Rewards',
      href: '/dashboard/rewards'
    }
  }
]

interface TutorialProps {
  onComplete: () => void
}

export function Tutorial({ onComplete }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  const currentTutorialStep = tutorialSteps[currentStep]

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    if (user) {
      // Mark tutorial as completed
      await supabase
        .from('user_onboarding')
        .upsert({
          user_id: user.id,
          tutorial_completed: true,
          [`${currentTutorialStep.id}_tutorial_shown`]: true
        })
    }
    setIsVisible(false)
    setTimeout(onComplete, 300)
  }

  const handleSkip = () => {
    handleComplete()
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-2xl"
        >
          <Card className="top-secret-border bg-tactical-card p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold grid place-items-center rounded-sm rotate-45">
                  <currentTutorialStep.icon className="text-black -rotate-45" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                    {currentTutorialStep.title}
                  </h2>
                  <p className="text-tactical-muted font-mono text-sm uppercase tracking-[0.2em]">
                    {currentTutorialStep.description}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-tactical-muted hover:text-white"
              >
                <X size={16} />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-tactical-muted mb-2">
                <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
                <span>{Math.round(((currentStep + 1) / tutorialSteps.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-tactical-bg h-2 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="mb-8">
              {currentTutorialStep.content}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft size={16} />
                Previous
              </Button>

              <div className="flex gap-2">
                {currentTutorialStep.action && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (currentTutorialStep.action?.href) {
                        window.location.href = currentTutorialStep.action.href
                      } else if (currentTutorialStep.action?.onClick) {
                        currentTutorialStep.action.onClick()
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    {currentTutorialStep.action.label}
                  </Button>
                )}

                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  {currentStep === tutorialSteps.length - 1 ? (
                    <>
                      <CheckCircle size={16} />
                      Complete Tutorial
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight size={16} />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}