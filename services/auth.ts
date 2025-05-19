import { getItem, setItem, getSecureItem, setSecureItem, removeSecureItem, STORAGE_KEYS, SECURE_KEYS } from "./storage"
import type { User } from "../types"
import { generateUUID } from "../utils/uuid"
import { hashPassword, verifyPassword } from "../utils/crypto"

// Register a new user
export const register = async (name: string, email: string, password: string): Promise<void> => {
  try {
    // Get existing users
    const users = (await getItem<User[]>(STORAGE_KEYS.USERS)) || []

    // Check if email already exists
    const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase())
    if (existingUser) {
      throw new Error("Email already registered")
    }

    // Hash password
    const password_hash = await hashPassword(password)

    // Create new user
    const newUser: User = {
      id: generateUUID(),
      email,
      name,
      password_hash,
      role: "user", // Default role
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Add user to storage
    users.push(newUser)
    await setItem(STORAGE_KEYS.USERS, users)
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

// Login user
export const login = async (email: string, password: string): Promise<User> => {
  try {
    // Get users
    const users = (await getItem<User[]>(STORAGE_KEYS.USERS)) || []

    // Find user by email
    const user = users.find((user) => user.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      throw new Error("Invalid email or password")
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash)
    if (!isPasswordValid) {
      throw new Error("Invalid email or password")
    }

    // Generate simple token (in a real app, use JWT)
    const token = `${user.id}_${Date.now()}`

    // Store token in secure storage
    await setSecureItem(SECURE_KEYS.AUTH_TOKEN, token)

    // Store current user in AsyncStorage for quick access
    const userWithoutPassword = { ...user }
    delete userWithoutPassword.password_hash
    await setItem(STORAGE_KEYS.CURRENT_USER, userWithoutPassword)

    return userWithoutPassword
  } catch (error) {
    console.error("Login error:", error)
    throw error
  }
}

// Logout user
export const logout = async (): Promise<void> => {
  try {
    // Remove auth token
    await removeSecureItem(SECURE_KEYS.AUTH_TOKEN)

    // Remove current user
    await setItem(STORAGE_KEYS.CURRENT_USER, null)
  } catch (error) {
    console.error("Logout error:", error)
    throw error
  }
}

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Check if token exists
    const token = await getSecureItem(SECURE_KEYS.AUTH_TOKEN)
    if (!token) {
      return null
    }

    // Get current user from storage
    const user = await getItem<User>(STORAGE_KEYS.CURRENT_USER)
    if (!user) {
      return null
    }

    return user
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<User> => {
  try {
    // Get users
    const users = (await getItem<User[]>(STORAGE_KEYS.USERS)) || []

    // Find user index
    const userIndex = users.findIndex((user) => user.id === userId)
    if (userIndex === -1) {
      throw new Error("User not found")
    }

    // Update user
    const updatedUser = {
      ...users[userIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    }

    // Don't allow updating certain fields
    delete (updatedUser as any).id
    delete (updatedUser as any).created_at

    users[userIndex] = updatedUser

    // Save updated users
    await setItem(STORAGE_KEYS.USERS, users)

    // Update current user if it's the same
    const currentUser = await getItem<User>(STORAGE_KEYS.CURRENT_USER)
    if (currentUser && currentUser.id === userId) {
      const userWithoutPassword = { ...updatedUser }
      delete userWithoutPassword.password_hash
      await setItem(STORAGE_KEYS.CURRENT_USER, userWithoutPassword)
      return userWithoutPassword
    }

    const returnUser = { ...updatedUser }
    delete returnUser.password_hash
    return returnUser
  } catch (error) {
    console.error("Update user profile error:", error)
    throw error
  }
}
