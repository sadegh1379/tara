import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { Colors, FontSize, FontWeight, Radius, Gradients } from '@/constants/tokens';
import Card from '@/components/Card';
import ProgressBar from '@/components/ProgressBar';
import { ChevLeftIcon, MicFillIcon, SpeakerIcon } from '@/components/icons';

interface DrillWord {
  word: string;
  phonetic: string;
  score: number | null;
  status: 'idle' | 'recording' | 'done';
}

const DRILL_WORDS: DrillWord[] = [
  { word: 'Pronunciation', phonetic: '/prəˌnʌn.siˈeɪ.ʃən/', score: null, status: 'idle' },
  { word: 'Vocabulary', phonetic: '/vəˈkæb.jʊ.lər.i/', score: null, status: 'idle' },
  { word: 'Grammar', phonetic: '/ˈɡræm.ər/', score: null, status: 'idle' },
  { word: 'Fluency', phonetic: '/ˈfluː.ən.si/', score: null, status: 'idle' },
  { word: 'Comprehension', phonetic: '/ˌkɒm.prɪˈhen.ʃən/', score: null, status: 'idle' },
];

function ScoreColor(score: number): string {
  if (score >= 85) return Colors.success;
  if (score >= 65) return Colors.amber;
  return Colors.error ?? '#EF4444';
}

function ScoreLabel(score: number, t: (key: string) => string): string {
  if (score >= 85) return t('pronunciation.excellent');
  if (score >= 65) return t('pronunciation.good');
  return t('pronunciation.needsPractice');
}

export default function PronunciationScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dark, rtl } = useAppStore();
  const [words, setWords] = useState<DrillWord[]>(DRILL_WORDS);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [recording, setRecording] = useState(false);

  const bg = dark ? Colors.d_bg : '#F8FAFC';
  const textColor = dark ? Colors.d_text : Colors.text;
  const text2Color = dark ? Colors.d_text2 : Colors.text2;
  const text3Color = dark ? Colors.d_text3 : Colors.text3;

  const handleRecord = (index: number) => {
    setActiveIndex(index);
    setRecording(true);
    // Simulate recording + scoring
    setTimeout(() => {
      const score = Math.floor(Math.random() * 40) + 60;
      setWords((w) =>
        w.map((word, i) =>
          i === index ? { ...word, score, status: 'done' } : word
        )
      );
      setRecording(false);
    }, 2000);
  };

  const completedCount = words.filter((w) => w.status === 'done').length;
  const overallScore =
    completedCount > 0
      ? Math.round(
          words
            .filter((w) => w.score !== null)
            .reduce((sum, w) => sum + (w.score ?? 0), 0) / completedCount
        )
      : 0;

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevLeftIcon size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            {t('pronunciation.title')}
          </Text>
          <View style={styles.backBtn} />
        </View>

        {/* Score overview */}
        {completedCount > 0 && (
          <LinearGradient
            colors={Gradients.deep}
            style={styles.scoreCard}
          >
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreTitle}>{t('pronunciation.yourScore')}</Text>
              <Text style={styles.scoreValue}>{overallScore}%</Text>
            </View>
            <ProgressBar value={overallScore / 100} height={8} />
            <Text style={styles.scoreLabel}>
              {completedCount}/{words.length} {t('common.done')}
            </Text>
          </LinearGradient>
        )}

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.hint, { color: text3Color, textAlign: rtl ? 'right' : 'left' }]}>
            {t('pronunciation.tapToRecord')}
          </Text>

          {words.map((w, i) => {
            const isActive = activeIndex === i;
            return (
              <Card
                key={w.word}
                dark={dark}
                style={[
                  styles.wordCard,
                  {
                    borderColor:
                      w.status === 'done'
                        ? ScoreColor(w.score ?? 0)
                        : isActive
                        ? Colors.indigo
                        : dark
                        ? Colors.d_border
                        : Colors.cardBorder,
                    borderWidth: w.status === 'done' || isActive ? 2 : 1,
                  },
                ]}
                pad={16}
              >
                <View style={[styles.wordRow, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.wordInfo, { alignItems: rtl ? 'flex-end' : 'flex-start' }]}>
                    <Text style={[styles.wordText, { color: textColor }]}>{w.word}</Text>
                    <Text style={[styles.phoneticText, { color: text3Color }]}>{w.phonetic}</Text>
                    {w.score !== null && (
                      <View style={[styles.scoreRow, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                        <Text style={[styles.wordScore, { color: ScoreColor(w.score) }]}>
                          {w.score}%
                        </Text>
                        <Text style={[styles.scoreLabel2, { color: ScoreColor(w.score) }]}>
                          {ScoreLabel(w.score, t)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.wordActions}>
                    <TouchableOpacity
                      style={[
                        styles.listenBtn,
                        { backgroundColor: dark ? Colors.d_card2 : '#EEF2FF' },
                      ]}
                    >
                      <SpeakerIcon size={18} color={Colors.indigo} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleRecord(i)}
                      style={[
                        styles.recordBtn,
                        {
                          backgroundColor:
                            recording && isActive
                              ? '#FEE2E2'
                              : w.status === 'done'
                              ? '#F0FDF4'
                              : Colors.indigo,
                        },
                      ]}
                      disabled={recording}
                    >
                      <MicFillIcon
                        size={18}
                        color={
                          recording && isActive
                            ? '#DC2626'
                            : w.status === 'done'
                            ? Colors.success
                            : '#FFFFFF'
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                {recording && isActive && (
                  <View style={styles.recordingIndicator}>
                    <View style={styles.recordingDot} />
                    <Text style={styles.recordingLabel}>Recording...</Text>
                  </View>
                )}
              </Card>
            );
          })}
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
  scoreCard: {
    margin: 20,
    marginTop: 4,
    borderRadius: Radius.xl,
    padding: 18,
    gap: 10,
  },
  scoreHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scoreTitle: { color: 'rgba(255,255,255,0.8)', fontSize: FontSize.sm },
  scoreValue: { color: '#FFFFFF', fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold },
  scoreLabel: { color: 'rgba(255,255,255,0.65)', fontSize: FontSize.xs, textAlign: 'right' },
  scroll: { paddingHorizontal: 20, paddingBottom: 28, gap: 12 },
  hint: { fontSize: FontSize.sm, marginBottom: 4 },
  wordCard: { gap: 0 },
  wordRow: { alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  wordInfo: { flex: 1, gap: 4 },
  wordText: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  phoneticText: { fontSize: FontSize.sm },
  scoreRow: { alignItems: 'center', gap: 8, marginTop: 2 },
  wordScore: { fontSize: FontSize.md, fontWeight: FontWeight.extrabold },
  scoreLabel2: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold },
  wordActions: { flexDirection: 'row', gap: 10 },
  listenBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  recordingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  recordingLabel: { fontSize: FontSize.xs, color: '#DC2626', fontWeight: FontWeight.medium },
});
