import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import { Colors, Radius, FontSize, FontWeight } from '@/constants/tokens';

interface GhostBtnProps {
  children: React.ReactNode;
  full?: boolean;
  onPress?: () => void;
  dark?: boolean;
  height?: number;
  style?: ViewStyle;
  iconLeft?: React.ReactNode;
}

const GhostBtn: React.FC<GhostBtnProps> = ({
  children,
  full = false,
  onPress,
  dark = false,
  height = 52,
  style,
  iconLeft,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        full ? styles.full : styles.auto,
        styles.btn,
        {
          height,
          backgroundColor: dark ? Colors.d_card2 : '#FFFFFF',
          borderColor: dark ? Colors.d_border : Colors.border,
        },
        Platform.select({
          ios: {
            shadowColor: dark ? 'transparent' : '#0F172A',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
          },
          android: { elevation: 1 },
          default: {},
        }),
        style,
      ]}
    >
      <View style={styles.inner}>
        {iconLeft && <View style={styles.iconLeft}>{iconLeft}</View>}
        <Text style={[styles.label, { color: dark ? Colors.d_text : Colors.text }]}>
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  full: {
    width: '100%',
  },
  auto: {
    alignSelf: 'center',
  },
  btn: {
    borderRadius: Radius.full,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  iconLeft: {
    marginRight: 4,
  },
});

export default GhostBtn;
