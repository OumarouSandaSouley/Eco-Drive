import { useState } from "react"
import { StyleSheet, View, Text, ScrollView, Alert, Switch, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useAuth } from "../../hooks/useAuth"
import Header  from "../../components/ui/Header"
import Card  from "../../components/ui/Card"
import Button  from "../../components/ui/Button"
import { colors } from "../../styles/colors"

export default function SettingsScreen() {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [reminderEnabled, setReminderEnabled] = useState(true)

  if (!isAuthenticated || !user) {
    router.replace("/auth/login")
    return null
  }

  const handleLogout = async () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnecter",
        style: "destructive",
        onPress: async () => {
          await logout()
          router.replace("/auth/login")
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header title="Paramètres" showBackButton />

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Notifications</Text>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Notifications push</Text>
              <Text style={styles.settingDescription}>Recevoir des notifications sur votre appareil</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#d1d1d1", true: colors.primaryLight }}
              thumbColor={notificationsEnabled ? colors.primary : "#f4f3f4"}
            />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Rappels d'entretien</Text>
              <Text style={styles.settingDescription}>Recevoir des rappels pour l'entretien de votre véhicule</Text>
            </View>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              trackColor={{ false: "#d1d1d1", true: colors.primaryLight }}
              thumbColor={reminderEnabled ? colors.primary : "#f4f3f4"}
            />
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Compte</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Modifier le profil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Changer le mot de passe</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Confidentialité et sécurité</Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>À propos</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Conditions d'utilisation</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Politique de confidentialité</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Version de l'application</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </TouchableOpacity>
        </Card>

        <Button title="Déconnexion" onPress={handleLogout} variant="outline" style={styles.logoutButton} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
  },
  profileCard: {
    padding: 16,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: colors.textSecondary,
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
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    maxWidth: "80%",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
  },
  versionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  logoutButton: {
    marginBottom: 40,
  },
})
