import { useState, useRef } from "react"
import { StyleSheet, View, Text, ScrollView, Alert, ActivityIndicator, Keyboard, TouchableWithoutFeedback } from "react-native"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useAuth } from "../../hooks/useAuth"
import Header from "../../components/ui/Header"
import Button from "../../components/ui/Button"
import { createAppointment } from "../../services/appointments"
import { colors } from "../../styles/colors"
import Input from "../../components/ui/Input"
import Select from "../../components/ui/Select"

const serviceTypes = [
  { label: "Entretien régulier", value: "regular_maintenance" },
  { label: "Changement d'huile", value: "oil_change" },
  { label: "Inspection des freins", value: "brake_inspection" },
  { label: "Changement de pneus", value: "tire_change" },
  { label: "Diagnostic complet", value: "full_diagnostic" },
]

const timeSlots = [
  { label: "9:00", value: "09:00" },
  { label: "10:00", value: "10:00" },
  { label: "11:00", value: "11:00" },
  { label: "14:00", value: "14:00" },
  { label: "15:00", value: "15:00" },
  { label: "16:00", value: "16:00" },
]

export default function NewAppointmentScreen() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [serviceType, setServiceType] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [formErrors, setFormErrors] = useState({
    serviceType: false,
    selectedDate: false,
    selectedTime: false
  })

  // Refs pour les champs du formulaire
  const datePickerRef = useRef(null)
  const timePickerRef = useRef(null) 
  const notesInputRef = useRef(null)

  // Get tomorrow's date as the minimum selectable date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  // Get date 3 months from now as the maximum selectable date
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 3)
  const maxDateStr = maxDate.toISOString().split("T")[0]

  const validateForm = () => {
    // Mettre à jour les états d'erreur
    const errors = {
      serviceType: !serviceType,
      selectedDate: !selectedDate,
      selectedTime: !selectedTime
    }
    
    setFormErrors(errors)
    
    // Retourner true si pas d'erreurs
    return !Object.values(errors).some(isError => isError)
  }

  const handleCreateAppointment = async () => {
    // Fermer le clavier au cas où il serait ouvert
    Keyboard.dismiss()
    
    // Valider le formulaire
    if (!validateForm()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires")
      return
    }

    if (!user) {
      Alert.alert("Erreur", "Vous devez être connecté pour prendre un rendez-vous")
      return
    }

    setIsLoading(true)
    try {
      const scheduledAt = `${selectedDate}T${selectedTime}:00`
      await createAppointment({
        user_id: user.id,
        service_type: serviceType,
        scheduled_at: scheduledAt,
        status: "pending",
        notes: notes,
      })

      Alert.alert("Succès", "Votre rendez-vous a été créé avec succès", [
        { text: "OK", onPress: () => router.replace("/appointments") },
      ])
    } catch (error) {
      console.error("Error creating appointment:", error)
      Alert.alert("Erreur", "Une erreur est survenue lors de la création du rendez-vous")
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

  const renderDatePickerFallback = () => {
    // Get next 14 days as options
    const dateOptions = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const formattedDate = new Date(dateString).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
      
      dateOptions.push({ label: formattedDate, value: dateString });
    }
    
    return (
      <Select
        ref={datePickerRef}
        placeholder="Sélectionnez une date"
        items={dateOptions}
        value={selectedDate}
        onValueChange={(value) => {
          setSelectedDate(value)
          // Effacer l'erreur si la valeur est sélectionnée
          if (value) setFormErrors(prev => ({...prev, selectedDate: false}))
        }}
        hasError={formErrors.selectedDate}
        onSubmitEditing={() => timePickerRef.current?.focus()}
        returnKeyType="next"
      />
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Header title="Nouveau rendez-vous" showBackButton />

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Type de service</Text>
          <Select
            placeholder="Sélectionnez un service"
            items={serviceTypes}
            value={serviceType}
            onValueChange={(value) => {
              setServiceType(value)
              if (value) setFormErrors(prev => ({...prev, serviceType: false}))
            }}
            hasError={formErrors.serviceType}
            returnKeyType="next"
            onSubmitEditing={() => datePickerRef.current?.focus()}
          />

          <Text style={styles.sectionTitle}>Date</Text>
          {renderDatePickerFallback()}

          {selectedDate && (
            <>
              <Text style={styles.sectionTitle}>Heure</Text>
              <Select
                ref={timePickerRef}
                placeholder="Sélectionnez une heure"
                items={timeSlots}
                value={selectedTime}
                onValueChange={(value) => {
                  setSelectedTime(value)
                  if (value) setFormErrors(prev => ({...prev, selectedTime: false}))
                }}
                hasError={formErrors.selectedTime}
                returnKeyType="next"
                onSubmitEditing={() => notesInputRef.current?.focus()}
              />
            </>
          )}

          <Text style={styles.sectionTitle}>Notes (optionnel)</Text>
          <Input
            ref={notesInputRef}
            placeholder="Ajoutez des détails supplémentaires..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            style={styles.notesInput}
            returnKeyType="done"
            blurOnSubmit={true}
          />

          <Button
            title="Confirmer le rendez-vous"
            onPress={handleCreateAppointment}
            isLoading={isLoading}
            style={styles.submitButton}
            disabled={isLoading}
          />
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
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
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: colors.text,
  },
  calendar: {
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 40,
  },
})