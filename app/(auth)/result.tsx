import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useAppStore } from '@/store/useAppStore';
import { Colors, FontSize, FontWeight, Radius, Gradients } from '@/constants/tokens';
import PrimaryBtn from '@/components/PrimaryBtn';

const { width: W } = Dimensions.get('window');

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const CURRENT_LEVEL_INDEX = 2; // B1

interface SkillBar {
  key: 'pronunciation' | 'grammar' | 'vocabulary' | 'fluency';
  value: number;
  color: string;
}

const SKILLS: SkillBar[] = [
  { key: 'pronunciation', value: 0.72, color: '#818CF8' },
  { key: 'grammar', value: 0.64, color: '#A78BFA' },
  { key: 'vocabulary', value: 0.81, color: '#F472B6' },
  { key: 'fluency', value: 0.68, color: '#34D399' },
];

function AnimatedSkillBar({ value, color, delay }: { value: number; color: string; delay: number }) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(delay, withTiming(value, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View style={skillStyles.track}>
      <Animated.View style={[skillStyles.fill, { backgroundColor: color }, animStyle]} />
    </View>
  );
}

const skillStyles = StyleSheet.create({
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default function ResultScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dark, rtl, completeOnboarding } = useAppStore();

  const bg = dark ? Colors.d_bg : '#FAFAFF';
  const textColor = dark ? Colors.d_text : Colors.text;
  const text2Color = dark ? Colors.d_text2 : Colors.text2;

  const handleBegin = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={styles.titleBlock}>
            <Text style={[styles.title, { color: textColor, textAlign: 'center' }]}>
              {t('result.title')}
            </Text>
            <Text style={[styles.subtitle, { color: text2Color, textAlign: 'center' }]}>
              {t('result.subtitle')}
            </Text>
          </View>

          {/* CEFR bar */}
          <View
            style={[
              styles.cefrCard,
              {
                backgroundColor: dark ? Colors.d_card : '#FFFFFF',
                borderColor: dark ? Colors.d_border : Colors.cardBorder,
              },
            ]}
          >
            <View style={styles.cefrRow}>
              {CEFR_LEVELS.map((lvl, i) => {
                const isCurrent = i === CURRENT_LEVEL_INDEX;
                const isFilled = i < CURRENT_LEVEL_INDEX;
                return (
                  <View key={lvl} style={styles.cefrSegmentWrap}>
                    {isCurrent ? (
                      <LinearGradient
                        colors={Gradients.deep}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.cefrSegmentCurrent}
                      >
                        <Text style={styles.cefrLabelCurrent}>{lvl}</Text>
                      </LinearGradient>
                    ) : (
                      <View
                        style={[
                          styles.cefrSegment,
                          {
                            backgroundColor: isFilled
                              ? Colors.indigo
                              : dark
                              ? Colors.d_card2
                              : '#F1F5F9',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.cefrLabel,
                            {
                              color: isFilled
                                ? '#FFFFFF'
                                : dark
                                ? Colors.d_text3
                                : Colors.text3,
                            },
                          ]}
                        >
                          {lvl}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
            <View style={styles.levelBadgeRow}>
              <Text style={[styles.yourLevelLabel, { color: text2Color }]}>
                {t('result.yourLevel')}
              </Text>
              <LinearGradient
                colors={Gradients.deep}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.levelBadge}
              >
                <Text style={styles.levelBadgeText}>B1</Text>
              </LinearGradient>
            </View>
          </View>

          {/* Skill bars */}
          <View
            style={[
              styles.skillsCard,
              {
                backgroundColor: dark ? Colors.d_card : '#FFFFFF',
                borderColor: dark ? Colors.d_border : Colors.cardBorder,
              },
            ]}
          >
            {SKILLS.map((skill, i) => (
              <View key={skill.key} style={styles.skillRow}>
                <View style={[styles.skillLeft, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                  <Text
                    style={[
                      styles.skillLabel,
                      {
                        color: textColor,
                        textAlign: rtl ? 'right' : 'left',
                        minWidth: 110,
                      },
                    ]}
                  >
                    {t(`result.skills.${skill.key}`)}
                  </Text>
                </View>
                <AnimatedSkillBar value={skill.value} color={skill.color} delay={i * 150} />
                <Text style={[styles.skillPct, { color: skill.color }]}>
                  {Math.round(skill.value * 100)}%
                </Text>
              </View>
            ))}
          </View>

          {/* Suggested path */}
          <LinearGradient
            colors={Gradients.soft}
            style={[
              styles.pathCard,
              { borderColor: dark ? Colors.d_border : 'rgba(99,102,241,0.15)' },
            ]}
          >
            <Text style={styles.pathTitle}>{t('result.suggestedPath')}</Text>
            <Text style={styles.pathDesc}>{t('result.pathDesc')}</Text>
            <View style={styles.pathGoalRow}>
              <Text style={styles.pathGoalEmoji}>🎯</Text>
              <Text style={styles.pathGoalText}>{t('result.weeklyGoal')}</Text>
            </View>
          </LinearGradient>
        </ScrollView>

        <View style={styles.ctaBlock}>
          <PrimaryBtn full onPress={handleBegin} height={56}>
            {t('result.begin')}
          </PrimaryBtn>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 20 },
  titleBlock: { marginTop: 24, marginBottom: 24, gap: 8 },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.4,
  },
  subtitle: { fontSize: FontSize.base, lineHeight: 22 },
  cefrCard: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    gap: 16,
  },
  cefrRow: {
    flexDirection: 'row',
    gap: 6,
  },
  cefrSegmentWrap: { flex: 1 },
  cefrSegment: {
    borderRadius: 10,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cefrSegmentCurrent: {
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cefrLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  cefrLabelCurrent: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.extrabold,
    color: '#FFFFFF',
  },
  levelBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  yourLevelLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  levelBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  levelBadgeText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extrabold,
    color: '#FFFFFF',
  },
  skillsCard: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
    gap: 14,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skillLeft: { gap: 4 },
  skillLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  skillPct: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, width: 36, textAlign: 'right' },
  pathCard: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: 20,
    marginBottom: 8,
    gap: 8,
  },
  pathTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.indigoDeep,
  },
  pathDesc: {
    fontSize: FontSize.sm,
    color: Colors.text2,
    lineHeight: 20,
  },
  pathGoalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  pathGoalEmoji: { fontSize: 16 },
  pathGoalText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.indigoDeep,
  },
  ctaBlock: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
});
