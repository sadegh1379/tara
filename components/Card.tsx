import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import { Colors, Radius } from '@/constants/tokens';

interface CardProps {
  children: React.ReactNode;
  dark?: boolean;
  style?: ViewStyle;
  pad?: number;
  radius?: number;
  onPress?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  dark = false,
  style,
  pad = 20,
  radius = 24,
  onPress,
}) => {
  const cardStyle: ViewStyle[] = [
    styles.card,
    {
      backgroundColor: dark ? Colors.d_card : '#FFFFFF',
      borderColor: dark ? Colors.d_border : Colors.cardBorder,
      padding: pad,
      borderRadius: radius,
    },
    Platform.select({
      ios: {
        shadowColor: dark ? 'transparent' : '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      },
      android: { elevation: dark ? 0 : 2 },
      default: {},
    }) as ViewStyle,
    style ?? {},
  ];

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.82} onPress={onPress} style={cardStyle}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});

export default Card;
