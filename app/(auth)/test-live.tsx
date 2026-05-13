import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { Colors, FontSize, FontWeight, Radius, Gradients } from '@/constants/tokens';
import TaraOrb, { OrbState } from '@/components/TaraOrb';
import Waveform from '@/components/Waveform';
import { MicFillIcon, CloseIcon } from '@/components/icons';

const { width: W } = Dimensions.get('window');

type SessionState = 'listening' | 'processing' | 'speaking';

const QUESTIONS = ['question1', 'question2', 'question3'];

const SAMPLE_TRANSCRIPTS = [
  "Hi, I'm a software developer and I want to improve my English for international meetings.",
  'I love visiting old cities with rich history and beautiful architecture.',
  'In five years, I see myself leading a development team and working on global projects.',
];

export default function TestLiveScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dark, rtl } = useAppStore();

  const [sessionState, setSessionState] = useState<SessionState>('listening');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [active, setActive] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setActive(true);
    startCycle();
    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (cycleRef.current) clearInterval(cycleRef.current);
    };
  }, []);

  const startCycle = () => {
    cycleRef.current = setInterval(() => {
      setSessionState((prev) => {
        if (prev === 'listening') {
          setTranscripts((t) => [
            ...t,
            SAMPLE_TRANSCRIPTS[questionIndex % SAMPLE_TRANSCRIPTS.length],
          ]);
          return 'processing';
        }
        if (prev === 'processing') return 'speaking';
        if (prev === 'speaking') {
          setQuestionIndex((q) => {
            const next = q + 1;
            if (next >= QUESTIONS.length) {
              if (cycleRef.current) clearInterval(cycleRef.current);
              if (timerRef.current) clearInterval(timerRef.current);
              setTimeout(() => router.replace('/(auth)/result'), 600);
            }
            return next;
          });
          return 'listening';
        }
        return prev;
      });
    }, 3200);
  };

  const getOrbState = (): OrbState => {
    if (sessionState === 'listening') return 'listening';
    if (sessionState === 'processing') return 'thinking';
    if (sessionState === 'speaking') return 'speaking';
    return 'idle';
  };

  const getStatusLabel = () => {
    if (sessionState === 'listening') return t('testLive.listening');
    if (sessionState === 'processing') return t('testLive.thinking');
    return t('testLive.speaking');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <LinearGradient
      colors={['#0B0F1E', '#13103A', '#0B0F1E']}
      style={styles.root}
    >
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={[styles.header, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
          <Text style={styles.headerTitle}>{t('testLive.title')}</Text>
          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>{formatTime(elapsed)}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/result')}
            style={styles.closeBtn}
          >
            <CloseIcon size={22} color={Colors.d_text2} />
          </TouchableOpacity>
        </View>

        {/* Orb */}
        <View style={styles.orbSection}>
          <TaraOrb size={130} state={getOrbState()} dark={true} />
          <Text style={styles.statusLabel}>{getStatusLabel()}</Text>
          {(sessionState === 'listening' || sessionState === 'speaking') && (
            <Waveform
              bars={24}
              animated={active}
              height={44}
              color={sessionState === 'listening' ? '#818CF8' : '#A78BFA'}
              dark
            />
          )}
        </View>

        {/* Question card */}
        <View style={[styles.questionCard, { alignItems: rtl ? 'flex-end' : 'flex-start' }]}>
          <View style={styles.questionBadge}>
            <Text style={styles.questionBadgeText}>
              {questionIndex + 1} / {QUESTIONS.length}
            </Text>
          </View>
          <Text
            style={[
              styles.questionText,
              { textAlign: rtl ? 'right' : 'left' },
            ]}
          >
            {t(`testLive.${QUESTIONS[questionIndex] as 'question1' | 'question2' | 'question3'}`)}
          </Text>
        </View>

        {/* Transcript bubbles */}
        <ScrollView
          style={styles.transcriptScroll}
          contentContainerStyle={styles.transcriptContent}
          showsVerticalScrollIndicator={false}
        >
          {transcripts.map((text, i) => (
            <View
              key={i}
              style={[
                styles.transcriptBubble,
                { alignSelf: rtl ? 'flex-start' : 'flex-end' },
              ]}
            >
              <Text style={styles.transcriptText}>{text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Mic button */}
        <View style={styles.micSection}>
          <TouchableOpacity
            style={[
              styles.micBtn,
              {
                backgroundColor:
                  sessionState === 'listening'
                    ? Colors.indigo
                    : 'rgba(255,255,255,0.12)',
              },
            ]}
            activeOpacity={0.82}
          >
            <LinearGradient
              colors={sessionState === 'listening' ? Gradients.deep : ['transparent', 'transparent']}
              style={styles.micGradient}
            >
              <MicFillIcon
                size={32}
                color={sessionState === 'listening' ? '#FFFFFF' : Colors.d_text2}
              />
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.micLabel}>
            {sessionState === 'listening'
              ? t('testLive.tapToStop')
              : t('testLive.tapToSpeak')}
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 20 },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.d_text,
  },
  timerBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  timerText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.d_text,
    letterSpacing: 1,
  },
  closeBtn: { padding: 4, marginLeft: 8 },
  orbSection: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 14,
  },
  statusLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.d_text2,
  },
  questionCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 18,
    marginVertical: 12,
    gap: 10,
  },
  questionBadge: {
    backgroundColor: 'rgba(99,102,241,0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  questionBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: '#A5B4FC',
  },
  questionText: {
    fontSize: FontSize.base,
    color: Colors.d_text,
    lineHeight: 24,
  },
  transcriptScroll: { flex: 1 },
  transcriptContent: {
    gap: 8,
    paddingBottom: 12,
  },
  transcriptBubble: {
    backgroundColor: 'rgba(99,102,241,0.2)',
    borderRadius: 16,
    padding: 14,
    maxWidth: W * 0.82,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.3)',
  },
  transcriptText: {
    color: '#C7D2FE',
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  micSection: {
    alignItems: 'center',
    paddingBottom: 20,
    gap: 12,
  },
  micBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  micGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micLabel: {
    fontSize: FontSize.sm,
    color: Colors.d_text2,
    fontWeight: FontWeight.medium,
  },
});
