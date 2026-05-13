import React from 'react';
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
import TaraOrb from '@/components/TaraOrb';
import Card from '@/components/Card';
import SectionTitle from '@/components/SectionTitle';
import { ChevRightIcon } from '@/components/icons';

const { width: W } = Dimensions.get('window');

interface Topic {
  id: string;
  title: string;
  emoji: string;
  sessions: number;
  popular?: boolean;
}

const POPULAR_TOPICS: Topic[] = [
  { id: 'daily', title: 'Daily Life', emoji: '☀️', sessions: 1240, popular: true },
  { id: 'travel', title: 'Travel', emoji: '✈️', sessions: 980 },
  { id: 'work', title: 'Work & Career', emoji: '💼', sessions: 870, popular: true },
  { id: 'hobbies', title: 'Hobbies', emoji: '🎨', sessions: 650 },
  { id: 'news', title: 'Current Events', emoji: '📰', sessions: 540 },
  { id: 'culture', title: 'Culture & Food', emoji: '🍜', sessions: 430 },
];

const RECENT_TOPICS: Topic[] = [
  { id: 'recent1', title: 'Job Interview Practice', emoji: '💼', sessions: 3 },
  { id: 'recent2', title: 'Weekend Plans', emoji: '🎉', sessions: 5 },
];

export default function TalkHomeScreen() {
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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Header */}
          <View style={[styles.header, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
            <View>
              <Text style={[styles.headerTitle, { color: textColor }]}>
                {t('talk.title')}
              </Text>
              <Text style={[styles.headerSub, { color: text2Color }]}>
                {t('talk.subtitle')}
              </Text>
            </View>
          </View>

          {/* Hero card */}
          <LinearGradient
            colors={['#1E1B4B', '#312E81', '#4C1D95']}
            style={styles.heroCard}
          >
            <View style={[styles.heroContent, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
              <View style={styles.heroText}>
                <Text style={styles.heroTitle}>{t('talk.freeConversation')}</Text>
                <Text style={styles.heroDesc}>{t('talk.subtitle')}</Text>
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/talk/room')}
                  style={styles.heroBtn}
                  activeOpacity={0.82}
                >
                  <LinearGradient
                    colors={Gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.heroBtnGrad}
                  >
                    <Text style={styles.heroBtnLabel}>{t('talk.startSession')}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <TaraOrb size={80} state="idle" dark />
            </View>
          </LinearGradient>

          {/* Recent topics */}
          {RECENT_TOPICS.length > 0 && (
            <View style={styles.section}>
              <SectionTitle
                title={t('talk.recentTopics')}
                dark={dark}
              />
              {RECENT_TOPICS.map((topic) => (
                <Card
                  key={topic.id}
                  dark={dark}
                  style={styles.topicCard}
                  pad={14}
                  onPress={() => router.push('/(tabs)/talk/room')}
                >
                  <View style={[styles.topicRow, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                    <View style={styles.topicEmojiWrap}>
                      <Text style={styles.topicEmoji}>{topic.emoji}</Text>
                    </View>
                    <View style={[styles.topicInfo, { alignItems: rtl ? 'flex-end' : 'flex-start' }]}>
                      <Text style={[styles.topicTitle, { color: textColor }]}>{topic.title}</Text>
                      <Text style={[styles.topicMeta, { color: text3Color }]}>
                        {topic.sessions} sessions
                      </Text>
                    </View>
                    <ChevRightIcon size={18} color={text3Color} />
                  </View>
                </Card>
              ))}
            </View>
          )}

          {/* Popular topics */}
          <View style={styles.section}>
            <SectionTitle
              title={t('talk.popularTopics')}
              dark={dark}
            />
            <View style={styles.topicGrid}>
              {POPULAR_TOPICS.map((topic) => (
                <TouchableOpacity
                  key={topic.id}
                  onPress={() => router.push('/(tabs)/talk/room')}
                  activeOpacity={0.82}
                  style={[
                    styles.topicGridCard,
                    {
                      backgroundColor: dark ? Colors.d_card : '#FFFFFF',
                      borderColor: dark ? Colors.d_border : Colors.cardBorder,
                      width: (W - 52) / 2,
                    },
                  ]}
                >
                  <View style={styles.topicGridEmojiWrap}>
                    <Text style={styles.topicGridEmoji}>{topic.emoji}</Text>
                  </View>
                  <Text style={[styles.topicGridTitle, { color: textColor }]}>{topic.title}</Text>
                  <Text style={[styles.topicGridMeta, { color: text3Color }]}>
                    {topic.sessions}+ sessions
                  </Text>
                  {topic.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularBadgeText}>🔥 Popular</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  scroll: { paddingBottom: 28 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold },
  headerSub: { fontSize: FontSize.sm, marginTop: 2 },
  heroCard: {
    marginHorizontal: 20,
    borderRadius: Radius.xxl,
    padding: 20,
    marginBottom: 24,
    overflow: 'hidden',
  },
  heroContent: { alignItems: 'center', justifyContent: 'space-between' },
  heroText: { flex: 1, gap: 6 },
  heroTitle: { color: '#FFFFFF', fontSize: FontSize.xl, fontWeight: FontWeight.extrabold },
  heroDesc: { color: 'rgba(255,255,255,0.65)', fontSize: FontSize.sm },
  heroBtn: { marginTop: 12, alignSelf: 'flex-start' },
  heroBtnGrad: {
    borderRadius: Radius.full,
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  heroBtnLabel: { color: '#FFFFFF', fontSize: FontSize.sm, fontWeight: FontWeight.semibold },
  section: { paddingHorizontal: 20, marginBottom: 24, gap: 12 },
  topicCard: {},
  topicRow: { alignItems: 'center', gap: 12 },
  topicEmojiWrap: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicEmoji: { fontSize: 22 },
  topicInfo: { flex: 1, gap: 3 },
  topicTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  topicMeta: { fontSize: FontSize.xs },
  topicGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  topicGridCard: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    alignItems: 'flex-start',
  },
  topicGridEmojiWrap: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicGridEmoji: { fontSize: 22 },
  topicGridTitle: { fontSize: FontSize.base, fontWeight: FontWeight.semibold },
  topicGridMeta: { fontSize: FontSize.xs },
  popularBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  popularBadgeText: { fontSize: 10, fontWeight: FontWeight.semibold, color: '#92400E' },
});
