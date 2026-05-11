export interface PasswordStrength {
  score: number // 0-4
  label: 'Very Weak' | 'Weak' | 'Medium' | 'Strong' | 'Very Strong'
  color: string
  checks: {
    length: boolean
    uppercase: boolean
    lowercase: boolean
    numbers: boolean
    special: boolean
  }
}

export function checkPasswordStrength(password: string): PasswordStrength {
  let score = 0
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  }

  // Calculate score based on checks
  if (checks.length) score++
  if (checks.uppercase) score++
  if (checks.lowercase) score++
  if (checks.numbers) score++
  if (checks.special) score++

  // Bonus points for longer passwords
  if (password.length >= 12) score++
  if (password.length >= 16) score++

  // Cap at 4
  score = Math.min(score, 4)

  const strengthMap = {
    0: { label: 'Very Weak' as const, color: 'text-red-500' },
    1: { label: 'Weak' as const, color: 'text-red-400' },
    2: { label: 'Medium' as const, color: 'text-yellow-500' },
    3: { label: 'Strong' as const, color: 'text-green-500' },
    4: { label: 'Very Strong' as const, color: 'text-green-400' },
  }

  return {
    score,
    ...strengthMap[score as keyof typeof strengthMap],
    checks,
  }
}