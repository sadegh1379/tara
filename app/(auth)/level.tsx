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
import PrimaryBtn from '@/components/PrimaryBtn';
import { CheckIcon } from '@/components/icons';

interface LevelItem {
  id: string;
  key: 'beginner' | 'elementary' | 'intermediate' | 'advanced';
  cefr: string;
}

const LEVELS: LevelItem[] = [
  { id: 'beginner', key: 'beginner', cefr: 'A1 - A2' },
  { id: 'elementary', key: 'elementary', cefr: 'A2 - B1' },
  { id: 'intermediate', key: 'intermediate', cefr: 'B1 - B2' },
  { id: 'advanced', key: 'advanced', cefr: 'C1 - C2' },
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
                i + 1 <= current
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { height: 8, borderRadius: 4 },
});

export default function LevelScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dark, rtl, setLevel } = useAppStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const bg = dark ? Colors.d_bg : '#FAFAFF';
  const textColor = dark ? Colors.d_text : Colors.text;
  const text2Color = dark ? Colors.d_text2 : Colors.text2;

  const handleContinue = () => {
    if (selectedId) {
      setLevel(selectedId);
      router.push('/(auth)/test-intro');
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
          <StepDots current={2} total={3} />
          <View style={styles.backBtn} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.titleBlock}>
            <Text
              style={[
                styles.title,
                { color: textColor, textAlign: rtl ? 'right' : 'left' },
              ]}
            >
              {t('levels.title')}
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: text2Color, textAlign: rtl ? 'right' : 'left' },
              ]}
            >
              {t('levels.subtitle')}
            </Text>
          </View>

          <View style={styles.list}>
            {LEVELS.map((level) => {
              const selected = selectedId === level.id;
              return (
                <TouchableOpacity
                  key={level.id}
                  onPress={() => setSelectedId(level.id)}
                  activeOpacity={0.82}
                  style={[
                    styles.levelRow,
                    {
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
                      flexDirection: rtl ? 'row-reverse' : 'row',
                    },
                  ]}
                >
                  <View style={[styles.levelInfo, { alignItems: rtl ? 'flex-end' : 'flex-start' }]}>
                    <Text
                      style={[
                        styles.levelName,
                        {
                          color: selected
                            ? Colors.indigoDeep
                            : dark
                            ? Colors.d_text
                            : Colors.text,
                        },
                      ]}
                    >
                      {t(`levels.items.${level.key}`)}
                    </Text>
                    <Text
                      style={[
                        styles.levelDesc,
                        { color: dark ? Colors.d_text2 : Colors.text2 },
                      ]}
                    >
                      {t(`levels.descriptions.${level.key}`)}
                    </Text>
                  </View>
                  <View style={styles.levelRight}>
                    <View
                      style={[
                        styles.cefrBadge,
                        {
                          backgroundColor: selected ? Colors.indigo : dark ? Colors.d_card2 : '#F1F5F9',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.cefrLabel,
                          { color: selected ? '#FFFFFF' : dark ? Colors.d_text2 : Colors.text2 },
                        ]}
                      >
                        {level.cefr}
                      </Text>
                    </View>
                    {selected && (
                      <View style={styles.checkCircle}>
                        <CheckIcon size={16} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

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
  root: { flex: 1 },
  safe: { flex: 1 },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: { width: 60 },
  backLabel: { fontSize: FontSize.base, fontWeight: FontWeight.medium },
  scroll: { paddingHorizontal: 24, paddingBottom: 20 },
  titleBlock: { marginTop: 20, marginBottom: 28, gap: 8 },
  title: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: FontSize.base, lineHeight: 22 },
  list: { gap: 12 },
  levelRow: {
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  levelInfo: { flex: 1, gap: 4 },
  levelName: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  levelDesc: { fontSize: FontSize.sm, lineHeight: 18 },
  levelRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cefrBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  cefrLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBlock: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12 },
});
