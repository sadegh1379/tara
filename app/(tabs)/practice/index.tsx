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
import Card from '@/components/Card';
import SectionTitle from '@/components/SectionTitle';
import { ChevRightIcon, BoltIcon } from '@/components/icons';

const { width: W } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'pronunciation', title: 'Pronunciation', emoji: '🗣️', color: '#EEF2FF', route: '/(tabs)/practice/pronunciation' },
  { id: 'grammar', title: 'Grammar', emoji: '📚', color: '#F0FDF4', route: null },
  { id: 'vocabulary', title: 'Vocabulary', emoji: '📖', color: '#FEF3C7', route: null },
  { id: 'idioms', title: 'Idioms', emoji: '💡', color: '#FCE7F3', route: null },
  { id: 'phrasal', title: 'Phrasal Verbs', emoji: '🔀', color: '#EFF6FF', route: null },
  { id: 'listening', title: 'Listening', emoji: '🎧', color: '#F0FDF4', route: null },
];

const FLASHCARD = {
  word: 'Serendipity',
  phonetic: '/ˌser.ənˈdɪp.ɪ.ti/',
  meaning: 'The occurrence of events by chance in a happy or beneficial way.',
  example: 'It was pure serendipity that I found my dream job.',
  difficulty: 'C1',
};

export default function PracticeHomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dark, rtl } = useAppStore();

  const bg = dark ? Colors.d_bg : '#F8FAFC';
  const textColor = dark ? Colors.d_text : Colors.text;
  const text2Color = dark ? Colors.d_text2 : Colors.text2;
  const text3Color = dark ? Colors.d_text3 : Colors.text3;

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Header */}
          <View style={[styles.header, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
            <Text style={[styles.headerTitle, { color: textColor }]}>
              {t('practice.title')}
            </Text>
          </View>

          {/* Daily challenge */}
          <LinearGradient
            colors={['#1E1B4B', '#312E81']}
            style={styles.challengeCard}
          >
            <View style={[styles.challengeContent, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
              <View style={styles.challengeText}>
                <View style={styles.challengeBadge}>
                  <Text style={styles.challengeBadgeText}>🔥 {t('practice.dailyChallenge')}</Text>
                </View>
                <Text style={styles.challengeTitle}>5 Grammar Drills</Text>
                <Text style={styles.challengeDesc}>Complete today's drills for bonus XP</Text>
                <View style={styles.challengeReward}>
                  <BoltIcon size={14} color={Colors.amber} />
                  <Text style={styles.challengeRewardText}>+50 XP</Text>
                </View>
              </View>
              <View style={styles.challengeProgress}>
                <Text style={styles.challengeProgressNum}>2/5</Text>
                <Text style={styles.challengeProgressLabel}>done</Text>
              </View>
            </View>
            <View
              style={[
                styles.challengeBar,
                { backgroundColor: 'rgba(255,255,255,0.15)' },
              ]}
            >
              <LinearGradient
                colors={Gradients.primary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.challengeBarFill, { width: '40%' }]}
              />
            </View>
          </LinearGradient>

          {/* Categories */}
          <View style={styles.section}>
            <SectionTitle title={t('practice.categories')} dark={dark} />
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => cat.route ? router.push(cat.route as any) : null}
                  activeOpacity={0.82}
                  style={[
                    styles.categoryCard,
                    {
                      backgroundColor: dark ? Colors.d_card : '#FFFFFF',
                      borderColor: dark ? Colors.d_border : Colors.cardBorder,
                      width: (W - 52) / 2,
                    },
                  ]}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: cat.color }]}>
                    <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  </View>
                  <Text style={[styles.categoryTitle, { color: textColor }]}>{cat.title}</Text>
                  <ChevRightIcon size={16} color={text3Color} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Flashcard */}
          <View style={styles.section}>
            <SectionTitle title={t('practice.flashcard')} dark={dark} />
            <LinearGradient
              colors={Gradients.deep}
              style={styles.flashcard}
            >
              <View style={[styles.flashcardHeader, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                <Text style={styles.flashcardWord}>{FLASHCARD.word}</Text>
                <View style={styles.diffBadge}>
                  <Text style={styles.diffBadgeText}>{FLASHCARD.difficulty}</Text>
                </View>
              </View>
              <Text style={styles.flashcardPhonetic}>{FLASHCARD.phonetic}</Text>
              <View style={styles.flashcardDivider} />
              <Text style={styles.flashcardMeaning}>{FLASHCARD.meaning}</Text>
              <Text style={styles.flashcardExample}>"{FLASHCARD.example}"</Text>
            </LinearGradient>
          </View>

          {/* Mistakes review */}
          <View style={styles.section}>
            <SectionTitle
              title={t('practice.mistakes')}
              action="See all"
              onAction={() => router.push('/(tabs)/practice/mistakes')}
              dark={dark}
            />
            <Card dark={dark} style={styles.mistakesPreview} pad={16} onPress={() => router.push('/(tabs)/practice/mistakes')}>
              <View style={[styles.mistakesRow, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                <Text style={styles.mistakesEmoji}>📝</Text>
                <View style={[styles.mistakesInfo, { alignItems: rtl ? 'flex-end' : 'flex-start' }]}>
                  <Text style={[styles.mistakesTitle, { color: textColor }]}>3 mistakes to review</Text>
                  <Text style={[styles.mistakesSub, { color: text3Color }]}>Grammar · Vocabulary</Text>
                </View>
                <ChevRightIcon size={20} color={text3Color} />
              </View>
            </Card>
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
  challengeCard: {
    marginHorizontal: 20,
    borderRadius: Radius.xxl,
    padding: 20,
    marginBottom: 24,
    gap: 16,
  },
  challengeContent: { justifyContent: 'space-between', alignItems: 'flex-start' },
  challengeText: { flex: 1, gap: 6 },
  challengeBadge: {
    backgroundColor: 'rgba(245,158,11,0.25)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  challengeBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: '#FDE68A' },
  challengeTitle: { color: '#FFFFFF', fontSize: FontSize.xl, fontWeight: FontWeight.extrabold },
  challengeDesc: { color: 'rgba(255,255,255,0.65)', fontSize: FontSize.sm },
  challengeReward: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  challengeRewardText: { color: Colors.amber, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  challengeProgress: { alignItems: 'center', gap: 2 },
  challengeProgressNum: { color: '#FFFFFF', fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold },
  challengeProgressLabel: { color: 'rgba(255,255,255,0.6)', fontSize: FontSize.xs },
  challengeBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  challengeBarFill: { height: '100%', borderRadius: 4 },
  section: { paddingHorizontal: 20, marginBottom: 24, gap: 12 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryCard: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryEmoji: { fontSize: 20 },
  categoryTitle: { flex: 1, fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  flashcard: {
    borderRadius: Radius.xxl,
    padding: 24,
    gap: 8,
  },
  flashcardHeader: { justifyContent: 'space-between', alignItems: 'center' },
  flashcardWord: { color: '#FFFFFF', fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold },
  diffBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  diffBadgeText: { color: '#FFFFFF', fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  flashcardPhonetic: { color: 'rgba(255,255,255,0.65)', fontSize: FontSize.sm },
  flashcardDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 8 },
  flashcardMeaning: { color: '#FFFFFF', fontSize: FontSize.base, lineHeight: 22, fontWeight: FontWeight.medium },
  flashcardExample: { color: 'rgba(255,255,255,0.75)', fontSize: FontSize.sm, fontStyle: 'italic', lineHeight: 20 },
  mistakesPreview: {},
  mistakesRow: { alignItems: 'center', gap: 12 },
  mistakesEmoji: { fontSize: 24 },
  mistakesInfo: { flex: 1, gap: 3 },
  mistakesTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  mistakesSub: { fontSize: FontSize.xs },
});
