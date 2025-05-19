import * as CryptoJS from "crypto-js"

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  // In a real app, use a proper password hashing library with salt
  return CryptoJS.SHA256(password).toString()
}

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const hashedInput = await hashPassword(password)
  return hashedInput === hashedPassword
}
