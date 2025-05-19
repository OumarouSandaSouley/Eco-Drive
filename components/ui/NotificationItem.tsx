import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { colors } from "../../styles/colors"
import type { Notification } from "../../types"
import { formatRelativeTime } from "../../utils/dateUtils"
import { markNotificationAsRead } from "../../services/notifications"

interface NotificationItemProps {
  notification: Notification
}

const NotificationItem = ({ notification }: NotificationItemProps) => {
  const handlePress = async () => {
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id)
      } catch (error) {
        console.error("Error marking notification as read:", error)
      }
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return "⏰"
      case "appointment":
        return "📅"
      case "maintenance":
        return "🔧"
      case "diagnostic":
        return "🔍"
      default:
        return "📣"
    }
  }

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case "reminder":
        return "Rappel d'entretien"
      case "appointment":
        return "Rendez-vous"
      case "maintenance":
        return "Entretien"
      case "diagnostic":
        return "Diagnostic"
      default:
        return "Notification"
    }
  }

  const getNotificationMessage = (notification: Notification) => {
    const { type, payload } = notification

    switch (type) {
      case "reminder":
        return `Il est temps de planifier votre prochain entretien ${payload.service_type || "régulier"}.`
      case "appointment":
        return `Votre rendez-vous ${payload.status === "confirmed" ? "a été confirmé" : "approche"} pour le ${payload.date || "bientôt"}.`
      case "maintenance":
        return `Votre entretien ${payload.service_type || ""} a été ${payload.status || "effectué"}.`
      case "diagnostic":
        return `Votre diagnostic ${payload.status === "completed" ? "est terminé" : "a été mis à jour"}.`
      default:
        return payload.message || "Nouvelle notification"
    }
  }

  return (
    <TouchableOpacity style={[styles.container, !notification.read && styles.unreadContainer]} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{getNotificationIcon(notification.type)}</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{getNotificationTitle(notification.type)}</Text>
        <Text style={styles.message}>{getNotificationMessage(notification)}</Text>
        <Text style={styles.time}>{formatRelativeTime(notification.created_at)}</Text>
      </View>

      {!notification.read && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  )
}
export default NotificationItem;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadContainer: {
    backgroundColor: colors.notificationBackground,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightBackground,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconText: {
    fontSize: 20,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: 8,
    alignSelf: "flex-start",
    marginTop: 8,
  },
})
