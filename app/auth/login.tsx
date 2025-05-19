import { useState, useRef } from "react"
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useAuth } from "../../hooks/useAuth"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"
import { colors } from "../../styles/colors"

export default function LoginScreen() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  
  // Références pour les inputs pour naviguer entre eux
  const emailInputRef = useRef(null)
  const passwordInputRef = useRef(null)

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "L'email est requis"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email invalide"
    }

    if (!password) {
      newErrors.password = "Le mot de passe est requis"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    // Masquer le clavier avant de procéder
    Keyboard.dismiss()
    
    if (!validate()) return

    setIsLoading(true)
    try {
      console.log("Tentative de connexion avec:", email, password)
      await login(email, password)
      router.replace("/")
    } catch (error) {
      console.error("Erreur de connexion:", error)
      Alert.alert("Erreur de connexion", "Email ou mot de passe incorrect. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToRegister = () => {
    // Masquer le clavier avant de naviguer
    Keyboard.dismiss()
    console.log("Navigation vers inscription")
    router.push("/auth/register")
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <StatusBar style="auto" />
      
      {/* Le TouchableWithoutFeedback permet de fermer le clavier en touchant ailleurs */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>ÉcoDrive</Text>
            <Text style={styles.tagline}>Votre assistant de maintenance automobile</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Connexion</Text>

            <Input
              ref={emailInputRef}
              label="Email"
              placeholder="votre@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              blurOnSubmit={false}
            />

            <Input
              ref={passwordInputRef}
              label="Mot de passe"
              placeholder="Votre mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              blurOnSubmit={true}
            />

            <Button 
              title="Se connecter" 
              onPress={handleLogin} 
              isLoading={isLoading} 
              style={styles.loginButton} 
              disabled={isLoading}
            />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Vous n'avez pas de compte ?</Text>
              <TouchableOpacity 
                onPress={navigateToRegister}
                disabled={isLoading}
                style={styles.registerTouchable}  // Augmenter la zone tactile
              >
                <Text style={styles.registerLink}>S'inscrire</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: colors.text,
  },
  loginButton: {
    marginTop: 16,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    paddingVertical: 10,  // Augmenter la zone tactile verticalement
  },
  registerText: {
    color: colors.textSecondary,
  },
  registerLink: {
    color: colors.primary,
    fontWeight: "bold",
    marginLeft: 5,
  },
  registerTouchable: {
    padding: 5,  // Augmenter la zone tactile
  }
})