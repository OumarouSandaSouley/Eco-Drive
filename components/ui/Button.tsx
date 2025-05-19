import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, type ViewStyle, type TextStyle } from "react-native"
import { colors } from "../../styles/colors"

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "outline" | "ghost"
  size?: "small" | "medium" | "large"
  isLoading?: boolean
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

const  Button = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  isLoading = false,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) => {
  const getButtonStyle = () => {
    switch (variant) {
      case "outline":
        return [
          styles.button,
          styles[`${size}Button`],
          styles.outlineButton,
          disabled && styles.disabledOutlineButton,
          style,
        ]
      case "ghost":
        return [
          styles.button,
          styles[`${size}Button`],
          styles.ghostButton,
          disabled && styles.disabledGhostButton,
          style,
        ]
      default:
        return [styles.button, styles[`${size}Button`], styles.primaryButton, disabled && styles.disabledButton, style]
    }
  }

  const getTextStyle = () => {
    switch (variant) {
      case "outline":
        return [
          styles.buttonText,
          styles[`${size}Text`],
          styles.outlineText,
          disabled && styles.disabledOutlineText,
          textStyle,
        ]
      case "ghost":
        return [
          styles.buttonText,
          styles[`${size}Text`],
          styles.ghostText,
          disabled && styles.disabledGhostText,
          textStyle,
        ]
      default:
        return [
          styles.buttonText,
          styles[`${size}Text`],
          styles.primaryText,
          disabled && styles.disabledText,
          textStyle,
        ]
    }
  }

  return (
    <TouchableOpacity style={getButtonStyle()} onPress={onPress} disabled={disabled || isLoading} activeOpacity={0.8}>
      {isLoading ? (
        <ActivityIndicator size="small" color={variant === "primary" ? "#fff" : colors.primary} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}
export default Button;
const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ghostButton: {
    backgroundColor: "transparent",
  },
  disabledButton: {
    backgroundColor: colors.disabledBackground,
  },
  disabledOutlineButton: {
    borderColor: colors.disabledBackground,
  },
  disabledGhostButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontWeight: "600",
    textAlign: "center",
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  primaryText: {
    color: "#fff",
  },
  outlineText: {
    color: colors.primary,
  },
  ghostText: {
    color: colors.primary,
  },
  disabledText: {
    color: colors.disabledText,
  },
  disabledOutlineText: {
    color: colors.disabledText,
  },
  disabledGhostText: {
    color: colors.disabledText,
  },
})
