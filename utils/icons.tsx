import { View, Text } from "react-native"

interface IconProps {
  size?: number
  color?: string
}

// Simple icon components using text for simplicity
// In a real app, use a proper icon library like react-native-vector-icons

export const ChevronLeft = ({ size = 24, color = "#000" }: IconProps) => (
  <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
    <Text style={{ fontSize: size * 0.75, color }}>←</Text>
  </View>
)

export const ChevronDown = ({ size = 24, color = "#000" }: IconProps) => (
  <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
    <Text style={{ fontSize: size * 0.75, color }}>↓</Text>
  </View>
)

export const Check = ({ size = 24, color = "#000" }: IconProps) => (
  <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
    <Text style={{ fontSize: size * 0.75, color }}>✓</Text>
  </View>
)

export const Calendar = ({ size = 24, color = "#000" }: IconProps) => (
  <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
    <Text style={{ fontSize: size * 0.75, color }}>📅</Text>
  </View>
)

export const Tool = ({ size = 24, color = "#000" }: IconProps) => (
  <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
    <Text style={{ fontSize: size * 0.75, color }}>🔧</Text>
  </View>
)

export const Bell = ({ size = 24, color = "#000" }: IconProps) => (
  <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
    <Text style={{ fontSize: size * 0.75, color }}>🔔</Text>
  </View>
)

export const Search = ({ size = 24, color = "#000" }: IconProps) => (
  <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
    <Text style={{ fontSize: size * 0.75, color }}>🔍</Text>
  </View>
)
