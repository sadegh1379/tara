import React from 'react';
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
import TaraOrb from '@/components/TaraOrb';
import PrimaryBtn from '@/components/PrimaryBtn';

interface Feature {
  icon: string;
  titleKey: string;
  descKey: string;
}

const FEATURES: Feature[] = [
  { icon: '🎙️', titleKey: 'speaking', descKey: 'speakingDesc' },
  { icon: '🤖', titleKey: 'ai', descKey: 'aiDesc' },
  { icon: '⚡', titleKey: 'result', descKey: 'resultDesc' },
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

export default function TestIntroScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dark, rtl } = useAppStore();

  const bg = dark ? Colors.d_bg : '#FAFAFF';
  const textColor = dark ? Colors.d_text : Colors.text;
  const text2Color = dark ? Colors.d_text2 : Colors.text2;

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
          <StepDots current={3} total={3} />
          <View style={styles.backBtn} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Orb */}
          <View style={styles.orbContainer}>
            <TaraOrb size={120} state="listening" dark={dark} />
          </View>

          {/* Title */}
          <View style={styles.titleBlock}>
            <Text
              style={[
                styles.title,
                { color: textColor, textAlign: 'center' },
              ]}
            >
              {t('testIntro.title')}
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: text2Color, textAlign: 'center' },
              ]}
            >
              {t('testIntro.subtitle')}
            </Text>
          </View>

          {/* Feature cards */}
          <View style={styles.featureList}>
            {FEATURES.map((feat) => (
              <View
                key={feat.titleKey}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: dark ? Colors.d_card : '#FFFFFF',
                    borderColor: dark ? Colors.d_border : Colors.cardBorder,
                    flexDirection: rtl ? 'row-reverse' : 'row',
                  },
                ]}
              >
                <View style={styles.featureIconWrap}>
                  <Text style={styles.featureIcon}>{feat.icon}</Text>
                </View>
                <View style={[styles.featureText, { alignItems: rtl ? 'flex-end' : 'flex-start' }]}>
                  <Text
                    style={[
                      styles.featureTitle,
                      { color: textColor, textAlign: rtl ? 'right' : 'left' },
                    ]}
                  >
                    {t(`testIntro.features.${feat.titleKey}`)}
                  </Text>
                  <Text
                    style={[
                      styles.featureDesc,
                      { color: text2Color, textAlign: rtl ? 'right' : 'left' },
                    ]}
                  >
                    {t(`testIntro.features.${feat.descKey}`)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.ctaBlock}>
          <PrimaryBtn
            full
            onPress={() => router.push('/(auth)/test-live')}
            height={56}
          >
            {t('testIntro.startTest')}
          </PrimaryBtn>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/result')}
            style={styles.skipLink}
            activeOpacity={0.7}
          >
            <Text style={[styles.skipLabel, { color: Colors.text3 }]}>
              {t('testIntro.skipTest')}
            </Text>
          </TouchableOpacity>
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
  orbContainer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  titleBlock: { marginTop: 8, marginBottom: 28, gap: 10 },
  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.extrabold,
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: FontSize.base, lineHeight: 22 },
  featureList: { gap: 12 },
  featureCard: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    gap: 14,
  },
  featureIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIcon: { fontSize: 22 },
  featureText: { flex: 1, gap: 3 },
  featureTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  featureDesc: { fontSize: FontSize.sm, lineHeight: 18 },
  ctaBlock: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
    gap: 12,
  },
  skipLink: { alignItems: 'center', paddingVertical: 4 },
  skipLabel: { fontSize: FontSize.sm, textAlign: 'center' },
});
