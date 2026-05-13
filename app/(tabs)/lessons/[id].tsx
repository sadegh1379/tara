import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { Colors, FontSize, FontWeight, Radius, Gradients } from '@/constants/tokens';
import Card from '@/components/Card';
import PrimaryBtn from '@/components/PrimaryBtn';
import { ChevLeftIcon, BoltIcon, CheckIcon } from '@/components/icons';

interface LessonStep {
  id: string;
  title: string;
  icon: string;
  duration: string;
  status: 'completed' | 'current' | 'locked';
}

const STEPS: LessonStep[] = [
  { id: '1', title: 'Vocabulary', icon: '📝', duration: '3 min', status: 'completed' },
  { id: '2', title: 'Dialogue', icon: '💬', duration: '4 min', status: 'current' },
  { id: '3', title: 'Grammar tip', icon: '📚', duration: '3 min', status: 'locked' },
  { id: '4', title: 'Quiz', icon: '🎯', duration: '2 min', status: 'locked' },
  { id: '5', title: 'Speaking', icon: '🎙️', duration: '3 min', status: 'locked' },
];

const LESSONS_DATA: Record<string, { title: string; emoji: string; level: string; duration: number; xp: number; about: string }> = {
  '1': {
    title: 'Small Talk Mastery',
    emoji: '💬',
    level: 'B1',
    duration: 12,
    xp: 80,
    about: 'Learn how to start and maintain casual conversations in English. Practice greetings, weather talk, and daily topics.',
  },
  '2': {
    title: 'Job Interview Skills',
    emoji: '💼',
    level: 'B1',
    duration: 15,
    xp: 100,
    about: 'Master the language needed to ace job interviews. Learn to describe your experience, skills, and ambitions confidently.',
  },
  '3': {
    title: 'Travel Phrases',
    emoji: '✈️',
    level: 'A2',
    duration: 10,
    xp: 60,
    about: 'Essential phrases for traveling: airports, hotels, restaurants, and asking for directions.',
  },
};

export default function LessonDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { dark, rtl } = useAppStore();

  const lesson = LESSONS_DATA[id ?? '1'] ?? LESSONS_DATA['1'];

  const textColor = dark ? Colors.d_text : Colors.text;
  const text2Color = dark ? Colors.d_text2 : Colors.text2;
  const text3Color = dark ? Colors.d_text3 : Colors.text3;
  const bg = dark ? Colors.d_bg : '#F8FAFC';

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      {/* Hero gradient */}
      <LinearGradient
        colors={['#1E1B4B', '#312E81', '#4C1D95']}
        style={styles.hero}
      >
        <SafeAreaView edges={['top']}>
          <View style={[styles.heroHeader, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ChevLeftIcon size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={[styles.heroBadges, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
              <View style={styles.levelBadge}>
                <Text style={styles.levelBadgeText}>{lesson.level}</Text>
              </View>
              <View style={styles.xpBadge}>
                <BoltIcon size={14} color={Colors.amber} />
                <Text style={styles.xpBadgeText}>{lesson.xp} XP</Text>
              </View>
            </View>
          </View>
          <View style={styles.heroContent}>
            <Text style={styles.heroEmoji}>{lesson.emoji}</Text>
            <Text style={styles.heroTitle}>{lesson.title}</Text>
            <Text style={styles.heroDuration}>{lesson.duration} min · 5 steps</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Overlapping card */}
      <View style={styles.cardOverlap}>
        <Card dark={dark} style={styles.overlapCard} pad={20}>
          <Text style={[styles.aboutTitle, { color: text2Color }]}>
            {t('lessonDetail.about')}
          </Text>
          <Text style={[styles.aboutText, { color: textColor, textAlign: rtl ? 'right' : 'left' }]}>
            {lesson.about}
          </Text>
        </Card>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Steps timeline */}
        <View style={styles.stepsSection}>
          <Text style={[styles.stepsTitle, { color: textColor }]}>
            {t('lessonDetail.steps')}
          </Text>
          <View style={styles.stepList}>
            {STEPS.map((step, i) => {
              const isLast = i === STEPS.length - 1;
              return (
                <View key={step.id} style={[styles.stepRow, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                  {/* Timeline line + dot */}
                  <View style={styles.timeline}>
                    <View
                      style={[
                        styles.timelineDot,
                        {
                          backgroundColor:
                            step.status === 'completed'
                              ? Colors.success
                              : step.status === 'current'
                              ? Colors.indigo
                              : dark
                              ? Colors.d_card2
                              : Colors.border,
                          borderColor:
                            step.status === 'current' ? Colors.indigo : 'transparent',
                          borderWidth: step.status === 'current' ? 3 : 0,
                        },
                      ]}
                    >
                      {step.status === 'completed' && (
                        <CheckIcon size={12} color="#FFFFFF" />
                      )}
                    </View>
                    {!isLast && (
                      <View
                        style={[
                          styles.timelineLine,
                          { backgroundColor: step.status === 'completed' ? Colors.success : dark ? Colors.d_border : Colors.border },
                        ]}
                      />
                    )}
                  </View>
                  {/* Step card */}
                  <View
                    style={[
                      styles.stepCard,
                      {
                        backgroundColor: dark ? Colors.d_card : '#FFFFFF',
                        borderColor:
                          step.status === 'current'
                            ? Colors.indigo
                            : dark
                            ? Colors.d_border
                            : Colors.cardBorder,
                        opacity: step.status === 'locked' ? 0.55 : 1,
                      },
                    ]}
                  >
                    <Text style={styles.stepIcon}>{step.icon}</Text>
                    <View style={[styles.stepInfo, { alignItems: rtl ? 'flex-end' : 'flex-start' }]}>
                      <Text style={[styles.stepTitle, { color: textColor }]}>{step.title}</Text>
                      <Text style={[styles.stepDuration, { color: text3Color }]}>{step.duration}</Text>
                    </View>
                    {step.status === 'current' && (
                      <View style={styles.currentDot} />
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View
        style={[
          styles.cta,
          {
            backgroundColor: dark ? Colors.d_card : '#FFFFFF',
            borderTopColor: dark ? Colors.d_border : Colors.border,
          },
        ]}
      >
        <PrimaryBtn
          full
          onPress={() => router.push('/(tabs)/lessons/player')}
          height={54}
        >
          {t('lessonDetail.startLesson')}
        </PrimaryBtn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: { paddingBottom: 36 },
  heroHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
  },
  backBtn: { padding: 8 },
  heroBadges: { gap: 8 },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  levelBadgeText: { color: '#FFFFFF', fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245,158,11,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
  xpBadgeText: { color: '#FDE68A', fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  heroContent: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 12, paddingBottom: 20, gap: 8 },
  heroEmoji: { fontSize: 48 },
  heroTitle: { color: '#FFFFFF', fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, textAlign: 'center' },
  heroDuration: { color: 'rgba(255,255,255,0.65)', fontSize: FontSize.sm },
  cardOverlap: { paddingHorizontal: 20, marginTop: -24, zIndex: 10 },
  overlapCard: { gap: 8 },
  aboutTitle: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, textTransform: 'uppercase', letterSpacing: 0.8 },
  aboutText: { fontSize: FontSize.base, lineHeight: 24 },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 28 },
  stepsSection: { gap: 14 },
  stepsTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  stepList: { gap: 0 },
  stepRow: { alignItems: 'flex-start', gap: 12 },
  timeline: { alignItems: 'center', width: 28 },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineLine: { width: 2, height: 28, marginVertical: 2 },
  stepCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    padding: 14,
    gap: 12,
    marginBottom: 6,
  },
  stepIcon: { fontSize: 22 },
  stepInfo: { flex: 1, gap: 3 },
  stepTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  stepDuration: { fontSize: FontSize.xs },
  currentDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.indigo },
  cta: {
    padding: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
  },
});
