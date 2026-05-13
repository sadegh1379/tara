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
import PrimaryBtn from '@/components/PrimaryBtn';
import ProgressBar from '@/components/ProgressBar';
import { ChevLeftIcon, SpeakerIcon } from '@/components/icons';

interface VocabWord {
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
}

const VOCAB: VocabWord[] = [
  { word: 'Small talk', phonetic: '/smɔːl tɔːk/', meaning: 'Light, informal conversation', example: "I made small talk with my colleague before the meeting." },
  { word: 'Icebreaker', phonetic: '/ˈaɪsˌbreɪkər/', meaning: 'Something that starts a conversation', example: "A good icebreaker is asking about the weekend." },
  { word: 'Casual', phonetic: '/ˈkæʒ.u.əl/', meaning: 'Relaxed and informal', example: "We had a casual conversation over coffee." },
  { word: 'Common ground', phonetic: '/ˈkɒm.ən ɡraʊnd/', meaning: 'Shared interests or opinions', example: "Finding common ground helps build rapport." },
];

export default function LessonPlayerScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dark, rtl } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const totalSteps = 5;
  const progress = (currentStep + 1) / totalSteps;

  const bg = dark ? Colors.d_bg : '#F8FAFC';
  const textColor = dark ? Colors.d_text : Colors.text;
  const text2Color = dark ? Colors.d_text2 : Colors.text2;
  const text3Color = dark ? Colors.d_text3 : Colors.text3;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevLeftIcon size={24} color={textColor} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: textColor }]}>
              {t('lessonPlayer.vocabulary')}
            </Text>
            <Text style={[styles.headerSub, { color: text3Color }]}>
              Step {currentStep + 1} of {totalSteps}
            </Text>
          </View>
          <View style={styles.backBtn} />
        </View>

        {/* Progress */}
        <ProgressBar
          value={progress}
          height={6}
          dark={dark}
          style={styles.progressBar}
        />

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Step 1: Vocabulary */}
          {currentStep === 0 && (
            <View style={styles.stepContent}>
              <Text style={[styles.stepHint, { color: text3Color }]}>
                {t('lessonPlayer.tapToHear')}
              </Text>
              <View style={styles.vocabGrid}>
                {VOCAB.map((v) => {
                  const isSelected = selectedWord === v.word;
                  return (
                    <TouchableOpacity
                      key={v.word}
                      onPress={() => setSelectedWord(isSelected ? null : v.word)}
                      activeOpacity={0.82}
                      style={[
                        styles.vocabCard,
                        {
                          backgroundColor: isSelected
                            ? '#EEF2FF'
                            : dark
                            ? Colors.d_card
                            : '#FFFFFF',
                          borderColor: isSelected
                            ? Colors.indigo
                            : dark
                            ? Colors.d_border
                            : Colors.cardBorder,
                        },
                      ]}
                    >
                      <View style={[styles.vocabHeader, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                        <View>
                          <Text
                            style={[
                              styles.vocabWord,
                              { color: isSelected ? Colors.indigoDeep : textColor },
                            ]}
                          >
                            {v.word}
                          </Text>
                          <Text style={[styles.vocabPhonetic, { color: text3Color }]}>
                            {v.phonetic}
                          </Text>
                        </View>
                        <TouchableOpacity style={styles.speakerBtn}>
                          <SpeakerIcon size={18} color={Colors.indigo} />
                        </TouchableOpacity>
                      </View>
                      {isSelected && (
                        <View style={styles.vocabExpanded}>
                          <Text style={[styles.vocabMeaning, { color: text2Color }]}>
                            {v.meaning}
                          </Text>
                          <Text style={[styles.vocabExample, { color: text3Color }]}>
                            "{v.example}"
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Step 2: Dialogue */}
          {currentStep === 1 && (
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: textColor }]}>Dialogue Practice</Text>
              <View style={styles.dialogue}>
                <View style={styles.dialogueBubbleA}>
                  <Text style={styles.dialogueLabel}>Tara</Text>
                  <View style={styles.bubbleA}>
                    <Text style={styles.bubbleAText}>
                      "Hi! How's your day going so far?"
                    </Text>
                  </View>
                </View>
                <View style={styles.dialogueBubbleB}>
                  <Text style={[styles.dialogueLabel, { color: text3Color, textAlign: 'right' }]}>You</Text>
                  <View
                    style={[
                      styles.bubbleB,
                      { backgroundColor: dark ? Colors.d_card2 : '#F1F5F9' },
                    ]}
                  >
                    <Text style={[styles.bubbleBText, { color: textColor }]}>
                      "Pretty good, thanks! Just finished a meeting."
                    </Text>
                  </View>
                </View>
                <View style={styles.dialogueBubbleA}>
                  <View style={styles.bubbleA}>
                    <Text style={styles.bubbleAText}>
                      "Oh nice! What kind of work do you do?"
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Steps 3-5 */}
          {currentStep >= 2 && (
            <View style={styles.stepContent}>
              <LinearGradient
                colors={Gradients.soft}
                style={styles.placeholderCard}
              >
                <Text style={styles.placeholderEmoji}>
                  {['📚', '🎯', '🎙️'][currentStep - 2]}
                </Text>
                <Text style={[styles.placeholderTitle, { color: Colors.indigoDeep }]}>
                  {['Grammar Tip', 'Quick Quiz', 'Speaking Practice'][currentStep - 2]}
                </Text>
                <Text style={[styles.placeholderText, { color: Colors.text2 }]}>
                  {[
                    'Practice using phrasal verbs in casual conversations.',
                    'Test your understanding with 5 quick questions.',
                    'Record yourself using the new vocabulary.',
                  ][currentStep - 2]}
                </Text>
              </LinearGradient>
            </View>
          )}
        </ScrollView>

        {/* Next button */}
        <View
          style={[
            styles.footer,
            {
              backgroundColor: dark ? Colors.d_card : '#FFFFFF',
              borderTopColor: dark ? Colors.d_border : Colors.border,
            },
          ]}
        >
          <PrimaryBtn full onPress={handleNext} height={52}>
            {currentStep < totalSteps - 1
              ? t('lessonPlayer.nextStep')
              : t('lessonPlayer.complete')}
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { alignItems: 'center', gap: 2 },
  headerTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  headerSub: { fontSize: FontSize.xs },
  progressBar: { marginHorizontal: 20, marginBottom: 8 },
  scroll: { padding: 20, paddingBottom: 28 },
  stepContent: { gap: 16 },
  stepHint: { fontSize: FontSize.sm, textAlign: 'center', fontWeight: FontWeight.medium },
  stepTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  vocabGrid: { gap: 10 },
  vocabCard: {
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    padding: 16,
    gap: 10,
  },
  vocabHeader: { justifyContent: 'space-between', alignItems: 'flex-start' },
  vocabWord: { fontSize: FontSize.md, fontWeight: FontWeight.bold },
  vocabPhonetic: { fontSize: FontSize.xs, marginTop: 2 },
  speakerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vocabExpanded: { gap: 6 },
  vocabMeaning: { fontSize: FontSize.sm, fontWeight: FontWeight.medium },
  vocabExample: { fontSize: FontSize.sm, fontStyle: 'italic', lineHeight: 20 },
  dialogue: { gap: 12 },
  dialogueBubbleA: { gap: 4 },
  dialogueBubbleB: { gap: 4, alignItems: 'flex-end' },
  dialogueLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.indigo,
    paddingHorizontal: 4,
  },
  bubbleA: {
    backgroundColor: Colors.indigo,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 14,
    alignSelf: 'flex-start',
    maxWidth: '82%',
  },
  bubbleAText: { color: '#FFFFFF', fontSize: FontSize.base, lineHeight: 22 },
  bubbleB: {
    borderRadius: 16,
    borderBottomRightRadius: 4,
    padding: 14,
    alignSelf: 'flex-end',
    maxWidth: '82%',
  },
  bubbleBText: { fontSize: FontSize.base, lineHeight: 22 },
  placeholderCard: {
    borderRadius: Radius.xl,
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  placeholderEmoji: { fontSize: 48 },
  placeholderTitle: { fontSize: FontSize.xl, fontWeight: FontWeight.bold },
  placeholderText: { fontSize: FontSize.base, textAlign: 'center', lineHeight: 24 },
  footer: {
    padding: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
  },
});
