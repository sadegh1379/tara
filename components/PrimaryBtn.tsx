import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradients, Colors, Radius, FontSize, FontWeight } from '@/constants/tokens';

interface PrimaryBtnProps {
  children: React.ReactNode;
  full?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  height?: number;
  iconRight?: React.ReactNode;
  style?: ViewStyle;
  loading?: boolean;
}

const PrimaryBtn: React.FC<PrimaryBtnProps> = ({
  children,
  full = false,
  onPress,
  disabled = false,
  height = 56,
  iconRight,
  style,
  loading = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
      style={[full ? styles.full : styles.auto, style]}
    >
      <LinearGradient
        colors={disabled ? ['#CBD5E1', '#CBD5E1'] : Gradients.deep}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.gradient,
          { height },
          Platform.select({
            ios: {
              shadowColor: disabled ? 'transparent' : '#6366F1',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.32,
              shadowRadius: 12,
            },
            android: { elevation: disabled ? 0 : 6 },
            default: {},
          }),
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <View style={styles.inner}>
            <Text style={styles.label}>{children}</Text>
            {iconRight && <View style={styles.iconRight}>{iconRight}</View>}
          </View>
        )}
      </LinearGradient>
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
  gradient: {
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.3,
  },
  iconRight: {
    marginLeft: 4,
  },
});

export default PrimaryBtn;
