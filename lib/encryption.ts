import CryptoJS from 'crypto-js'

// Get encryption key from environment variable
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-key-change-in-production'

export function encryptPassword(password: string): string {
  try {
    return CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString()
  } catch (error) {
    console.error('Encryption failed:', error)
    throw new Error('Failed to encrypt password')
  }
}

export function decryptPassword(encryptedPassword: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, ENCRYPTION_KEY)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('Decryption failed:', error)
    throw new Error('Failed to decrypt password')
  }
}

// Generate a random encryption key (for development/testing)
export function generateEncryptionKey(): string {
  return CryptoJS.lib.WordArray.random(256/8).toString()
}