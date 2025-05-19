import { getItem, setItem, STORAGE_KEYS } from "./storage"
import type { Notification } from "../types"
import { generateUUID } from "../utils/uuid"

// Get all notifications for a user
export const getAllNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const notifications = (await getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS)) || []
    return notifications
      .filter((notification) => notification.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  } catch (error) {
    console.error("Get all notifications error:", error)
    throw error
  }
}

// Get unread notifications for a user
export const getUnreadNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const notifications = await getAllNotifications(userId)
    return notifications.filter((notification) => !notification.read)
  } catch (error) {
    console.error("Get unread notifications error:", error)
    throw error
  }
}

// Create a new notification
export const createNotification = async (notificationData: Partial<Notification>): Promise<Notification> => {
  try {
    const notifications = (await getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS)) || []

    const newNotification: Notification = {
      id: generateUUID(),
      user_id: notificationData.user_id || "",
      type: notificationData.type || "reminder",
      payload: notificationData.payload || {},
      read: notificationData.read || false,
      created_at: new Date().toISOString(),
    }

    notifications.push(newNotification)
    await setItem(STORAGE_KEYS.NOTIFICATIONS, notifications)

    return newNotification
  } catch (error) {
    console.error("Create notification error:", error)
    throw error
  }
}

// Mark a notification as read
export const markNotificationAsRead = async (id: string): Promise<Notification> => {
  try {
    const notifications = (await getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS)) || []

    const notificationIndex = notifications.findIndex((notification) => notification.id === id)
    if (notificationIndex === -1) {
      throw new Error("Notification not found")
    }

    const updatedNotification = {
      ...notifications[notificationIndex],
      read: true,
    }

    notifications[notificationIndex] = updatedNotification
    await setItem(STORAGE_KEYS.NOTIFICATIONS, notifications)

    return updatedNotification
  } catch (error) {
    console.error("Mark notification as read error:", error)
    throw error
  }
}

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  try {
    const notifications = (await getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS)) || []

    const updatedNotifications = notifications.map((notification) =>
      notification.user_id === userId ? { ...notification, read: true } : notification,
    )

    await setItem(STORAGE_KEYS.NOTIFICATIONS, updatedNotifications)
  } catch (error) {
    console.error("Mark all notifications as read error:", error)
    throw error
  }
}

// Delete a notification
export const deleteNotification = async (id: string): Promise<void> => {
  try {
    const notifications = (await getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS)) || []

    const updatedNotifications = notifications.filter((notification) => notification.id !== id)
    await setItem(STORAGE_KEYS.NOTIFICATIONS, updatedNotifications)
  } catch (error) {
    console.error("Delete notification error:", error)
    throw error
  }
}

// Delete all notifications for a user
export const deleteAllNotifications = async (userId: string): Promise<void> => {
  try {
    const notifications = (await getItem<Notification[]>(STORAGE_KEYS.NOTIFICATIONS)) || []

    const updatedNotifications = notifications.filter((notification) => notification.user_id !== userId)
    await setItem(STORAGE_KEYS.NOTIFICATIONS, updatedNotifications)
  } catch (error) {
    console.error("Delete all notifications error:", error)
    throw error
  }
}
