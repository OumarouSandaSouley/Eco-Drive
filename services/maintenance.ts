import { getItem, setItem, STORAGE_KEYS } from "./storage"
import type { MaintenanceRecord } from "../types"
import { generateUUID } from "../utils/uuid"
import { createNotification } from "./notifications"

// Get all maintenance records for a user
export const getAllMaintenanceRecords = async (userId: string): Promise<MaintenanceRecord[]> => {
  try {
    const records = (await getItem<MaintenanceRecord[]>(STORAGE_KEYS.MAINTENANCE_RECORDS)) || []
    return records
      .filter((record) => record.user_id === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error("Get all maintenance records error:", error)
    throw error
  }
}

// Get recent maintenance records for a user
export const getRecentMaintenanceRecords = async (userId: string, limit = 5): Promise<MaintenanceRecord[]> => {
  try {
    const records = await getAllMaintenanceRecords(userId)
    return records.slice(0, limit)
  } catch (error) {
    console.error("Get recent maintenance records error:", error)
    throw error
  }
}

// Get maintenance record by ID
export const getMaintenanceRecordById = async (id: string): Promise<MaintenanceRecord | null> => {
  try {
    const records = (await getItem<MaintenanceRecord[]>(STORAGE_KEYS.MAINTENANCE_RECORDS)) || []
    return records.find((record) => record.id === id) || null
  } catch (error) {
    console.error("Get maintenance record by ID error:", error)
    throw error
  }
}

// Create a new maintenance record
export const createMaintenanceRecord = async (recordData: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> => {
  try {
    const records = (await getItem<MaintenanceRecord[]>(STORAGE_KEYS.MAINTENANCE_RECORDS)) || []

    const newRecord: MaintenanceRecord = {
      id: generateUUID(),
      user_id: recordData.user_id || "",
      date: recordData.date || new Date().toISOString(),
      service: recordData.service || "",
      parts_replaced: recordData.parts_replaced || [],
      cost: recordData.cost || 0,
      mechanic_notes: recordData.mechanic_notes || "",
      created_at: new Date().toISOString(),
    }

    records.push(newRecord)
    await setItem(STORAGE_KEYS.MAINTENANCE_RECORDS, records)

    // Create notification for the new maintenance record
    await createNotification({
      user_id: newRecord.user_id,
      type: "maintenance",
      payload: {
        maintenance_id: newRecord.id,
        service_type: newRecord.service,
        cost: newRecord.cost,
        status: "completed",
      },
      read: false,
    })

    return newRecord
  } catch (error) {
    console.error("Create maintenance record error:", error)
    throw error
  }
}

// Update maintenance record
export const updateMaintenanceRecord = async (
  id: string,
  updates: Partial<MaintenanceRecord>,
): Promise<MaintenanceRecord> => {
  try {
    const records = (await getItem<MaintenanceRecord[]>(STORAGE_KEYS.MAINTENANCE_RECORDS)) || []

    const recordIndex = records.findIndex((record) => record.id === id)
    if (recordIndex === -1) {
      throw new Error("Maintenance record not found")
    }

    const updatedRecord = {
      ...records[recordIndex],
      ...updates,
    }

    // Don't allow updating certain fields
    delete (updatedRecord as any).id
    delete (updatedRecord as any).user_id
    delete (updatedRecord as any).created_at

    records[recordIndex] = updatedRecord
    await setItem(STORAGE_KEYS.MAINTENANCE_RECORDS, records)

    return updatedRecord
  } catch (error) {
    console.error("Update maintenance record error:", error)
    throw error
  }
}

// Delete maintenance record
export const deleteMaintenanceRecord = async (id: string): Promise<void> => {
  try {
    const records = (await getItem<MaintenanceRecord[]>(STORAGE_KEYS.MAINTENANCE_RECORDS)) || []

    const updatedRecords = records.filter((record) => record.id !== id)
    await setItem(STORAGE_KEYS.MAINTENANCE_RECORDS, updatedRecords)
  } catch (error) {
    console.error("Delete maintenance record error:", error)
    throw error
  }
}

// Calculate total maintenance cost for a user
export const calculateTotalMaintenanceCost = async (userId: string): Promise<number> => {
  try {
    const records = await getAllMaintenanceRecords(userId)
    return records.reduce((total, record) => total + record.cost, 0)
  } catch (error) {
    console.error("Calculate total maintenance cost error:", error)
    throw error
  }
}

// Generate maintenance reminder based on last service
export const generateMaintenanceReminder = async (userId: string, serviceType: string): Promise<void> => {
  try {
    const records = await getAllMaintenanceRecords(userId)

    // Find the most recent record of the specified service type
    const serviceRecords = records.filter((record) => record.service === serviceType)

    if (serviceRecords.length > 0) {
      const lastService = serviceRecords[0] // Already sorted by date desc

      // Create a reminder notification
      await createNotification({
        user_id: userId,
        type: "reminder",
        payload: {
          service_type: serviceType,
          last_service_date: lastService.date,
        },
        read: false,
      })
    }
  } catch (error) {
    console.error("Generate maintenance reminder error:", error)
    throw error
  }
}
