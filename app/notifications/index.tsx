import { useEffect, useState } from "react"
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useAuth } from "../../hooks/useAuth"
import Header  from "../../components/ui/Header"
import NotificationItem  from "../../components/ui/NotificationItem"
import { getAllNotifications, markAllNotificationsAsRead } from "../../services/notifications"
import { colors } from "../../styles/colors"
import type { Notification } from "../../types"

export default function NotificationsScreen() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login")
      return
    }

    const loadNotifications = async () => {
      try {
        setIsLoading(true)
        if (user) {
          const data = await getAllNotifications(user.id)
          setNotifications(data)
        }
      } catch (error) {
        console.error("Error loading notifications:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadNotifications()
  }, [isAuthenticated, user])

  const handleMarkAllAsRead = async () => {
    try {
      if (user) {
        await markAllNotificationsAsRead(user.id)
        setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
      }
    } catch (error) {
      console.error("Error marking notifications as read:", error)
    }
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header title="Notifications" showBackButton />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : notifications.length > 0 ? (
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.notificationCount}>
              {unreadCount} notification{unreadCount !== 1 ? "s" : ""} non lue{unreadCount !== 1 ? "s" : ""}
            </Text>
            {unreadCount > 0 && (
              <TouchableOpacity onPress={handleMarkAllAsRead}>
                <Text style={styles.markAllRead}>Tout marquer comme lu</Text>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <NotificationItem notification={item} />}
            contentContainerStyle={styles.listContent}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucune notification</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  notificationCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  markAllRead: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
})
