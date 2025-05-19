import { useEffect, useState } from "react"
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useAuth } from "../../hooks/useAuth"
import Header  from "../../components/ui/Header"
import MaintenanceItem  from "../../components/ui/MaintenanceItem"
import { getAllMaintenanceRecords } from "../../services/maintenance"
import { colors } from "../../styles/colors"
import type { MaintenanceRecord } from "../../types"

export default function MaintenanceScreen() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [records, setRecords] = useState<MaintenanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalCost, setTotalCost] = useState(0)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login")
      return
    }

    const loadRecords = async () => {
      try {
        setIsLoading(true)
        if (user) {
          const data = await getAllMaintenanceRecords(user.id)
          setRecords(data)

          // Calculate total cost
          const total = data.reduce((sum, record) => sum + record.cost, 0)
          setTotalCost(total)
        }
      } catch (error) {
        console.error("Error loading maintenance records:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRecords()
  }, [isAuthenticated, user])

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header title="Historique d'entretien" showBackButton />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total des entretiens</Text>
              <Text style={styles.summaryValue}>{records.length}</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Coût total</Text>
              <Text style={styles.summaryValue}>{totalCost.toFixed(2)} €</Text>
            </View>
          </View>

          {records.length > 0 ? (
            <FlatList
              data={records}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => router.push(`/maintenance/${item.id}`)}>
                  <MaintenanceItem record={item} />
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun historique d'entretien</Text>
              <TouchableOpacity style={styles.appointmentButton} onPress={() => router.push("/appointments/new")}>
                <Text style={styles.appointmentButtonText}>Prendre rendez-vous</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
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
  summaryContainer: {
    flexDirection: "row",
    padding: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  appointmentButton: {
    padding: 12,
  },
  appointmentButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "500",
  },
})
