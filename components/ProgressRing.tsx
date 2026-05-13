import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  value: number;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
  dark?: boolean;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 72,
  stroke = 8,
  children,
  dark = false,
}) => {
  const progress = useSharedValue(0);

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    progress.value = withTiming(Math.max(0, Math.min(1, value)), {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [value]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const trackColor = dark ? Colors.d_card2 : Colors.border;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <SvgLinearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#6366F1" />
            <Stop offset="50%" stopColor="#8B5CF6" />
            <Stop offset="100%" stopColor="#EC4899" />
          </SvgLinearGradient>
        </Defs>
        {/* Track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
        />
        {/* Progress arc */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
      {children && (
        <View style={[styles.children, { width: size, height: size }]}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  children: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProgressRing;
