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
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { Colors, FontSize, FontWeight, Radius } from '@/constants/tokens';
import PrimaryBtn from '@/components/PrimaryBtn';

const { width: W } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (W - 48 - CARD_GAP) / 2;

interface GoalItem {
  id: string;
  key: 'travel' | 'business' | 'academic' | 'daily' | 'immigration' | 'general';
  emoji: string;
}

const GOALS: GoalItem[] = [
  { id: 'travel', key: 'travel', emoji: '✈️' },
  { id: 'business', key: 'business', emoji: '💼' },
  { id: 'academic', key: 'academic', emoji: '🎓' },
  { id: 'daily', key: 'daily', emoji: '💬' },
  { id: 'immigration', key: 'immigration', emoji: '🌍' },
  { id: 'general', key: 'general', emoji: '⭐' },
];

function StepDots({ current, total }: { current: number; total: number }) {
  const { dark } = useAppStore();
  return (
    <View style={dotStyles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            dotStyles.dot,
            {
              backgroundColor:
                i + 1 === current
                  ? Colors.indigo
                  : dark
                  ? Colors.d_border
                  : Colors.border,
              width: i + 1 === current ? 20 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
}

const dotStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});

export default function GoalScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dark, rtl, setGoal } = useAppStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const bg = dark ? Colors.d_bg : '#FAFAFF';
  const textColor = dark ? Colors.d_text : Colors.text;
  const text2Color = dark ? Colors.d_text2 : Colors.text2;

  const handleContinue = () => {
    if (selectedId) {
      setGoal(selectedId);
      router.push('/(auth)/level');
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={[styles.header, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={[styles.backLabel, { color: Colors.indigo }]}>
              {t('common.back')}
            </Text>
          </TouchableOpacity>
          <StepDots current={1} total={3} />
          <View style={styles.backBtn} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={styles.titleBlock}>
            <Text
              style={[
                styles.title,
                { color: textColor, textAlign: rtl ? 'right' : 'left' },
              ]}
            >
              {t('goals.title')}
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: text2Color, textAlign: rtl ? 'right' : 'left' },
              ]}
            >
              {t('goals.subtitle')}
            </Text>
          </View>

          {/* Goals grid */}
          <View style={styles.grid}>
            {GOALS.map((goal) => {
              const selected = selectedId === goal.id;
              return (
                <TouchableOpacity
                  key={goal.id}
                  onPress={() => setSelectedId(goal.id)}
                  activeOpacity={0.82}
                  style={[
                    styles.goalCard,
                    {
                      width: CARD_WIDTH,
                      backgroundColor: selected
                        ? '#EEF2FF'
                        : dark
                        ? Colors.d_card
                        : '#FFFFFF',
                      borderColor: selected
                        ? Colors.indigo
                        : dark
                        ? Colors.d_border
                        : Colors.cardBorder,
                    },
                  ]}
                >
                  <Text style={styles.emoji}>{goal.emoji}</Text>
                  <Text
                    style={[
                      styles.goalLabel,
                      {
                        color: selected
                          ? Colors.indigoDeep
                          : dark
                          ? Colors.d_text
                          : Colors.text,
                        textAlign: 'center',
                      },
                    ]}
                  >
                    {t(`goals.items.${goal.key}`)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* CTA */}
        <View style={styles.ctaBlock}>
          <PrimaryBtn
            full
            onPress={handleContinue}
            disabled={!selectedId}
            height={56}
          >
            {t('common.continue')}
          </PrimaryBtn>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 60,
  },
  backLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  titleBlock: {
    marginTop: 20,
    marginBottom: 28,
    gap: 8,
  },
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.base,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  goalCard: {
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    minHeight: 110,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 32,
  },
  goalLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  ctaBlock: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
});
