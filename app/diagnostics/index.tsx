import { useEffect, useState } from "react"
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useAuth } from "../../hooks/useAuth"
import Header  from "../../components/ui/Header"
import Button  from "../../components/ui/Button"
import DiagnosticItem  from "../../components/ui/DiagnosticItem"
import { getAllDiagnostics } from "../../services/diagnostics"
import { colors } from "../../styles/colors"
import type { Diagnostic } from "../../types"

export default function DiagnosticsScreen() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all")

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login")
      return
    }

    const loadDiagnostics = async () => {
      try {
        setIsLoading(true)
        if (user) {
          const data = await getAllDiagnostics(user.id)
          setDiagnostics(data)
        }
      } catch (error) {
        console.error("Error loading diagnostics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDiagnostics()
  }, [isAuthenticated, user])

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  const filteredDiagnostics =
    filter === "all" ? diagnostics : diagnostics.filter((diagnostic) => diagnostic.status === filter)

  const renderFilterButton = (filterType: "all" | "pending" | "in_progress" | "completed", label: string) => (
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
      <Header title="Diagnostics" showBackButton />

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderFilterButton("all", "Tous")}
          {renderFilterButton("pending", "En attente")}
          {renderFilterButton("in_progress", "En cours")}
          {renderFilterButton("completed", "Terminés")}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredDiagnostics.length > 0 ? (
        <FlatList
          data={filteredDiagnostics}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/diagnostics/${item.id}`)}>
              <DiagnosticItem diagnostic={item} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun diagnostic {filter !== "all" ? `${filter}` : ""}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Nouveau diagnostic" onPress={() => router.push("/diagnostics/new")} />
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
