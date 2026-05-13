import React, { useState } from 'react';
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
import Card from '@/components/Card';
import Chip from '@/components/Chip';
import SectionTitle from '@/components/SectionTitle';
import { BoltIcon, CheckIcon, ChevRightIcon } from '@/components/icons';
import ProgressBar from '@/components/ProgressBar';

const { width: W } = Dimensions.get('window');

type Category = 'all' | 'speaking' | 'grammar' | 'vocabulary' | 'listening';
type LessonStatus = 'completed' | 'inProgress' | 'locked' | 'new';

interface Lesson {
  id: string;
  title: string;
  level: string;
  duration: number;
  xp: number;
  emoji: string;
  status: LessonStatus;
  category: Category;
  progress?: number;
}

const LESSONS: Lesson[] = [
  { id: '1', title: 'Small Talk Mastery', level: 'B1', duration: 12, xp: 80, emoji: '💬', status: 'inProgress', category: 'speaking', progress: 0.45 },
  { id: '2', title: 'Job Interview Skills', level: 'B1', duration: 15, xp: 100, emoji: '💼', status: 'new', category: 'speaking' },
  { id: '3', title: 'Travel Phrases', level: 'A2', duration: 10, xp: 60, emoji: '✈️', status: 'completed', category: 'vocabulary' },
  { id: '4', title: 'Business Meetings', level: 'B2', duration: 18, xp: 120, emoji: '🤝', status: 'locked', category: 'speaking' },
  { id: '5', title: 'Present Perfect', level: 'B1', duration: 14, xp: 90, emoji: '📚', status: 'new', category: 'grammar' },
  { id: '6', title: 'Conditionals', level: 'B1', duration: 16, xp: 95, emoji: '🔀', status: 'locked', category: 'grammar' },
  { id: '7', title: 'Passive Voice', level: 'B2', duration: 14, xp: 90, emoji: '🔄', status: 'locked', category: 'grammar' },
  { id: '8', title: 'Listening: News', level: 'B1', duration: 20, xp: 110, emoji: '🎧', status: 'new', category: 'listening' },
];

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'speaking', label: 'Speaking' },
  { key: 'grammar', label: 'Grammar' },
  { key: 'vocabulary', label: 'Vocabulary' },
  { key: 'listening', label: 'Listening' },
];

function StatusBadge({ status, dark }: { status: LessonStatus; dark: boolean }) {
  const { t } = useTranslation();
  if (status === 'completed') {
    return (
      <View style={[badge.wrap, { backgroundColor: '#ECFDF5' }]}>
        <CheckIcon size={14} color={Colors.success} />
      </View>
    );
  }
  if (status === 'inProgress') {
    return (
      <View style={[badge.wrap, { backgroundColor: '#FEF3C7' }]}>
        <View style={[badge.dot, { backgroundColor: Colors.amber }]} />
      </View>
    );
  }
  if (status === 'locked') {
    return (
      <View style={[badge.wrap, { backgroundColor: dark ? Colors.d_card2 : '#F1F5F9' }]}>
        <Text style={[badge.lock, { color: dark ? Colors.d_text3 : Colors.text3 }]}>🔒</Text>
      </View>
    );
  }
  return (
    <View style={[badge.wrap, { backgroundColor: '#EEF2FF' }]}>
      <View style={[badge.dot, { backgroundColor: Colors.indigo }]} />
    </View>
  );
}

const badge = StyleSheet.create({
  wrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  lock: { fontSize: 12 },
});

export default function LessonsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dark, rtl } = useAppStore();
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const bg = dark ? Colors.d_bg : '#F8FAFC';
  const textColor = dark ? Colors.d_text : Colors.text;
  const text2Color = dark ? Colors.d_text2 : Colors.text2;
  const text3Color = dark ? Colors.d_text3 : Colors.text3;

  const filtered =
    activeCategory === 'all'
      ? LESSONS
      : LESSONS.filter((l) => l.category === activeCategory);

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Header */}
          <View style={[styles.header, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.headerTitle, { color: textColor }]}>
              {t('lessons.title')}
            </Text>
          </View>

          {/* Path progress */}
          <Card dark={dark} style={styles.pathCard} pad={18}>
            <View style={[styles.pathRow, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
              <View style={styles.pathInfo}>
                <Text style={[styles.pathTitle, { color: textColor }]}>
                  {t('lessons.myPath')}
                </Text>
                <Text style={[styles.pathSub, { color: text2Color }]}>
                  3 of 12 lessons completed
                </Text>
              </View>
              <LinearGradient
                colors={Gradients.deep}
                style={styles.pathBadge}
              >
                <Text style={styles.pathBadgeText}>B1</Text>
              </LinearGradient>
            </View>
            <ProgressBar value={0.25} dark={dark} height={8} />
          </Card>

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScroll}
          >
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat.key}
                selected={activeCategory === cat.key}
                onPress={() => setActiveCategory(cat.key)}
                dark={dark}
              >
                {cat.label}
              </Chip>
            ))}
          </ScrollView>

          {/* Lesson list */}
          <View style={styles.section}>
            <SectionTitle
              title={t('lessons.explore')}
              dark={dark}
            />
            <View style={styles.lessonList}>
              {filtered.map((lesson) => (
                <TouchableOpacity
                  key={lesson.id}
                  activeOpacity={lesson.status === 'locked' ? 1 : 0.82}
                  onPress={() => {
                    if (lesson.status !== 'locked') {
                      router.push({ pathname: '/(tabs)/lessons/[id]', params: { id: lesson.id } });
                    }
                  }}
                >
                  <View
                    style={[
                      styles.lessonCard,
                      {
                        backgroundColor: dark ? Colors.d_card : '#FFFFFF',
                        borderColor: dark ? Colors.d_border : Colors.cardBorder,
                        opacity: lesson.status === 'locked' ? 0.55 : 1,
                        flexDirection: rtl ? 'row-reverse' : 'row',
                      },
                    ]}
                  >
                    <View style={styles.lessonEmoji}>
                      <Text style={styles.lessonEmojiText}>{lesson.emoji}</Text>
                    </View>
                    <View style={[styles.lessonInfo, { alignItems: rtl ? 'flex-end' : 'flex-start' }]}>
                      <Text
                        style={[
                          styles.lessonTitle,
                          {
                            color: textColor,
                            textAlign: rtl ? 'right' : 'left',
                          },
                        ]}
                      >
                        {lesson.title}
                      </Text>
                      <View style={[styles.lessonMeta, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                        <Text style={[styles.metaText, { color: text3Color }]}>
                          {lesson.level}
                        </Text>
                        <View style={styles.metaDivider} />
                        <Text style={[styles.metaText, { color: text3Color }]}>
                          {lesson.duration} min
                        </Text>
                        <View style={styles.metaDivider} />
                        <BoltIcon size={12} color={Colors.indigo} />
                        <Text style={[styles.xpText, { color: Colors.indigo }]}>
                          {lesson.xp} XP
                        </Text>
                      </View>
                      {lesson.status === 'inProgress' && lesson.progress != null && (
                        <ProgressBar value={lesson.progress} height={4} dark={dark} style={styles.lessonProgress} />
                      )}
                    </View>
                    <StatusBadge status={lesson.status} dark={dark} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingBottom: 28 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold },
  pathCard: { marginHorizontal: 20, marginBottom: 16, gap: 12 },
  pathRow: { justifyContent: 'space-between', alignItems: 'flex-start' },
  pathInfo: { gap: 3 },
  pathTitle: { fontSize: FontSize.base, fontWeight: FontWeight.bold },
  pathSub: { fontSize: FontSize.xs },
  pathBadge: { borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 6 },
  pathBadgeText: { color: '#FFFFFF', fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  chipScroll: { paddingHorizontal: 20, paddingBottom: 16, gap: 8 },
  section: { paddingHorizontal: 20, gap: 12 },
  lessonList: { gap: 10 },
  lessonCard: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    gap: 12,
  },
  lessonEmoji: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonEmojiText: { fontSize: 22 },
  lessonInfo: { flex: 1, gap: 5 },
  lessonTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  lessonMeta: { alignItems: 'center', gap: 5 },
  metaText: { fontSize: FontSize.xs },
  metaDivider: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.text3 },
  xpText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  lessonProgress: { width: '100%', marginTop: 2 },
});
