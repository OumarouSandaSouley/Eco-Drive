import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SecureStore from "expo-secure-store"

// Keys for AsyncStorage
export const STORAGE_KEYS = {
  USERS: "ecodrive_users",
  APPOINTMENTS: "ecodrive_appointments",
  MAINTENANCE_RECORDS: "ecodrive_maintenance_records",
  NOTIFICATIONS: "ecodrive_notifications",
  DIAGNOSTICS: "ecodrive_diagnostics",
  CURRENT_USER: "ecodrive_current_user",
}

// Keys for SecureStore
export const SECURE_KEYS = {
  AUTH_TOKEN: "ecodrive_auth_token",
}

// Generic functions for AsyncStorage\
export const getItem = async <T>(key: string)
: Promise<T | null> =>
{
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error getting item from storage (${key}):`, error)
    return null;
  }
}

export const setItem = async <T>(key: string, value: T)
: Promise<void> =>
{
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (error) {
    console.error(`Error setting item in storage (${key}):`, error)
    throw error
  }
}

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing item from storage (${key}):`, error)
    throw error
  }
}

// Generic functions for SecureStore
export const getSecureItem = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key)
  } catch (error) {
    console.error(`Error getting secure item (${key}):`, error)
    return null
  }
}

export const setSecureItem = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value)
  } catch (error) {
    console.error(`Error setting secure item (${key}):`, error)
    throw error
  }
}

export const removeSecureItem = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key)
  } catch (error) {
    console.error(`Error removing secure item (${key}):`, error)
    throw error
  }
}

// Initialize storage with default data if empty
export const initializeStorage = async (): Promise<void> => {
  try {
    // Check if users exist
    const users = await getItem<any[]>(STORAGE_KEYS.USERS)
    if (!users) {
      await setItem(STORAGE_KEYS.USERS, [])
    }

    // Check if appointments exist
    const appointments = await getItem<any[]>(STORAGE_KEYS.APPOINTMENTS)
    if (!appointments) {
      await setItem(STORAGE_KEYS.APPOINTMENTS, [])
    }

    // Check if maintenance records exist
    const maintenanceRecords = await getItem<any[]>(STORAGE_KEYS.MAINTENANCE_RECORDS)
    if (!maintenanceRecords) {
      await setItem(STORAGE_KEYS.MAINTENANCE_RECORDS, [])
    }

    // Check if notifications exist
    const notifications = await getItem<any[]>(STORAGE_KEYS.NOTIFICATIONS)
    if (!notifications) {
      await setItem(STORAGE_KEYS.NOTIFICATIONS, [])
    }

    // Check if diagnostics exist
    const diagnostics = await getItem<any[]>(STORAGE_KEYS.DIAGNOSTICS)
    if (!diagnostics) {
      await setItem(STORAGE_KEYS.DIAGNOSTICS, [])
    }
  } catch (error) {
    console.error("Error initializing storage:", error)
    throw error
  }
}

// Clear all app data (for testing or logout)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear()
    // Note: SecureStore doesn't have a clear method, so we need to delete each key individually
    await SecureStore.deleteItemAsync(SECURE_KEYS.AUTH_TOKEN)
  } catch (error) {
    console.error("Error clearing all data:", error)
    throw error
  }
}
