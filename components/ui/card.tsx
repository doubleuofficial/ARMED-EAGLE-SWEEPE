'use client'

import React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  icon?: React.ReactNode
  headerAction?: React.ReactNode
}

export function Card({ title, icon, headerAction, children, className, ...props }: CardProps) {
  return (
    <div className={cn("tactical-grid p-6 animate-eagle-hover", className)} {...props}>
      {(title || icon) && (
        <div className="flex items-center justify-between mb-6">
          <div className="tactical-header mb-0">
            {icon}
            <span>{title}</span>
          </div>
          {headerAction}
        </div>
      )}
      {children}
    </div>
  )
}
