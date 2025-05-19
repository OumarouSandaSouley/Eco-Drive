import { useEffect, useState } from "react"
import { StyleSheet, View, Text, ScrollView, Alert, ActivityIndicator } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useAuth } from "../../hooks/useAuth"
import  Header  from "../../components/ui/Header"
import  Card  from "../../components/ui/Card"
import  Button  from "../../components/ui/Button"
import { getDiagnosticById } from "../../services/diagnostics"
import { colors } from "../../styles/colors"
import type { Diagnostic } from "../../types"

export default function DiagnosticDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [diagnostic, setDiagnostic] = useState<Diagnostic | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login")
      return
    }

    const loadDiagnostic = async () => {
      try {
        setIsLoading(true)
        if (id) {
          const data = await getDiagnosticById(id)
          setDiagnostic(data)
        }
      } catch (error) {
        console.error("Error loading diagnostic:", error)
        Alert.alert("Erreur", "Impossible de charger les détails du diagnostic")
      } finally {
        setIsLoading(false)
      }
    }

    loadDiagnostic()
  }, [id, isAuthenticated])

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (!diagnostic) {
    return (
      <View style={styles.container}>
        <Header title="Détails du diagnostic" showBackButton />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Diagnostic non trouvé</Text>
        </View>
      </View>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return colors.warning
      case "in_progress":
        return colors.info
      case "completed":
        return colors.success
      default:
        return colors.textSecondary
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente"
      case "in_progress":
        return "En cours"
      case "completed":
        return "Terminé"
      default:
        return status
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header title="Détails du diagnostic" showBackButton />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(diagnostic.status) }]}>
            {getStatusText(diagnostic.status)}
          </Text>
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Symptômes signalés</Text>

          <View style={styles.symptomsList}>
            {diagnostic.symptoms.map((symptom, index) => (
              <View key={index} style={styles.symptomItem}>
                <Text style={styles.symptomText}>{symptom}</Text>
              </View>
            ))}
          </View>

          {diagnostic.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionLabel}>Description</Text>
              <Text style={styles.descriptionText}>{diagnostic.description}</Text>
            </View>
          )}
        </Card>

        {diagnostic.status === "completed" && diagnostic.recommendations && (
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Recommandations</Text>
            <Text style={styles.recommendationsText}>{diagnostic.recommendations}</Text>
          </Card>
        )}

        {diagnostic.status === "completed" && (
          <Button
            title="Prendre rendez-vous"
            onPress={() => router.push("/appointments/new")}
            style={styles.appointmentButton}
          />
        )}

        {diagnostic.status === "pending" && (
          <Text style={styles.pendingText}>
            Notre équipe de mécaniciens analysera votre demande dans les plus brefs délais.
          </Text>
        )}
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
  statusContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    color: "#fff",
    fontWeight: "bold",
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
  symptomsList: {
    marginBottom: 16,
  },
  symptomItem: {
    backgroundColor: colors.lightBackground,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  symptomText: {
    fontSize: 16,
    color: colors.text,
  },
  descriptionContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 16,
    marginTop: 8,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: colors.text,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  recommendationsText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  appointmentButton: {
    marginBottom: 24,
  },
  pendingText: {
    textAlign: "center",
    fontSize: 16,
    color: colors.textSecondary,
    fontStyle: "italic",
    marginTop: 16,
    marginBottom: 24,
  },
})
