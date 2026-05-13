import React from 'react';
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
import { useAppStore } from '@/store/useAppStore';
import { Colors, FontSize, FontWeight, Radius, Gradients } from '@/constants/tokens';
import TaraOrb from '@/components/TaraOrb';
import ProgressRing from '@/components/ProgressRing';
import Card from '@/components/Card';
import SectionTitle from '@/components/SectionTitle';
import { FlameIcon, BoltIcon, ChevRightIcon, StarIcon } from '@/components/icons';

const { width: W } = Dimensions.get('window');

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const STREAK_DAYS = [true, true, true, true, true, false, false];

const LESSONS = [
  { id: '1', title: 'Small Talk Mastery', level: 'B1', duration: 12, xp: 80, emoji: '💬', status: 'inProgress' as const },
  { id: '2', title: 'Job Interview Skills', level: 'B1', duration: 15, xp: 100, emoji: '💼', status: 'new' as const },
  { id: '3', title: 'Travel Phrases', level: 'A2', duration: 10, xp: 60, emoji: '✈️', status: 'completed' as const },
];

const SUGGESTIONS = [
  { icon: '🎯', title: 'Practice past tense', label: 'Grammar tip', color: '#EEF2FF' },
  { icon: '🗣️', title: 'Speak 5 minutes today', label: 'Daily challenge', color: '#F0FDF4' },
  { icon: '📚', title: 'Learn 10 new words', label: 'Vocabulary', color: '#FEF3C7' },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'home.greeting';
  if (hour < 18) return 'home.greetingAfternoon';
  return 'home.greetingEvening';
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dark, rtl, userName, streak, xp, level } = useAppStore();

  const bg = dark ? Colors.d_bg : '#F8FAFC';
  const textColor = dark ? Colors.d_text : Colors.text;
  const text2Color = dark ? Colors.d_text2 : Colors.text2;
  const text3Color = dark ? Colors.d_text3 : Colors.text3;
  const cardBg = dark ? Colors.d_card : '#FFFFFF';
  const borderColor = dark ? Colors.d_border : Colors.cardBorder;

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {/* Header */}
          <View style={[styles.header, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
            <View>
              <Text style={[styles.greeting, { color: text2Color, textAlign: rtl ? 'right' : 'left' }]}>
                {t(getGreeting())} 👋
              </Text>
              <Text style={[styles.userName, { color: textColor, textAlign: rtl ? 'right' : 'left' }]}>
                {userName}
              </Text>
            </View>
            <View style={[styles.headerRight, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
              <View
                style={[
                  styles.statBadge,
                  { backgroundColor: dark ? Colors.d_card2 : '#FEF3C7', borderColor: dark ? Colors.d_border : '#FDE68A' },
                ]}
              >
                <FlameIcon size={16} color={Colors.amber} />
                <Text style={[styles.statBadgeText, { color: Colors.amber }]}>{streak}</Text>
              </View>
              <View
                style={[
                  styles.statBadge,
                  { backgroundColor: dark ? Colors.d_card2 : '#EEF2FF', borderColor: dark ? Colors.d_border : '#C7D2FE' },
                ]}
              >
                <BoltIcon size={16} color={Colors.indigo} />
                <Text style={[styles.statBadgeText, { color: Colors.indigo }]}>{xp}</Text>
              </View>
            </View>
          </View>

          {/* Daily Progress card */}
          <Card dark={dark} style={styles.progressCard} pad={20} radius={24}>
            <View style={[styles.progressRow, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
              <View style={styles.progressInfo}>
                <Text style={[styles.progressTitle, { color: textColor }]}>
                  {t('home.dailyGoal')}
                </Text>
                <Text style={[styles.progressSubtitle, { color: text2Color }]}>
                  {t('home.minutesLeft', { count: 12 })}
                </Text>
                <View style={styles.progressLevel}>
                  <LinearGradient
                    colors={Gradients.deep}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.levelPill}
                  >
                    <Text style={styles.levelPillText}>{t('home.level', { level })}</Text>
                  </LinearGradient>
                  <Text style={[styles.xpText, { color: text3Color }]}>
                    {t('home.xpToNextLevel', { xp: 360 })}
                  </Text>
                </View>
              </View>
              <ProgressRing value={0.68} size={72} stroke={8} dark={dark}>
                <Text style={[styles.ringText, { color: textColor }]}>68%</Text>
              </ProgressRing>
            </View>

            {/* Weekly streak dots */}
            <View style={styles.streakRow}>
              <Text style={[styles.streakLabel, { color: text2Color }]}>
                {t('home.weeklyStreak')}
              </Text>
              <View style={styles.dayDots}>
                {DAYS.map((day, i) => (
                  <View key={i} style={styles.dayItem}>
                    {STREAK_DAYS[i] ? (
                      <LinearGradient
                        colors={Gradients.deep}
                        style={styles.dayDot}
                      >
                        <Text style={styles.dayDotLabel}>{day}</Text>
                      </LinearGradient>
                    ) : (
                      <View
                        style={[
                          styles.dayDotEmpty,
                          { backgroundColor: dark ? Colors.d_card2 : '#F1F5F9', borderColor: borderColor },
                        ]}
                      >
                        <Text style={[styles.dayDotLabel, { color: text3Color }]}>{day}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </Card>

          {/* Talk with Tara */}
          <LinearGradient
            colors={['#1E1B4B', '#312E81', '#4C1D95']}
            style={styles.talkCard}
          >
            <View style={[styles.talkContent, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
              <View style={styles.talkText}>
                <Text style={styles.talkTitle}>{t('home.talkWithTara')}</Text>
                <Text style={styles.talkDesc}>{t('home.talkDesc')}</Text>
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/talk')}
                  style={styles.talkBtn}
                  activeOpacity={0.82}
                >
                  <LinearGradient
                    colors={Gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.talkBtnGrad}
                  >
                    <Text style={styles.talkBtnLabel}>{t('home.startTalking')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <TaraOrb size={76} state="idle" dark />
            </View>
          </LinearGradient>

          {/* Today's lesson */}
          <View style={styles.section}>
            <SectionTitle
              title={t('home.todayLesson')}
              action={t('common.continue')}
              onAction={() => router.push('/(tabs)/lessons')}
              dark={dark}
            />
            <Card
              dark={dark}
              style={styles.lessonCard}
              pad={16}
              onPress={() => router.push({ pathname: '/(tabs)/lessons/[id]', params: { id: '1' } })}
            >
              <View style={[styles.lessonRow, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                <View style={styles.lessonIconWrap}>
                  <Text style={styles.lessonEmoji}>💬</Text>
                </View>
                <View style={[styles.lessonInfo, { alignItems: rtl ? 'flex-end' : 'flex-start' }]}>
                  <Text style={[styles.lessonTitle, { color: textColor, textAlign: rtl ? 'right' : 'left' }]}>
                    Small Talk Mastery
                  </Text>
                  <View style={[styles.lessonMeta, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                    <Text style={[styles.lessonMetaText, { color: text3Color }]}>B1 · 12 min</Text>
                    <View style={styles.xpBadge}>
                      <BoltIcon size={12} color={Colors.indigo} />
                      <Text style={styles.xpBadgeText}>80 XP</Text>
                    </View>
                  </View>
                  <View style={styles.progressBarWrap}>
                    <LinearGradient
                      colors={Gradients.deep}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.progressFill, { width: '45%' }]}
                    />
                  </View>
                </View>
                <ChevRightIcon size={20} color={text3Color} />
              </View>
            </Card>
          </View>

          {/* Lessons for you */}
          <View style={styles.section}>
            <SectionTitle
              title={t('home.lessonsForYou')}
              action="See all"
              onAction={() => router.push('/(tabs)/lessons')}
              dark={dark}
            />
            {LESSONS.map((lesson) => (
              <Card
                key={lesson.id}
                dark={dark}
                style={styles.lessonListCard}
                pad={14}
                onPress={() =>
                  router.push({ pathname: '/(tabs)/lessons/[id]', params: { id: lesson.id } })
                }
              >
                <View style={[styles.lessonRow, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                  <View style={styles.lessonIconWrap}>
                    <Text style={styles.lessonEmoji}>{lesson.emoji}</Text>
                  </View>
                  <View style={[styles.lessonInfo, { alignItems: rtl ? 'flex-end' : 'flex-start' }]}>
                    <Text style={[styles.lessonTitle, { color: textColor, textAlign: rtl ? 'right' : 'left' }]}>
                      {lesson.title}
                    </Text>
                    <View style={[styles.lessonMeta, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                      <Text style={[styles.lessonMetaText, { color: text3Color }]}>
                        {lesson.level} · {lesson.duration} min
                      </Text>
                      <View style={styles.xpBadge}>
                        <BoltIcon size={12} color={Colors.indigo} />
                        <Text style={styles.xpBadgeText}>{lesson.xp} XP</Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          lesson.status === 'completed'
                            ? Colors.success
                            : lesson.status === 'inProgress'
                            ? Colors.amber
                            : Colors.indigo,
                      },
                    ]}
                  />
                </View>
              </Card>
            ))}
          </View>

          {/* Suggestions */}
          <View style={styles.section}>
            <SectionTitle title={t('home.suggestions')} dark={dark} />
            {SUGGESTIONS.map((s, i) => (
              <Card key={i} dark={dark} style={styles.suggestionCard} pad={14}>
                <View style={[styles.suggRow, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.suggIconWrap, { backgroundColor: s.color }]}>
                    <Text style={styles.suggIcon}>{s.icon}</Text>
                  </View>
                  <View style={[styles.suggText, { alignItems: rtl ? 'flex-end' : 'flex-start' }]}>
                    <Text style={[styles.suggLabel, { color: text3Color, textAlign: rtl ? 'right' : 'left' }]}>
                      {s.label}
                    </Text>
                    <Text style={[styles.suggTitle, { color: textColor, textAlign: rtl ? 'right' : 'left' }]}>
                      {s.title}
                    </Text>
                  </View>
                  <ChevRightIcon size={18} color={text3Color} />
                </View>
              </Card>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingHorizontal: 20, paddingBottom: 24 },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  userName: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold },
  headerRight: { gap: 8, alignItems: 'center', paddingTop: 4 },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statBadgeText: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  progressCard: { marginBottom: 16 },
  progressRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  progressInfo: { flex: 1, gap: 6 },
  progressTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  progressSubtitle: { fontSize: FontSize.sm },
  progressLevel: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  levelPill: { borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 4 },
  levelPillText: { color: '#FFFFFF', fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  xpText: { fontSize: FontSize.xs },
  ringText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  streakRow: { gap: 10 },
  streakLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  dayDots: { flexDirection: 'row', gap: 6 },
  dayItem: {},
  dayDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  dayDotEmpty: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDotLabel: { fontSize: 10, fontWeight: FontWeight.bold, color: '#FFFFFF' },
  talkCard: {
    borderRadius: Radius.xl,
    padding: 20,
    marginBottom: 24,
    overflow: 'hidden',
  },
  talkContent: { alignItems: 'center', justifyContent: 'space-between' },
  talkText: { flex: 1, gap: 6 },
  talkTitle: { color: '#FFFFFF', fontSize: FontSize.xl, fontWeight: FontWeight.extrabold },
  talkDesc: { color: 'rgba(255,255,255,0.7)', fontSize: FontSize.sm },
  talkBtn: { marginTop: 12, alignSelf: 'flex-start' },
  talkBtnGrad: {
    borderRadius: Radius.full,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  talkBtnLabel: { color: '#FFFFFF', fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  section: { marginBottom: 24, gap: 12 },
  lessonCard: { marginTop: 4 },
  lessonRow: { alignItems: 'center', gap: 12 },
  lessonIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonEmoji: { fontSize: 22 },
  lessonInfo: { flex: 1, gap: 4 },
  lessonTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  lessonMeta: { alignItems: 'center', gap: 8 },
  lessonMetaText: { fontSize: FontSize.xs },
  xpBadge: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  xpBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.indigo },
  progressBarWrap: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    width: '100%',
    overflow: 'hidden',
    marginTop: 2,
  },
  progressFill: { height: '100%', borderRadius: 2 },
  lessonListCard: { marginTop: 0 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  suggestionCard: {},
  suggRow: { alignItems: 'center', gap: 12 },
  suggIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggIcon: { fontSize: 20 },
  suggText: { flex: 1, gap: 2 },
  suggLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },
  suggTitle: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
});
