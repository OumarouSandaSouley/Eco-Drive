import { StyleSheet, View, Text } from "react-native"
import { Tool } from "../../utils/icons"
import { colors } from "../../styles/colors"
import type { MaintenanceRecord } from "../../types"
import { formatDate } from "../../utils/dateUtils"

interface MaintenanceItemProps {
  record: MaintenanceRecord
}

const  MaintenanceItem = ({ record }: MaintenanceItemProps) =>{
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Tool size={24} color={colors.primary} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.serviceType}>{record.service}</Text>
        <Text style={styles.dateTime}>{formatDate(record.date)}</Text>
      </View>

      <View style={styles.costContainer}>
        <Text style={styles.cost}>{record.cost.toFixed(2)} €</Text>
      </View>
    </View>
  )
}
export default MaintenanceItem;
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
  costContainer: {
    justifyContent: "center",
  },
  cost: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
})
