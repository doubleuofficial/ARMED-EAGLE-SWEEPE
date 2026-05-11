'use client'

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'
import { Button } from './button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-[100] p-1"
          >
            <div className="top-secret-border bg-tactical-card shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="tactical-header mb-0">
                  <span className="w-2 h-2 bg-gold animate-pulse rounded-full" />
                  {title}
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 text-tactical-muted hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {children}

              <div className="mt-8 flex justify-end gap-4 border-t border-tactical-border pt-6">
                <Button variant="ghost" onClick={onClose} size="sm">Abort</Button>
                <Button size="sm">Submit Intelligence</Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
