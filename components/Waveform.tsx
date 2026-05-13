import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/tokens';

const STATIC_HEIGHTS = [12, 22, 36, 26, 16, 30, 42, 24];
const BASE_HEIGHT = 8;

interface WaveformProps {
  bars?: number;
  color?: string;
  animated?: boolean;
  height?: number;
  dark?: boolean;
  style?: ViewStyle;
}

interface BarProps {
  index: number;
  totalBars: number;
  animated: boolean;
  color: string;
  containerHeight: number;
  maxBarHeight: number;
}

const WaveBar: React.FC<BarProps> = ({
  index,
  totalBars,
  animated,
  color,
  containerHeight,
  maxBarHeight,
}) => {
  const heightAnim = useSharedValue(BASE_HEIGHT);
  const targetHeight = STATIC_HEIGHTS[index % STATIC_HEIGHTS.length];

  useEffect(() => {
    if (animated) {
      const delay = (index / totalBars) * 400;
      const duration = 280 + (index % 4) * 60;
      heightAnim.value = withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(targetHeight, {
              duration,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(BASE_HEIGHT + (targetHeight - BASE_HEIGHT) * 0.2, {
              duration,
              easing: Easing.inOut(Easing.ease),
            })
          ),
          -1,
          false
        )
      );
    } else {
      heightAnim.value = withTiming(BASE_HEIGHT, { duration: 300 });
    }
  }, [animated]);

  const animStyle = useAnimatedStyle(() => ({
    height: heightAnim.value,
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        {
          backgroundColor: color,
          borderRadius: 3,
          width: Math.max(2, (containerHeight / maxBarHeight) * 2.5),
        },
        animStyle,
      ]}
    />
  );
};

const Waveform: React.FC<WaveformProps> = ({
  bars = 28,
  color,
  animated = false,
  height = 56,
  dark = false,
  style,
}) => {
  const barColor = color ?? (dark ? Colors.d_text2 : Colors.indigo);

  return (
    <View style={[styles.container, { height }, style]}>
      {Array.from({ length: bars }).map((_, i) => (
        <WaveBar
          key={i}
          index={i}
          totalBars={bars}
          animated={animated}
          color={barColor}
          containerHeight={height}
          maxBarHeight={Math.max(...STATIC_HEIGHTS)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  bar: {},
});

export default Waveform;
