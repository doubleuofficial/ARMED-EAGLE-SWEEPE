'use client'

import React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-gold text-black hover:bg-gold-hover font-bold',
    secondary: 'bg-tactical-border text-white hover:bg-tactical-border/80',
    outline: 'border border-gold text-gold hover:bg-gold/10',
    ghost: 'text-tactical-muted hover:text-white hover:bg-tactical-border/50'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-6 py-3 text-xs',
    lg: 'px-8 py-4 text-sm'
  }

  return (
    <button 
      className={cn(
        "font-mono uppercase tracking-widest transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
