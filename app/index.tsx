import React, { useEffect } from "react"
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native"
import { useRouter, Redirect } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useAuth } from "../hooks/useAuth"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import { getUpcomingAppointments } from "../services/appointments"
import { getRecentMaintenanceRecords } from "../services/maintenance"
import { getUnreadNotifications } from "../services/notifications"
import AppointmentItem from "../components/ui/AppointmentItem"
import MaintenanceItem  from "../components/ui/MaintenanceItem"
import NotificationItem  from "../components/ui/NotificationItem"
import { colors } from "../styles/colors"
import type { Appointment, MaintenanceRecord, Notification } from "../types"

export default function HomeScreen() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [upcomingAppointments, setUpcomingAppointments] = React.useState<Appointment[]>([])
  const [recentMaintenance, setRecentMaintenance] = React.useState<MaintenanceRecord[]>([])
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [isDataLoading, setIsDataLoading] = React.useState(true)

  useEffect(() => {
    // Only load data when authenticated
    if (isAuthenticated && user) {
      const loadData = async () => {
        try {
          setIsDataLoading(true)
          const appointments = await getUpcomingAppointments(user.id)
          const maintenance = await getRecentMaintenanceRecords(user.id)
          const notifs = await getUnreadNotifications(user.id)

          setUpcomingAppointments(appointments)
          setRecentMaintenance(maintenance)
          setNotifications(notifs)
        } catch (error) {
          console.error("Error loading home data:", error)
        } finally {
          setIsDataLoading(false)
        }
      }

      loadData()
    }
  }, [isAuthenticated, user])

  // Show loading state while checking authentication or render redirect if not authenticated
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={[styles.container, styles.loadingContainer]}>
          <Text>Loading...</Text>
        </View>
      );
    }
    
    if (!isAuthenticated) {
      return <Redirect href="/auth/login" />;
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour, {user?.name}</Text>
            <Text style={styles.subGreeting}>Bienvenue sur ÉcoDrive</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name.charAt(0) || "U"}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {notifications.length > 0 && (
          <Card style={styles.notificationCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => router.push("/notifications")}>
                <Text style={styles.seeAll}>Voir tout</Text>
              </TouchableOpacity>
            </View>
            {notifications.slice(0, 2).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </Card>
        )}

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Prochains rendez-vous</Text>
            <TouchableOpacity onPress={() => router.push("/appointments")}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {isDataLoading ? (
            <View style={styles.emptyState}>
              <Text>Chargement...</Text>
            </View>
          ) : upcomingAppointments.length > 0 ? (
            upcomingAppointments
              .slice(0, 2)
              .map((appointment) => <AppointmentItem key={appointment.id} appointment={appointment} />)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Aucun rendez-vous à venir</Text>
              <Button
                title="Prendre rendez-vous"
                onPress={() => router.push("/appointments/new")}
                style={styles.emptyStateButton}
              />
            </View>
          )}
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Historique d'entretien</Text>
            <TouchableOpacity onPress={() => router.push("/maintenance")}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {isDataLoading ? (
            <View style={styles.emptyState}>
              <Text>Chargement...</Text>
            </View>
          ) : recentMaintenance.length > 0 ? (
            recentMaintenance.slice(0, 2).map((record) => <MaintenanceItem key={record.id} record={record} />)
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Aucun historique d'entretien</Text>
            </View>
          )}
        </Card>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/appointments")}>
            <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
              <Text style={styles.actionIconText}>📅</Text>
            </View>
            <Text style={styles.actionText}>Rendez-vous</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/diagnostics")}>
            <View style={[styles.actionIcon, { backgroundColor: colors.secondary }]}>
              <Text style={styles.actionIconText}>🔍</Text>
            </View>
            <Text style={styles.actionText}>Diagnostic</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/maintenance")}>
            <View style={[styles.actionIcon, { backgroundColor: colors.accent }]}>
              <Text style={styles.actionIconText}>🔧</Text>
            </View>
            <Text style={styles.actionText}>Entretien</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {renderContent()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  subGreeting: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  notificationCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.notificationBackground,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
  },
  emptyState: {
    alignItems: "center",
    padding: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  emptyStateButton: {
    marginTop: 8,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionButton: {
    alignItems: "center",
    flex: 1,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionIconText: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
    textAlign: "center",
  },
})