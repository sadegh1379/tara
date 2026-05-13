import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, FontSize, FontWeight } from '@/constants/tokens';

interface ProgressBarProps {
  value: number;
  height?: number;
  dark?: boolean;
  label?: { left?: string; right?: string };
  style?: ViewStyle;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  height = 8,
  dark = false,
  label,
  style,
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(Math.max(0, Math.min(1, value)), {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });
  }, [value]);

  const animatedWidth = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const trackColor = dark ? Colors.d_card2 : Colors.border;

  return (
    <View style={style}>
      {label && (label.left || label.right) && (
        <View style={styles.labelRow}>
          {label.left ? (
            <Text style={[styles.labelText, { color: dark ? Colors.d_text2 : Colors.text2 }]}>
              {label.left}
            </Text>
          ) : (
            <View />
          )}
          {label.right ? (
            <Text style={[styles.labelText, { color: dark ? Colors.d_text2 : Colors.text2 }]}>
              {label.right}
            </Text>
          ) : (
            <View />
          )}
        </View>
      )}
      <View
        style={[
          styles.track,
          { height, borderRadius: height / 2, backgroundColor: trackColor },
        ]}
      >
        <Animated.View
          style={[styles.fillContainer, { height, borderRadius: height / 2 }, animatedWidth]}
        >
          <LinearGradient
            colors={Gradients.deep}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.fill, { height, borderRadius: height / 2 }]}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  labelText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  track: {
    overflow: 'hidden',
    width: '100%',
  },
  fillContainer: {
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
  },
});

export default ProgressBar;
