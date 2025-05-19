import { getItem, setItem, STORAGE_KEYS } from "./storage"
import type { Diagnostic } from "../types"
import { generateUUID } from "../utils/uuid"
import { createNotification } from "./notifications"

// Get all diagnostics for a user
export const getAllDiagnostics = async (userId: string): Promise<Diagnostic[]> => {
  try {
    const diagnostics = (await getItem<Diagnostic[]>(STORAGE_KEYS.DIAGNOSTICS)) || []
    return diagnostics
      .filter((diagnostic) => diagnostic.user_id === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error("Get all diagnostics error:", error)
    throw error
  }
}

// Get diagnostic by ID
export const getDiagnosticById = async (id: string): Promise<Diagnostic | null> => {
  try {
    const diagnostics = (await getItem<Diagnostic[]>(STORAGE_KEYS.DIAGNOSTICS)) || []
    return diagnostics.find((diagnostic) => diagnostic.id === id) || null
  } catch (error) {
    console.error("Get diagnostic by ID error:", error)
    throw error
  }
}

// Create a new diagnostic
export const createDiagnostic = async (diagnosticData: Partial<Diagnostic>): Promise<Diagnostic> => {
  try {
    const diagnostics = (await getItem<Diagnostic[]>(STORAGE_KEYS.DIAGNOSTICS)) || []

    const newDiagnostic: Diagnostic = {
      id: generateUUID(),
      user_id: diagnosticData.user_id || "",
      symptoms: diagnosticData.symptoms || [],
      mechanic_id: diagnosticData.mechanic_id || null,
      recommendations: diagnosticData.recommendations || "",
      date: diagnosticData.date || new Date().toISOString(),
      status: diagnosticData.status || "pending",
      description: diagnosticData.description || "",
    }

    diagnostics.push(newDiagnostic)
    await setItem(STORAGE_KEYS.DIAGNOSTICS, diagnostics)

    // Create notification for the new diagnostic
    await createNotification({
      user_id: newDiagnostic.user_id,
      type: "diagnostic",
      payload: {
        diagnostic_id: newDiagnostic.id,
        status: newDiagnostic.status,
      },
      read: false,
    })

    return newDiagnostic
  } catch (error) {
    console.error("Create diagnostic error:", error)
    throw error
  }
}

// Update diagnostic status
export const updateDiagnosticStatus = async (
  id: string,
  status: "pending" | "in_progress" | "completed",
): Promise<Diagnostic> => {
  try {
    const diagnostics = (await getItem<Diagnostic[]>(STORAGE_KEYS.DIAGNOSTICS)) || []

    const diagnosticIndex = diagnostics.findIndex((diagnostic) => diagnostic.id === id)
    if (diagnosticIndex === -1) {
      throw new Error("Diagnostic not found")
    }

    const updatedDiagnostic = {
      ...diagnostics[diagnosticIndex],
      status,
    }

    diagnostics[diagnosticIndex] = updatedDiagnostic
    await setItem(STORAGE_KEYS.DIAGNOSTICS, diagnostics)

    // Create notification for status update
    await createNotification({
      user_id: updatedDiagnostic.user_id,
      type: "diagnostic",
      payload: {
        diagnostic_id: updatedDiagnostic.id,
        status: updatedDiagnostic.status,
      },
      read: false,
    })

    return updatedDiagnostic
  } catch (error) {
    console.error("Update diagnostic status error:", error)
    throw error
  }
}

// Update diagnostic with recommendations
export const updateDiagnosticWithRecommendations = async (
  id: string,
  mechanicId: string,
  recommendations: string,
): Promise<Diagnostic> => {
  try {
    const diagnostics = (await getItem<Diagnostic[]>(STORAGE_KEYS.DIAGNOSTICS)) || []

    const diagnosticIndex = diagnostics.findIndex((diagnostic) => diagnostic.id === id)
    if (diagnosticIndex === -1) {
      throw new Error("Diagnostic not found")
    }

    const updatedDiagnostic = {
      ...diagnostics[diagnosticIndex],
      mechanic_id: mechanicId,
      recommendations,
      status: "completed" as const,
    }

    diagnostics[diagnosticIndex] = updatedDiagnostic
    await setItem(STORAGE_KEYS.DIAGNOSTICS, diagnostics)

    // Create notification for completed diagnostic
    await createNotification({
      user_id: updatedDiagnostic.user_id,
      type: "diagnostic",
      payload: {
        diagnostic_id: updatedDiagnostic.id,
        status: "completed",
      },
      read: false,
    })

    return updatedDiagnostic
  } catch (error) {
    console.error("Update diagnostic with recommendations error:", error)
    throw error
  }
}

// Delete diagnostic
export const deleteDiagnostic = async (id: string): Promise<void> => {
  try {
    const diagnostics = (await getItem<Diagnostic[]>(STORAGE_KEYS.DIAGNOSTICS)) || []

    const updatedDiagnostics = diagnostics.filter((diagnostic) => diagnostic.id !== id)
    await setItem(STORAGE_KEYS.DIAGNOSTICS, updatedDiagnostics)
  } catch (error) {
    console.error("Delete diagnostic error:", error)
    throw error
  }
}
