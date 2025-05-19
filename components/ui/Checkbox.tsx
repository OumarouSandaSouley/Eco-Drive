import { StyleSheet, TouchableOpacity, View } from "react-native"
import { Check } from "../../utils/icons"
import { colors } from "../../styles/colors"

interface CheckboxProps {
  checked: boolean
  onValueChange: (checked: boolean) => void
  disabled?: boolean
}

const Checkbox = ({ checked, onValueChange, disabled = false }: CheckboxProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => !disabled && onValueChange(!checked)}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, checked && styles.checked, disabled && styles.disabled]}>
        {checked && <Check size={16} color="#fff" />}
      </View>
    </TouchableOpacity>
  )
}
export default Checkbox
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: colors.primary,
  },
  disabled: {
    borderColor: colors.disabledBackground,
    // backgroundColor: (props: { checked: boolean }) => (props.checked ? colors.disabledBackground : "transparent"),
  },
})
