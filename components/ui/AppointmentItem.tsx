import { StyleSheet, View, Text } from "react-native"
import { Calendar } from "../../utils/icons"
import { colors } from "../../styles/colors"
import type { Appointment } from "../../types"
import { formatDate, formatTime } from "../../utils/dateUtils"

interface AppointmentItemProps {
  appointment: Appointment
}

const  AppointmentItem = ({ appointment }: AppointmentItemProps) =>{
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return colors.warning
      case "confirmed":
        return colors.success
      case "completed":
        return colors.info
      case "cancelled":
        return colors.error
      default:
        return colors.textSecondary
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente"
      case "confirmed":
        return "Confirmé"
      case "completed":
        return "Terminé"
      case "cancelled":
        return "Annulé"
      default:
        return status
    }
  }

  const getServiceTypeText = (type: string) => {
    switch (type) {
      case "regular_maintenance":
        return "Entretien régulier"
      case "oil_change":
        return "Changement d'huile"
      case "brake_inspection":
        return "Inspection des freins"
      case "tire_change":
        return "Changement de pneus"
      case "full_diagnostic":
        return "Diagnostic complet"
      default:
        return type
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Calendar size={24} color={colors.primary} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.serviceType}>{getServiceTypeText(appointment.service_type)}</Text>
        <Text style={styles.dateTime}>
          {formatDate(appointment.scheduled_at)} à {formatTime(appointment.scheduled_at)}
        </Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
          {getStatusText(appointment.status)}
        </Text>
      </View>
    </View>
  )
}
export default AppointmentItem;

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
  serviceType: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    color: colors.textSecondary,
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
