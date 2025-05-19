import { useEffect, useState } from "react"
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useAuth } from "../../hooks/useAuth"
import Header  from "../../components/ui/Header"
import Button  from "../../components/ui/Button"
import AppointmentItem  from "../../components/ui/AppointmentItem"
import { getAllAppointments } from "../../services/appointments"
import { colors } from "../../styles/colors"
import type { Appointment } from "../../types"

export default function AppointmentsScreen() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "completed" | "cancelled">("all")

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login")
      return
    }

    const loadAppointments = async () => {
      try {
        setIsLoading(true)
        if (user) {
          const data = await getAllAppointments(user.id)
          setAppointments(data)
        }
      } catch (error) {
        console.error("Error loading appointments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAppointments()
  }, [isAuthenticated, user])

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  const filteredAppointments =
    filter === "all" ? appointments : appointments.filter((appointment) => appointment.status === filter)

  const renderFilterButton = (
    filterType: "all" | "pending" | "confirmed" | "completed" | "cancelled",
    label: string,
  ) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === filterType && styles.activeFilterButton]}
      onPress={() => setFilter(filterType)}
    >
      <Text style={[styles.filterButtonText, filter === filterType && styles.activeFilterButtonText]}>{label}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header title="Rendez-vous" showBackButton />

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderFilterButton("all", "Tous")}
          {renderFilterButton("pending", "En attente")}
          {renderFilterButton("confirmed", "Confirmés")}
          {renderFilterButton("completed", "Terminés")}
          {renderFilterButton("cancelled", "Annulés")}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredAppointments.length > 0 ? (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/appointments/${item.id}`)}>
              <AppointmentItem appointment={item} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun rendez-vous {filter !== "all" ? `${filter}` : ""}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Prendre rendez-vous" onPress={() => router.push("/appointments/new")} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    color: colors.text,
  },
  activeFilterButtonText: {
    color: "#fff",
  },
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  buttonContainer: {
    padding: 16,
  },
})
