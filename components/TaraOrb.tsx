import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Gradients } from '@/constants/tokens';

export type OrbState = 'idle' | 'listening' | 'speaking' | 'thinking' | 'happy';

interface TaraOrbProps {
  size?: number;
  state?: OrbState;
  dark?: boolean;
}

const TaraOrb: React.FC<TaraOrbProps> = ({ size = 96, state = 'idle', dark = false }) => {
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.4);
  const outerPulseScale = useSharedValue(1);
  const outerPulseOpacity = useSharedValue(0.2);
  const floatY = useSharedValue(0);
  const eyeScaleY = useSharedValue(1);
  const orbScale = useSharedValue(1);

  const isActive = state === 'listening' || state === 'speaking';

  useEffect(() => {
    // Blink animation
    eyeScaleY.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2200 }),
        withTiming(0.1, { duration: 80, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 80, easing: Easing.in(Easing.ease) }),
      ),
      -1,
      false
    );

    if (isActive) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 700, easing: Easing.out(Easing.ease) }),
          withTiming(1.0, { duration: 700, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      );
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.6, { duration: 700 }),
          withTiming(0.2, { duration: 700 })
        ),
        -1,
        false
      );
      outerPulseScale.value = withRepeat(
        withSequence(
          withTiming(1.35, { duration: 1000, easing: Easing.out(Easing.ease) }),
          withTiming(1.0, { duration: 1000, easing: Easing.in(Easing.ease) })
        ),
        -1,
        false
      );
      outerPulseOpacity.value = withRepeat(
        withSequence(
          withTiming(0.35, { duration: 1000 }),
          withTiming(0.05, { duration: 1000 })
        ),
        -1,
        false
      );
    } else {
      pulseScale.value = withTiming(1, { duration: 400 });
      pulseOpacity.value = withTiming(0, { duration: 400 });
      outerPulseScale.value = withTiming(1, { duration: 400 });
      outerPulseOpacity.value = withTiming(0, { duration: 400 });
    }

    if (state === 'happy') {
      floatY.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      floatY.value = withRepeat(
        withSequence(
          withTiming(-3, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }

    if (state === 'thinking') {
      orbScale.value = withRepeat(
        withSequence(
          withTiming(0.95, { duration: 500 }),
          withTiming(1.02, { duration: 500 })
        ),
        -1,
        false
      );
    } else {
      orbScale.value = withTiming(1, { duration: 300 });
    }
  }, [state]);

  const midAuraStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const outerAuraStyle = useAnimatedStyle(() => ({
    transform: [{ scale: outerPulseScale.value }],
    opacity: outerPulseOpacity.value,
  }));

  const orbContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatY.value },
      { scale: orbScale.value },
    ],
  }));

  const eyeLeftStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: eyeScaleY.value }],
  }));

  const eyeRightStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: eyeScaleY.value }],
  }));

  const eyeSize = size * 0.09;
  const eyeY = size * 0.38;
  const eyeX = size * 0.28;
  const smileSize = size * 0.22;
  const blushSize = size * 0.11;
  const blushY = size * 0.52;
  const blushX = size * 0.2;

  return (
    <Animated.View style={[styles.container, { width: size * 1.7, height: size * 1.7 }, orbContainerStyle]}>
      {/* Outer aura */}
      <Animated.View
        style={[
          styles.aura,
          {
            width: size * 1.5,
            height: size * 1.5,
            borderRadius: size * 0.75,
            top: size * 0.1,
            left: size * 0.1,
            backgroundColor: '#818CF8',
          },
          outerAuraStyle,
        ]}
      />
      {/* Mid aura */}
      <Animated.View
        style={[
          styles.aura,
          {
            width: size * 1.25,
            height: size * 1.25,
            borderRadius: size * 0.625,
            top: size * 0.225,
            left: size * 0.225,
            backgroundColor: '#A78BFA',
          },
          midAuraStyle,
        ]}
      />

      {/* Main Orb */}
      <View
        style={[
          styles.orbWrapper,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            top: size * 0.35,
            left: size * 0.35,
          },
        ]}
      >
        <LinearGradient
          colors={Gradients.primary}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[styles.orbGradient, { borderRadius: size / 2 }]}
        >
          {/* Highlight */}
          <View
            style={[
              styles.highlight,
              {
                width: size * 0.38,
                height: size * 0.28,
                top: size * 0.1,
                left: size * 0.18,
                borderRadius: size * 0.14,
              },
            ]}
          />

          {/* Eyes */}
          <Animated.View
            style={[
              styles.eye,
              {
                width: eyeSize,
                height: eyeSize * 1.1,
                borderRadius: eyeSize * 0.5,
                top: eyeY,
                left: eyeX,
              },
              eyeLeftStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.eye,
              {
                width: eyeSize,
                height: eyeSize * 1.1,
                borderRadius: eyeSize * 0.5,
                top: eyeY,
                right: eyeX,
              },
              eyeRightStyle,
            ]}
          />

          {/* Smile */}
          <View
            style={[
              styles.smile,
              {
                width: smileSize,
                height: smileSize * 0.5,
                borderRadius: smileSize * 0.25,
                bottom: size * 0.22,
                left: (size - smileSize) / 2,
              },
            ]}
          />

          {/* Blush cheeks */}
          <View
            style={[
              styles.blush,
              {
                width: blushSize,
                height: blushSize * 0.6,
                borderRadius: blushSize * 0.3,
                top: blushY,
                left: blushX,
              },
            ]}
          />
          <View
            style={[
              styles.blush,
              {
                width: blushSize,
                height: blushSize * 0.6,
                borderRadius: blushSize * 0.3,
                top: blushY,
                right: blushX,
              },
            ]}
          />
        </LinearGradient>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  aura: {
    position: 'absolute',
  },
  orbWrapper: {
    position: 'absolute',
    overflow: 'hidden',
  },
  orbGradient: {
    flex: 1,
    position: 'relative',
  },
  highlight: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.32)',
  },
  eye: {
    position: 'absolute',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
  },
  smile: {
    position: 'absolute',
    borderBottomWidth: 2.5,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomColor: 'rgba(15, 23, 42, 0.7)',
    backgroundColor: 'transparent',
  },
  blush: {
    position: 'absolute',
    backgroundColor: 'rgba(244, 114, 182, 0.35)',
  },
});

export default TaraOrb;
