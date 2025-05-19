import type React from "react"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { ChevronLeft } from "../../utils/icons"
import { colors } from "../../styles/colors"

interface HeaderProps {
  title: string
  showBackButton?: boolean
  rightComponent?: React.ReactNode
}

const Header = ({ title, showBackButton = false, rightComponent }: HeaderProps) => {
  const router = useRouter()

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.rightContainer}>{rightComponent}</View>
    </View>
  )
}
export default Header
const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 40, // For status bar
  },
  leftContainer: {
    position: "absolute",
    left: 16,
  },
  rightContainer: {
    position: "absolute",
    right: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  backButton: {
    padding: 4,
  },
})
