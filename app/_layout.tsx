import { Stack } from "expo-router"
import { AuthProvider } from "../hooks/useAuth"
import { StatusBar } from "expo-status-bar"


export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#f5f5f5" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" options={{ gestureEnabled: false }} />
        <Stack.Screen name="auth/register" options={{ gestureEnabled: false }} />
        <Stack.Screen name="appointments" />
        <Stack.Screen name="appointments/[id]" />
        <Stack.Screen name="appointments/new" />
        <Stack.Screen name="maintenance" />
        <Stack.Screen name="maintenance/[id]" />
        <Stack.Screen name="diagnostics" />
        <Stack.Screen name="diagnostics/[id]" />
        <Stack.Screen name="diagnostics/new" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="notifications" />
      </Stack>
    </AuthProvider>
  )
}

