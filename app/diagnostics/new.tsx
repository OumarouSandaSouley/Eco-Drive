"use client"

import { useState } from "react"
import { StyleSheet, View, Text, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useAuth } from "../../hooks/useAuth"
import Header  from "../../components/ui/Header"
import Input  from "../../components/ui/Input"
import Button  from "../../components/ui/Button"
import Checkbox  from "../../components/ui/Checkbox"
import { createDiagnostic } from "../../services/diagnostics"
import { colors } from "../../styles/colors"

const commonSymptoms = [
  { id: "1", label: "Bruit anormal du moteur" },
  { id: "2", label: "Vibrations" },
  { id: "3", label: "Difficulté au démarrage" },
  { id: "4", label: "Voyant moteur allumé" },
  { id: "5", label: "Consommation excessive" },
  { id: "6", label: "Fumée à l'échappement" },
  { id: "7", label: "Freinage inefficace" },
  { id: "8", label: "Direction difficile" },
  { id: "9", label: "Problème de climatisation" },
  { id: "10", label: "Batterie faible" },
]

export default function NewDiagnosticScreen() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const toggleSymptom = (symptomLabel: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomLabel) ? prev.filter((s) => s !== symptomLabel) : [...prev, symptomLabel],
    )
  }

  const handleCreateDiagnostic = async () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert("Erreur", "Veuillez sélectionner au moins un symptôme")
      return
    }

    if (!user) {
      Alert.alert("Erreur", "Vous devez être connecté pour créer un diagnostic")
      return
    }

    setIsLoading(true)
    try {
      await createDiagnostic({
        user_id: user.id,
        symptoms: selectedSymptoms,
        mechanic_id: null,
        recommendations: "",
        date: new Date().toISOString(),
        status: "pending",
        description: description,
      })

      Alert.alert("Succès", "Votre demande de diagnostic a été envoyée avec succès", [
        { text: "OK", onPress: () => router.replace("/diagnostics") },
      ])
    } catch (error) {
      console.error("Error creating diagnostic:", error)
      Alert.alert("Erreur", "Une erreur est survenue lors de la création du diagnostic")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header title="Nouveau diagnostic" showBackButton />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Sélectionnez les symptômes</Text>
        <Text style={styles.sectionDescription}>Cochez tous les symptômes que vous observez sur votre véhicule</Text>

        <View style={styles.symptomsContainer}>
          {commonSymptoms.map((symptom) => (
            <TouchableOpacity key={symptom.id} style={styles.symptomRow} onPress={() => toggleSymptom(symptom.label)}>
              <Checkbox
                checked={selectedSymptoms.includes(symptom.label)}
                onValueChange={() => toggleSymptom(symptom.label)}
              />
              <Text style={styles.symptomLabel}>{symptom.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Description détaillée</Text>
        <Text style={styles.sectionDescription}>Décrivez le problème avec plus de détails (optionnel)</Text>

        <Input
          placeholder="Décrivez quand et comment le problème se manifeste..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={styles.descriptionInput}
        />

        <Button
          title="Envoyer la demande de diagnostic"
          onPress={handleCreateDiagnostic}
          isLoading={isLoading}
          style={styles.submitButton}
          disabled={selectedSymptoms.length === 0}
        />
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
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: colors.text,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  symptomsContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  symptomRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  symptomLabel: {
    fontSize: 16,
    marginLeft: 12,
    color: colors.text,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: "top",
    marginBottom: 24,
  },
  submitButton: {
    marginBottom: 40,
  },
})
