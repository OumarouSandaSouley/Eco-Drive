import { StyleSheet, View, Text } from "react-native"
import { Search } from "../../utils/icons"
import { colors } from "../../styles/colors"
import type { Diagnostic } from "../../types"
import { formatDate } from "../../utils/dateUtils"

interface DiagnosticItemProps {
  diagnostic: Diagnostic
}

const DiagnosticItem = ({ diagnostic }: DiagnosticItemProps) => {
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
      <View style={styles.iconContainer}>
        <Search size={24} color={colors.primary} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Diagnostic</Text>
        <Text style={styles.symptoms}>
          {diagnostic.symptoms.length > 0
            ? diagnostic.symptoms.slice(0, 2).join(", ") + (diagnostic.symptoms.length > 2 ? "..." : "")
            : "Aucun symptôme spécifié"}
        </Text>
        <Text style={styles.date}>{formatDate(diagnostic.date)}</Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(diagnostic.status) }]}>
          {getStatusText(diagnostic.status)}
        </Text>
      </View>
    </View>
  )
}
export default DiagnosticItem;
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
  iconContainer: {
    marginRight: 16,
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  symptoms: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  statusContainer: {
    justifyContent: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
})
