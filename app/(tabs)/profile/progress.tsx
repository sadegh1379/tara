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
import ProgressBar from '@/components/ProgressBar';
import { ChevLeftIcon, FlameIcon } from '@/components/icons';

const { width: W } = Dimensions.get('window');

type Period = 'week' | 'month' | 'all';

const WEEKLY_ACTIVITY = [30, 45, 20, 60, 15, 50, 35];
const WEEK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MAX_MINUTES = 70;

const SKILL_GROWTH = [
  { key: 'pronunciation', label: 'Pronunciation', before: 0.55, after: 0.72, color: '#818CF8' },
  { key: 'grammar', label: 'Grammar', before: 0.48, after: 0.64, color: '#A78BFA' },
  { key: 'vocabulary', label: 'Vocabulary', before: 0.62, after: 0.81, color: '#F472B6' },
  { key: 'fluency', label: 'Fluency', before: 0.50, after: 0.68, color: '#34D399' },
];

const PERIOD_STATS: Record<Period, { sessions: number; minutes: number; words: number; streak: number }> = {
  week: { sessions: 5, minutes: 255, words: 87, streak: 5 },
  month: { sessions: 19, minutes: 1140, words: 312, streak: 14 },
  all: { sessions: 67, minutes: 4280, words: 1205, streak: 14 },
};

export default function ProgressScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dark, rtl } = useAppStore();
  const [period, setPeriod] = useState<Period>('week');

  const bg = dark ? Colors.d_bg : '#F8FAFC';
  const textColor = dark ? Colors.d_text : Colors.text;
  const text2Color = dark ? Colors.d_text2 : Colors.text2;
  const text3Color = dark ? Colors.d_text3 : Colors.text3;

  const stats = PERIOD_STATS[period];

  const PERIODS: { key: Period; label: string }[] = [
    { key: 'week', label: t('progress.thisWeek') },
    { key: 'month', label: t('progress.thisMonth') },
    { key: 'all', label: t('progress.allTime') },
  ];

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevLeftIcon size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            {t('progress.title')}
          </Text>
          <View style={styles.backBtn} />
        </View>

        {/* Period tabs */}
        <View
          style={[
            styles.periodTabs,
            { backgroundColor: dark ? Colors.d_card2 : '#F1F5F9' },
          ]}
        >
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p.key}
              onPress={() => setPeriod(p.key)}
              style={[
                styles.periodTab,
                {
                  backgroundColor:
                    period === p.key
                      ? dark
                        ? Colors.d_card
                        : '#FFFFFF'
                      : 'transparent',
                },
              ]}
            >
              <Text
                style={[
                  styles.periodLabel,
                  {
                    color:
                      period === p.key
                        ? Colors.indigo
                        : dark
                        ? Colors.d_text2
                        : Colors.text2,
                    fontWeight:
                      period === p.key ? FontWeight.semibold : FontWeight.regular,
                  },
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats grid */}
          <View style={styles.statsGrid}>
            {[
              { label: 'Sessions', value: stats.sessions, icon: '🎙️' },
              { label: 'Minutes', value: stats.minutes, icon: '⏱️' },
              { label: 'Words', value: stats.words, icon: '📖' },
              { label: t('progress.streak'), value: stats.streak, icon: '🔥' },
            ].map((s) => (
              <Card key={s.label} dark={dark} style={styles.statCard} pad={14} radius={18}>
                <Text style={styles.statIcon}>{s.icon}</Text>
                <Text style={[styles.statValue, { color: textColor }]}>{s.value}</Text>
                <Text style={[styles.statLabel, { color: text3Color }]}>{s.label}</Text>
              </Card>
            ))}
          </View>

          {/* Activity chart */}
          {period === 'week' && (
            <Card dark={dark} style={styles.chartCard} pad={18}>
              <Text style={[styles.chartTitle, { color: textColor }]}>
                {t('progress.activityChart')}
              </Text>
              <View style={styles.barChart}>
                {WEEKLY_ACTIVITY.map((mins, i) => {
                  const heightPct = (mins / MAX_MINUTES) * 100;
                  return (
                    <View key={i} style={styles.barWrap}>
                      <View style={styles.barContainer}>
                        <LinearGradient
                          colors={Gradients.deep}
                          style={[styles.bar, { height: `${heightPct}%` }]}
                        />
                      </View>
                      <Text style={[styles.barDay, { color: text3Color }]}>{WEEK_DAYS[i]}</Text>
                      <Text style={[styles.barMins, { color: text3Color }]}>{mins}m</Text>
                    </View>
                  );
                })}
              </View>
            </Card>
          )}

          {/* Skill growth */}
          <Card dark={dark} style={styles.skillCard} pad={18}>
            <Text style={[styles.chartTitle, { color: textColor }]}>
              {t('progress.skillGrowth')}
            </Text>
            <View style={styles.skillList}>
              {SKILL_GROWTH.map((skill) => (
                <View key={skill.key} style={styles.skillItem}>
                  <View style={[styles.skillHeader, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                    <Text style={[styles.skillLabel, { color: textColor }]}>{skill.label}</Text>
                    <Text style={[styles.skillGain, { color: skill.color }]}>
                      +{Math.round((skill.after - skill.before) * 100)}%
                    </Text>
                  </View>
                  <View style={styles.skillBarWrap}>
                    {/* Before */}
                    <View
                      style={[
                        styles.beforeBar,
                        {
                          width: `${skill.before * 100}%`,
                          backgroundColor: dark ? Colors.d_card2 : '#E2E8F0',
                        },
                      ]}
                    />
                    {/* After */}
                    <View style={[styles.afterBarContainer, { width: `${skill.after * 100}%` }]}>
                      <LinearGradient
                        colors={[skill.color, skill.color + 'BB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.afterBar}
                      />
                    </View>
                  </View>
                  <View style={[styles.skillFooter, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                    <Text style={[styles.skillPct, { color: text3Color }]}>
                      Before: {Math.round(skill.before * 100)}%
                    </Text>
                    <Text style={[styles.skillPct, { color: skill.color }]}>
                      Now: {Math.round(skill.after * 100)}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  periodTabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: Radius.xl,
    padding: 4,
    marginBottom: 16,
  },
  periodTab: {
    flex: 1,
    borderRadius: Radius.lg,
    paddingVertical: 8,
    alignItems: 'center',
  },
  periodLabel: { fontSize: FontSize.xs },
  scroll: { paddingHorizontal: 20, paddingBottom: 28, gap: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: '46.5%', alignItems: 'center', gap: 4 },
  statIcon: { fontSize: 22 },
  statValue: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold },
  statLabel: { fontSize: FontSize.xs },
  chartCard: { gap: 16 },
  chartTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 140,
    gap: 6,
  },
  barWrap: { flex: 1, alignItems: 'center', height: '100%', gap: 4 },
  barContainer: { flex: 1, width: '100%', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 4, minHeight: 4 },
  barDay: { fontSize: 10, fontWeight: FontWeight.bold },
  barMins: { fontSize: 9 },
  skillCard: { gap: 16 },
  skillList: { gap: 14 },
  skillItem: { gap: 6 },
  skillHeader: { justifyContent: 'space-between', alignItems: 'center' },
  skillLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  skillGain: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  skillBarWrap: { height: 8, borderRadius: 4, position: 'relative' },
  beforeBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 8,
    borderRadius: 4,
  },
  afterBarContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 8,
    overflow: 'hidden',
    borderRadius: 4,
  },
  afterBar: { height: 8 },
  skillFooter: { justifyContent: 'space-between' },
  skillPct: { fontSize: FontSize.xs },
});
