// User model
export interface User {
  id: string
  email: string
  name: string
  password_hash: string
  role: "admin" | "mechanic" | "user"
  created_at: string
  updated_at: string
}

// Appointment model
export interface Appointment {
  id: string
  user_id: string
  service_type: string
  scheduled_at: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  notes?: string
  created_at: string
  updated_at: string
}

// Maintenance record model
export interface MaintenanceRecord {
  id: string
  user_id: string
  date: string
  service: string
  parts_replaced: string[]
  cost: number
  mechanic_notes: string
  created_at: string
}

// Notification model
export interface Notification {
  id: string
  user_id: string
  type: "reminder" | "appointment" | "maintenance" | "diagnostic"
  payload: Record<string, any>
  read: boolean
  created_at: string
}

// Diagnostic model
export interface Diagnostic {
  id: string
  user_id: string
  symptoms: string[]
  mechanic_id: string | null
  recommendations: string
  date: string
  status: "pending" | "in_progress" | "completed"
  description?: string
}
