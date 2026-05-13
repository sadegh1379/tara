import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { Colors, FontSize, FontWeight, Radius, Gradients } from '@/constants/tokens';
import Card from '@/components/Card';
import PrimaryBtn from '@/components/PrimaryBtn';
import GhostBtn from '@/components/GhostBtn';
import ProgressBar from '@/components/ProgressBar';
import { FlameIcon, BoltIcon, CheckIcon } from '@/components/icons';

const STATS = [
  { labelKey: 'talkSummary.duration', value: '4:32', icon: '⏱️' },
  { labelKey: 'talkSummary.xpEarned', value: '+65 XP', icon: '⚡', highlight: true },
  { labelKey: 'talkSummary.wordsSpoken', value: '148', icon: '💬' },
  { labelKey: 'talkSummary.corrections', value: '3', icon: '✏️' },
];

const MISTAKES = [
  { original: 'I goed to the store', corrected: 'I went to the store', type: 'Grammar' },
  { original: 'Yesterday night', corrected: 'Last night', type: 'Vocabulary' },
  { original: 'More better', corrected: 'Better / Much better', type: 'Grammar' },
];

export default function TalkSummaryScreen() {
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
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <LinearGradient
            colors={Gradients.deep}
            style={styles.hero}
          >
            <Text style={styles.heroEmoji}>🎉</Text>
            <Text style={styles.heroTitle}>{t('talkSummary.great')}</Text>
            <View style={styles.heroScore}>
              <Text style={styles.heroScoreLabel}>{t('talkSummary.fluency')}</Text>
              <Text style={styles.heroScoreValue}>78%</Text>
            </View>
          </LinearGradient>

          {/* Stats grid */}
          <View style={styles.statsGrid}>
            {STATS.map((stat) => (
              <Card
                key={stat.labelKey}
                dark={dark}
                style={[styles.statCard, stat.highlight ? styles.statCardHighlight : {}]}
                pad={16}
                radius={18}
              >
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: stat.highlight ? Colors.indigo : textColor },
                  ]}
                >
                  {stat.value}
                </Text>
                <Text style={[styles.statLabel, { color: text3Color }]}>
                  {t(stat.labelKey as any)}
                </Text>
              </Card>
            ))}
          </View>

          {/* Accuracy */}
          <Card dark={dark} style={styles.accuracyCard} pad={18}>
            <View style={[styles.accuracyHeader, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.accuracyTitle, { color: textColor }]}>
                {t('talkSummary.accuracy')}
              </Text>
              <Text style={styles.accuracyValue}>82%</Text>
            </View>
            <ProgressBar value={0.82} dark={dark} height={8} />
          </Card>

          {/* Mistakes */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              {t('talkSummary.mistakes')}
            </Text>
            {MISTAKES.map((m, i) => (
              <Card key={i} dark={dark} style={styles.mistakeCard} pad={14}>
                <View style={[styles.mistakeType, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                  <View
                    style={[
                      styles.typeBadge,
                      { backgroundColor: m.type === 'Grammar' ? '#EEF2FF' : '#FEF3C7' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeBadgeText,
                        { color: m.type === 'Grammar' ? Colors.indigoDeep : '#92400E' },
                      ]}
                    >
                      {m.type}
                    </Text>
                  </View>
                </View>
                <View style={styles.mistakeComparison}>
                  <View
                    style={[
                      styles.mistakeLine,
                      { backgroundColor: '#FEF2F2', flexDirection: rtl ? 'row-reverse' : 'row' },
                    ]}
                  >
                    <Text style={styles.mistakeLabelX}>✗</Text>
                    <Text style={[styles.mistakeText, { color: '#DC2626' }]}>
                      "{m.original}"
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.mistakeLine,
                      { backgroundColor: '#F0FDF4', flexDirection: rtl ? 'row-reverse' : 'row' },
                    ]}
                  >
                    <CheckIcon size={14} color={Colors.success} />
                    <Text style={[styles.mistakeText, { color: '#15803D' }]}>
                      "{m.corrected}"
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </ScrollView>

        {/* Buttons */}
        <View
          style={[
            styles.footer,
            {
              backgroundColor: dark ? Colors.d_card : '#FFFFFF',
              borderTopColor: dark ? Colors.d_border : Colors.border,
            },
          ]}
        >
          <PrimaryBtn full onPress={() => router.push('/(tabs)/talk/room')} height={52}>
            {t('talkSummary.talkAgain')}
          </PrimaryBtn>
          <GhostBtn full dark={dark} onPress={() => router.replace('/(tabs)')} height={48}>
            {t('talkSummary.goHome')}
          </GhostBtn>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingBottom: 16 },
  hero: {
    padding: 28,
    alignItems: 'center',
    gap: 8,
  },
  heroEmoji: { fontSize: 48 },
  heroTitle: { color: '#FFFFFF', fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold },
  heroScore: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  heroScoreLabel: { color: 'rgba(255,255,255,0.75)', fontSize: FontSize.sm },
  heroScoreValue: { color: '#FFFFFF', fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    padding: 20,
    paddingBottom: 0,
  },
  statCard: { width: '46.5%', alignItems: 'center', gap: 4 },
  statCardHighlight: { borderWidth: 1.5, borderColor: Colors.indigo },
  statIcon: { fontSize: 22 },
  statValue: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold },
  statLabel: { fontSize: FontSize.xs, textAlign: 'center' },
  accuracyCard: { margin: 20, marginTop: 12, gap: 12 },
  accuracyHeader: { justifyContent: 'space-between', alignItems: 'center' },
  accuracyTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  accuracyValue: { fontSize: FontSize.lg, fontWeight: FontWeight.extrabold, color: Colors.success },
  section: { paddingHorizontal: 20, gap: 10 },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  mistakeCard: { gap: 10 },
  mistakeType: { alignItems: 'center' },
  typeBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  typeBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  mistakeComparison: { gap: 6 },
  mistakeLine: {
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    gap: 8,
  },
  mistakeLabelX: { fontSize: 14, color: '#DC2626', fontWeight: FontWeight.bold },
  mistakeText: { fontSize: FontSize.sm, flex: 1, lineHeight: 18 },
  footer: {
    padding: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
    gap: 10,
  },
});
