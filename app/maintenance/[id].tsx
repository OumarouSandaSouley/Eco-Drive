import { useEffect, useState } from "react"
import { StyleSheet, View, Text, ScrollView, Alert, ActivityIndicator } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useAuth } from "../../hooks/useAuth"
import Header  from "../../components/ui/Header"
import Card  from "../../components/ui/Card"
import { getMaintenanceRecordById } from "../../services/maintenance"
import { colors } from "../../styles/colors"
import type { MaintenanceRecord } from "../../types"
import { formatDate } from "../../utils/dateUtils"

export default function MaintenanceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [record, setRecord] = useState<MaintenanceRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login")
      return
    }

    const loadRecord = async () => {
      try {
        setIsLoading(true)
        if (id) {
          const data = await getMaintenanceRecordById(id)
          setRecord(data)
        }
      } catch (error) {
        console.error("Error loading maintenance record:", error)
        Alert.alert("Erreur", "Impossible de charger les détails de l'entretien")
      } finally {
        setIsLoading(false)
      }
    }

    loadRecord()
  }, [id, isAuthenticated])

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (!record) {
    return (
      <View style={styles.container}>
        <Header title="Détails de l'entretien" showBackButton />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Entretien non trouvé</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header title="Détails de l'entretien" showBackButton />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Informations</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Service</Text>
            <Text style={styles.infoValue}>{record.service}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>{formatDate(record.date)}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Coût</Text>
            <Text style={styles.infoValue}>{record.cost.toFixed(2)} €</Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Pièces remplacées</Text>

          {record.parts_replaced.length > 0 ? (
            <View style={styles.partsList}>
              {record.parts_replaced.map((part, index) => (
                <View key={index} style={styles.partItem}>
                  <Text style={styles.partText}>{part}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>Aucune pièce remplacée</Text>
          )}
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Notes du mécanicien</Text>

          {record.mechanic_notes ? (
            <Text style={styles.notesText}>{record.mechanic_notes}</Text>
          ) : (
            <Text style={styles.emptyText}>Aucune note</Text>
          )}
        </Card>
      </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  content: {
    padding: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: colors.text,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  partsList: {
    marginTop: 8,
  },
  partItem: {
    backgroundColor: colors.lightBackground,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  partText: {
    fontSize: 16,
    color: colors.text,
  },
  notesText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
})
