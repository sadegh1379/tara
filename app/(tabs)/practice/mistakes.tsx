import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { Colors, FontSize, FontWeight, Radius } from '@/constants/tokens';
import Card from '@/components/Card';
import { ChevLeftIcon, CheckIcon } from '@/components/icons';

interface MistakeItem {
  id: string;
  original: string;
  corrected: string;
  type: string;
  date: string;
  mastered: boolean;
}

const MISTAKES_DATA: MistakeItem[] = [
  {
    id: '1',
    original: 'I goed to the store',
    corrected: 'I went to the store',
    type: 'Grammar',
    date: 'Today',
    mastered: false,
  },
  {
    id: '2',
    original: 'Yesterday night',
    corrected: 'Last night',
    type: 'Vocabulary',
    date: 'Today',
    mastered: false,
  },
  {
    id: '3',
    original: 'More better',
    corrected: 'Better / Much better',
    type: 'Grammar',
    date: 'Yesterday',
    mastered: false,
  },
  {
    id: '4',
    original: 'I am agree',
    corrected: 'I agree',
    type: 'Grammar',
    date: '2 days ago',
    mastered: true,
  },
  {
    id: '5',
    original: 'I have 30 years',
    corrected: 'I am 30 years old',
    type: 'Grammar',
    date: '3 days ago',
    mastered: true,
  },
];

export default function MistakesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dark, rtl } = useAppStore();
  const [mistakes, setMistakes] = useState<MistakeItem[]>(MISTAKES_DATA);
  const [filter, setFilter] = useState<'all' | 'learning' | 'mastered'>('all');

  const bg = dark ? Colors.d_bg : '#F8FAFC';
  const textColor = dark ? Colors.d_text : Colors.text;
  const text2Color = dark ? Colors.d_text2 : Colors.text2;
  const text3Color = dark ? Colors.d_text3 : Colors.text3;

  const filtered =
    filter === 'all'
      ? mistakes
      : filter === 'mastered'
      ? mistakes.filter((m) => m.mastered)
      : mistakes.filter((m) => !m.mastered);

  const handleMaster = (id: string) => {
    setMistakes((ms) =>
      ms.map((m) => (m.id === id ? { ...m, mastered: !m.mastered } : m))
    );
  };

  const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'learning', label: t('mistakes.stillLearning') },
    { key: 'mastered', label: t('mistakes.mastered') },
  ] as const;

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevLeftIcon size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            {t('mistakes.title')}
          </Text>
          <View style={styles.backBtn} />
        </View>

        {/* Stats row */}
        <View style={[styles.statsRow, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
          <Card dark={dark} style={styles.statMini} pad={12}>
            <Text style={[styles.statNum, { color: Colors.amber }]}>
              {mistakes.filter((m) => !m.mastered).length}
            </Text>
            <Text style={[styles.statLabel, { color: text3Color }]}>{t('mistakes.stillLearning')}</Text>
          </Card>
          <Card dark={dark} style={styles.statMini} pad={12}>
            <Text style={[styles.statNum, { color: Colors.success }]}>
              {mistakes.filter((m) => m.mastered).length}
            </Text>
            <Text style={[styles.statLabel, { color: text3Color }]}>{t('mistakes.mastered')}</Text>
          </Card>
          <Card dark={dark} style={styles.statMini} pad={12}>
            <Text style={[styles.statNum, { color: Colors.indigo }]}>{mistakes.length}</Text>
            <Text style={[styles.statLabel, { color: text3Color }]}>Total</Text>
          </Card>
        </View>

        {/* Filter tabs */}
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[
                styles.filterTab,
                {
                  backgroundColor:
                    filter === f.key
                      ? Colors.indigo
                      : dark
                      ? Colors.d_card2
                      : '#F1F5F9',
                },
              ]}
            >
              <Text
                style={[
                  styles.filterLabel,
                  {
                    color:
                      filter === f.key
                        ? '#FFFFFF'
                        : dark
                        ? Colors.d_text2
                        : Colors.text2,
                  },
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🎉</Text>
              <Text style={[styles.emptyText, { color: text2Color }]}>
                {t('mistakes.empty')}
              </Text>
            </View>
          ) : (
            filtered.map((m) => (
              <Card key={m.id} dark={dark} style={styles.mistakeCard} pad={16}>
                <View style={[styles.mistakeHeader, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
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
                  <Text style={[styles.dateText, { color: text3Color }]}>{m.date}</Text>
                </View>

                <View style={styles.comparison}>
                  <View
                    style={[
                      styles.compLine,
                      { backgroundColor: '#FEF2F2', flexDirection: rtl ? 'row-reverse' : 'row' },
                    ]}
                  >
                    <Text style={styles.xMark}>✗</Text>
                    <Text style={[styles.compText, { color: '#DC2626' }]}>"{m.original}"</Text>
                  </View>
                  <View
                    style={[
                      styles.compLine,
                      { backgroundColor: '#F0FDF4', flexDirection: rtl ? 'row-reverse' : 'row' },
                    ]}
                  >
                    <CheckIcon size={14} color={Colors.success} />
                    <Text style={[styles.compText, { color: '#15803D' }]}>"{m.corrected}"</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleMaster(m.id)}
                  style={[
                    styles.masterBtn,
                    {
                      backgroundColor: m.mastered
                        ? '#F0FDF4'
                        : dark
                        ? Colors.d_card2
                        : '#F8FAFC',
                      borderColor: m.mastered ? Colors.success : dark ? Colors.d_border : Colors.border,
                    },
                  ]}
                >
                  {m.mastered && <CheckIcon size={14} color={Colors.success} />}
                  <Text
                    style={[
                      styles.masterLabel,
                      { color: m.mastered ? Colors.success : text3Color },
                    ]}
                  >
                    {m.mastered ? t('mistakes.mastered') : t('mistakes.markMastered')}
                  </Text>
                </TouchableOpacity>
              </Card>
            ))
          )}
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
  statsRow: { paddingHorizontal: 20, gap: 10, marginBottom: 16 },
  statMini: { flex: 1, alignItems: 'center', gap: 3 },
  statNum: { fontSize: FontSize.xl, fontWeight: FontWeight.extrabold },
  statLabel: { fontSize: 10, textAlign: 'center', fontWeight: FontWeight.medium },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    borderRadius: Radius.full,
    paddingVertical: 8,
    alignItems: 'center',
  },
  filterLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  scroll: { paddingHorizontal: 20, paddingBottom: 28, gap: 12 },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: FontSize.base, textAlign: 'center' },
  mistakeCard: { gap: 12 },
  mistakeHeader: { justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  typeBadgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  dateText: { fontSize: FontSize.xs },
  comparison: { gap: 6 },
  compLine: {
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    gap: 8,
  },
  xMark: { fontSize: 14, fontWeight: FontWeight.bold, color: '#DC2626' },
  compText: { flex: 1, fontSize: FontSize.sm, lineHeight: 18 },
  masterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    borderWidth: 1.5,
    paddingVertical: 8,
    gap: 6,
  },
  masterLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
});
