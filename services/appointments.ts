import { getItem, setItem, STORAGE_KEYS } from "./storage"
import type { Appointment } from "../types"
import { generateUUID } from "../utils/uuid"
import { createNotification } from "./notifications"

// Get all appointments for a user
export const getAllAppointments = async (userId: string): Promise<Appointment[]> => {
  try {
    const appointments = (await getItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS)) || []
    return appointments.filter((appointment) => appointment.user_id === userId)
  } catch (error) {
    console.error("Get all appointments error:", error)
    throw error
  }
}

// Get upcoming appointments for a user
export const getUpcomingAppointments = async (userId: string): Promise<Appointment[]> => {
  try {
    const appointments = await getAllAppointments(userId)
    const now = new Date().toISOString()

    return appointments
      .filter(
        (appointment) =>
          (appointment.status === "pending" || appointment.status === "confirmed") && appointment.scheduled_at > now,
      )
      .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
  } catch (error) {
    console.error("Get upcoming appointments error:", error)
    throw error
  }
}

// Get appointment by ID
export const getAppointmentById = async (id: string): Promise<Appointment | null> => {
  try {
    const appointments = (await getItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS)) || []
    return appointments.find((appointment) => appointment.id === id) || null
  } catch (error) {
    console.error("Get appointment by ID error:", error)
    throw error
  }
}

// Create a new appointment
export const createAppointment = async (appointmentData: Partial<Appointment>): Promise<Appointment> => {
  try {
    const appointments = (await getItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS)) || []

    const newAppointment: Appointment = {
      id: generateUUID(),
      user_id: appointmentData.user_id || "",
      service_type: appointmentData.service_type || "",
      scheduled_at: appointmentData.scheduled_at || new Date().toISOString(),
      status: appointmentData.status || "pending",
      notes: appointmentData.notes || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    appointments.push(newAppointment)
    await setItem(STORAGE_KEYS.APPOINTMENTS, appointments)

    // Create notification for the new appointment
    await createNotification({
      user_id: newAppointment.user_id,
      type: "appointment",
      payload: {
        appointment_id: newAppointment.id,
        service_type: newAppointment.service_type,
        date: newAppointment.scheduled_at,
        status: newAppointment.status,
      },
      read: false,
    })

    return newAppointment
  } catch (error) {
    console.error("Create appointment error:", error)
    throw error
  }
}

// Update appointment status
export const updateAppointmentStatus = async (
  id: string,
  status: "pending" | "confirmed" | "completed" | "cancelled",
): Promise<Appointment> => {
  try {
    const appointments = (await getItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS)) || []

    const appointmentIndex = appointments.findIndex((appointment) => appointment.id === id)
    if (appointmentIndex === -1) {
      throw new Error("Appointment not found")
    }

    const updatedAppointment = {
      ...appointments[appointmentIndex],
      status,
      updated_at: new Date().toISOString(),
    }

    appointments[appointmentIndex] = updatedAppointment
    await setItem(STORAGE_KEYS.APPOINTMENTS, appointments)

    // Create notification for status update
    await createNotification({
      user_id: updatedAppointment.user_id,
      type: "appointment",
      payload: {
        appointment_id: updatedAppointment.id,
        service_type: updatedAppointment.service_type,
        date: updatedAppointment.scheduled_at,
        status: updatedAppointment.status,
      },
      read: false,
    })

    return updatedAppointment
  } catch (error) {
    console.error("Update appointment status error:", error)
    throw error
  }
}

// Update appointment details
export const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<Appointment> => {
  try {
    const appointments = (await getItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS)) || []

    const appointmentIndex = appointments.findIndex((appointment) => appointment.id === id)
    if (appointmentIndex === -1) {
      throw new Error("Appointment not found")
    }

    const updatedAppointment = {
      ...appointments[appointmentIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    }

    // Don't allow updating certain fields
    delete (updatedAppointment as any).id
    delete (updatedAppointment as any).user_id
    delete (updatedAppointment as any).created_at

    appointments[appointmentIndex] = updatedAppointment
    await setItem(STORAGE_KEYS.APPOINTMENTS, appointments)

    return updatedAppointment
  } catch (error) {
    console.error("Update appointment error:", error)
    throw error
  }
}

// Delete appointment
export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    const appointments = (await getItem<Appointment[]>(STORAGE_KEYS.APPOINTMENTS)) || []

    const updatedAppointments = appointments.filter((appointment) => appointment.id !== id)
    await setItem(STORAGE_KEYS.APPOINTMENTS, updatedAppointments)
  } catch (error) {
    console.error("Delete appointment error:", error)
    throw error
  }
}
