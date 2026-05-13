import React, { useState, useEffect, useRef } from 'react';
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
import TaraOrb, { OrbState } from '@/components/TaraOrb';
import Waveform from '@/components/Waveform';
import CorrectionSheet from '@/components/CorrectionSheet';
import { MicFillIcon, CloseIcon, HintIcon } from '@/components/icons';

const { width: W } = Dimensions.get('window');

type SessionState = 'listening' | 'processing' | 'speaking';

interface Bubble {
  id: string;
  speaker: 'tara' | 'user';
  text: string;
}

const TARA_RESPONSES = [
  "That's a great point! Tell me more about that.",
  "Interesting! How does that make you feel?",
  "I love how you expressed that. Can you elaborate?",
  "Wonderful! Now, have you ever thought about why that is?",
];

const USER_RESPONSES = [
  "I think it's really important to practice every day.",
  "Well, I went to the store yesterday and it was very busy.",
  "In my opinion, learning English opens many doors.",
];

export default function TalkRoomScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dark, rtl } = useAppStore();

  const [sessionState, setSessionState] = useState<SessionState>('listening');
  const [elapsed, setElapsed] = useState(0);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [correctionVisible, setCorrectionVisible] = useState(false);
  const [responseIndex, setResponseIndex] = useState(0);
  const [userIndex, setUserIndex] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);

    // Start with Tara speaking
    setSessionState('speaking');
    setBubbles([
      {
        id: '0',
        speaker: 'tara',
        text: "Hi! I'm Tara. Let's have a conversation today. Tell me, how has your day been so far?",
      },
    ]);

    cycleRef.current = setInterval(() => {
      setSessionState((prev) => {
        if (prev === 'speaking') {
          return 'listening';
        }
        if (prev === 'listening') {
          setUserIndex((ui) => {
            const text = USER_RESPONSES[ui % USER_RESPONSES.length];
            setBubbles((b) => [
              ...b,
              { id: Date.now().toString(), speaker: 'user', text },
            ]);
            return ui + 1;
          });
          return 'processing';
        }
        if (prev === 'processing') {
          setResponseIndex((ri) => {
            const text = TARA_RESPONSES[ri % TARA_RESPONSES.length];
            setBubbles((b) => [
              ...b,
              { id: Date.now().toString() + '1', speaker: 'tara', text },
            ]);
            return ri + 1;
          });
          return 'speaking';
        }
        return prev;
      });
    }, 3200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (cycleRef.current) clearInterval(cycleRef.current);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [bubbles]);

  const getOrbState = (): OrbState => {
    if (sessionState === 'listening') return 'listening';
    if (sessionState === 'processing') return 'thinking';
    return 'speaking';
  };

  const getStatusLabel = () => {
    if (sessionState === 'listening') return t('talkRoom.listening');
    if (sessionState === 'processing') return t('talkRoom.thinking');
    return t('talkRoom.speaking');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleEndSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (cycleRef.current) clearInterval(cycleRef.current);
    router.replace('/(tabs)/talk/summary');
  };

  return (
    <LinearGradient
      colors={dark ? ['#0B0F1E', '#13103A', '#0B0F1E'] : ['#1E1B4B', '#312E81', '#0B0F1E']}
      style={styles.root}
    >
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={[styles.header, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
          <View style={styles.sessionBadge}>
            <View style={styles.liveIndicator} />
            <Text style={styles.sessionLabel}>{t('talkRoom.session')}</Text>
            <Text style={styles.timerText}>{formatTime(elapsed)}</Text>
          </View>
          <TouchableOpacity onPress={handleEndSession} style={styles.endBtn}>
            <Text style={styles.endBtnLabel}>{t('talkRoom.endSession')}</Text>
          </TouchableOpacity>
        </View>

        {/* Orb area */}
        <View style={styles.orbSection}>
          <TaraOrb size={100} state={getOrbState()} dark />
          <Text style={styles.statusLabel}>{getStatusLabel()}</Text>
          {sessionState === 'listening' && (
            <Waveform bars={20} animated height={36} color="#818CF8" dark />
          )}
          {sessionState === 'speaking' && (
            <Waveform bars={20} animated height={36} color="#A78BFA" dark />
          )}
        </View>

        {/* Transcript */}
        <ScrollView
          ref={scrollRef}
          style={styles.transcriptScroll}
          contentContainerStyle={styles.transcriptContent}
          showsVerticalScrollIndicator={false}
        >
          {bubbles.map((b) => (
            <View
              key={b.id}
              style={[
                styles.bubbleRow,
                { flexDirection: b.speaker === 'tara' ? (rtl ? 'row-reverse' : 'row') : (rtl ? 'row' : 'row-reverse') },
              ]}
            >
              {b.speaker === 'tara' && (
                <View style={styles.taraAvatar}>
                  <Text style={styles.taraAvatarText}>T</Text>
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  b.speaker === 'tara' ? styles.taraBubble : styles.userBubble,
                  { maxWidth: W * 0.72 },
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    { color: b.speaker === 'tara' ? '#C7D2FE' : '#FFFFFF' },
                  ]}
                >
                  {b.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Bottom controls */}
        <View style={styles.controls}>
          {/* Hint button */}
          <TouchableOpacity
            style={styles.hintBtn}
            onPress={() => setCorrectionVisible(true)}
            activeOpacity={0.8}
          >
            <HintIcon size={22} color={Colors.amber} />
            <Text style={styles.hintLabel}>{t('talkRoom.showCorrection')}</Text>
          </TouchableOpacity>

          {/* Mic button */}
          <TouchableOpacity
            style={styles.micBtnWrap}
            activeOpacity={0.82}
          >
            <LinearGradient
              colors={sessionState === 'listening' ? Gradients.deep : ['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.08)']}
              style={styles.micBtn}
            >
              <MicFillIcon size={30} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.hintBtn} />
        </View>
      </SafeAreaView>

      <CorrectionSheet
        visible={correctionVisible}
        onClose={() => setCorrectionVisible(false)}
        onGotIt={() => setCorrectionVisible(false)}
        dark={dark}
        rtl={rtl}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 20 },
  header: {
    paddingTop: 8,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  liveIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  sessionLabel: { fontSize: FontSize.xs, color: Colors.d_text2, fontWeight: FontWeight.medium },
  timerText: { fontSize: FontSize.sm, color: Colors.d_text, fontWeight: FontWeight.bold, letterSpacing: 1 },
  endBtn: {
    backgroundColor: 'rgba(239,68,68,0.2)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.4)',
  },
  endBtnLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: '#FCA5A5' },
  orbSection: {
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
  },
  statusLabel: { fontSize: FontSize.xs, color: Colors.d_text2, fontWeight: FontWeight.medium },
  transcriptScroll: { flex: 1 },
  transcriptContent: { gap: 10, paddingBottom: 12 },
  bubbleRow: { alignItems: 'flex-end', gap: 8 },
  taraAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.indigo,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  taraAvatarText: { color: '#FFFFFF', fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  bubble: {
    borderRadius: 18,
    padding: 14,
  },
  taraBubble: {
    backgroundColor: 'rgba(99,102,241,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.3)',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: 'rgba(139,92,246,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.4)',
    borderBottomRightRadius: 4,
  },
  bubbleText: { fontSize: FontSize.base, lineHeight: 22 },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingTop: 8,
  },
  hintBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  hintLabel: { fontSize: 10, color: Colors.amber, fontWeight: FontWeight.medium },
  micBtnWrap: { alignItems: 'center' },
  micBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
