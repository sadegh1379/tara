import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors, Radius, FontSize, FontWeight } from '@/constants/tokens';

interface ChipProps {
  children: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  dark?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

const Chip: React.FC<ChipProps> = ({
  children,
  selected = false,
  onPress,
  dark = false,
  icon,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.chip,
        {
          backgroundColor: selected
            ? '#EEF2FF'
            : dark
            ? Colors.d_card2
            : '#F8FAFC',
          borderColor: selected
            ? Colors.indigo
            : dark
            ? Colors.d_border
            : Colors.border,
        },
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.label,
          {
            color: selected
              ? Colors.indigoDeep
              : dark
              ? Colors.d_text2
              : Colors.text2,
            fontWeight: selected ? FontWeight.semibold : FontWeight.medium,
          },
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  icon: {},
  label: {
    fontSize: FontSize.sm,
  },
});

export default Chip;
