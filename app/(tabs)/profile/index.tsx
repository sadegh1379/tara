import React from 'react';
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
import { ChevRightIcon, FlameIcon, BoltIcon, TrophyIcon, SettingsIcon } from '@/components/icons';

const ACHIEVEMENTS = [
  { id: 'first', title: 'First Lesson', emoji: '🎓', earned: true },
  { id: 'streak7', title: '7-Day Streak', emoji: '🔥', earned: true },
  { id: 'streak30', title: '30-Day Streak', emoji: '⚡', earned: false },
  { id: 'words100', title: '100 Words', emoji: '📚', earned: true },
  { id: 'perfect', title: 'Perfect Score', emoji: '⭐', earned: false },
  { id: 'night', title: 'Night Owl', emoji: '🦉', earned: false },
];

const MENU_ITEMS = [
  { id: 'progress', labelKey: 'profile.progress', icon: '📊', route: '/(tabs)/profile/progress' },
  { id: 'settings', labelKey: 'profile.settings', icon: '⚙️', route: '/(tabs)/profile/settings' },
];

export default function ProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dark, rtl, userName, streak, xp, level } = useAppStore();

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
            <Text style={[styles.headerTitle, { color: textColor }]}>
              {t('profile.title')}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/profile/settings')}
              style={[
                styles.settingsBtn,
                { backgroundColor: dark ? Colors.d_card2 : '#F1F5F9' },
              ]}
            >
              <SettingsIcon size={20} color={text2Color} />
            </TouchableOpacity>
          </View>

          {/* Profile card */}
          <LinearGradient
            colors={['#1E1B4B', '#312E81', '#4C1D95']}
            style={styles.profileCard}
          >
            {/* Avatar */}
            <View style={styles.avatarWrap}>
              <LinearGradient
                colors={Gradients.primary}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
              </LinearGradient>
            </View>
            <Text style={styles.profileName}>{userName}</Text>
            <LinearGradient
              colors={Gradients.soft}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.levelBadge}
            >
              <Text style={styles.levelBadgeText}>
                {t('profile.level')} {level}
              </Text>
            </LinearGradient>

            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <FlameIcon size={20} color={Colors.amber} />
                <Text style={styles.statValue}>{streak}</Text>
                <Text style={styles.statLabel}>{t('profile.streak')}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <BoltIcon size={20} color="#818CF8" />
                <Text style={styles.statValue}>{xp.toLocaleString()}</Text>
                <Text style={styles.statLabel}>{t('profile.totalXp')}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <TrophyIcon size={20} color={Colors.amber} />
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>{t('profile.lessonsCompleted')}</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Achievements */}
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                {t('profile.achievements')}
              </Text>
              <Text style={[styles.sectionCount, { color: Colors.indigo }]}>
                {ACHIEVEMENTS.filter((a) => a.earned).length}/{ACHIEVEMENTS.length}
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.achievementScroll}
            >
              {ACHIEVEMENTS.map((a) => (
                <View
                  key={a.id}
                  style={[
                    styles.achievementCard,
                    {
                      backgroundColor: a.earned
                        ? dark
                          ? Colors.d_card
                          : '#FFFFFF'
                        : dark
                        ? Colors.d_card2
                        : '#F1F5F9',
                      borderColor: a.earned
                        ? dark
                          ? Colors.d_border
                          : Colors.cardBorder
                        : 'transparent',
                      opacity: a.earned ? 1 : 0.5,
                    },
                  ]}
                >
                  <Text style={styles.achievementEmoji}>{a.emoji}</Text>
                  <Text
                    style={[
                      styles.achievementTitle,
                      { color: a.earned ? textColor : text3Color },
                    ]}
                  >
                    {a.title}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Menu */}
          <View style={styles.section}>
            {MENU_ITEMS.map((item) => (
              <Card
                key={item.id}
                dark={dark}
                style={styles.menuCard}
                pad={16}
                onPress={() => router.push(item.route as any)}
              >
                <View style={[styles.menuRow, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                  <View
                    style={[
                      styles.menuIcon,
                      { backgroundColor: dark ? Colors.d_card2 : '#EEF2FF' },
                    ]}
                  >
                    <Text style={styles.menuEmoji}>{item.icon}</Text>
                  </View>
                  <Text style={[styles.menuLabel, { color: textColor, textAlign: rtl ? 'right' : 'left' }]}>
                    {t(item.labelKey as any)}
                  </Text>
                  <ChevRightIcon size={18} color={text3Color} />
                </View>
              </Card>
            ))}

            {/* Sign out */}
            <TouchableOpacity
              style={[
                styles.signOutBtn,
                {
                  backgroundColor: dark ? 'rgba(239,68,68,0.12)' : '#FEF2F2',
                  borderColor: dark ? 'rgba(239,68,68,0.25)' : '#FECACA',
                },
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.signOutLabel}>{t('profile.signOut')}</Text>
            </TouchableOpacity>
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
    paddingBottom: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    marginHorizontal: 20,
    borderRadius: Radius.xxl,
    padding: 24,
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
  },
  avatarWrap: { marginBottom: 4 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold },
  profileName: { color: '#FFFFFF', fontSize: FontSize.xl, fontWeight: FontWeight.extrabold },
  levelBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  levelBadgeText: { color: Colors.indigoDeep, fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center', gap: 4 },
  statValue: { color: '#FFFFFF', fontSize: FontSize.xl, fontWeight: FontWeight.extrabold },
  statLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: FontWeight.medium },
  statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.15)' },
  section: { paddingHorizontal: 20, marginBottom: 20, gap: 10 },
  sectionHeader: { justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold },
  sectionCount: { fontSize: FontSize.sm, fontWeight: FontWeight.bold },
  achievementScroll: { gap: 10, paddingRight: 4 },
  achievementCard: {
    width: 90,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    gap: 8,
  },
  achievementEmoji: { fontSize: 28 },
  achievementTitle: { fontSize: 10, fontWeight: FontWeight.semibold, textAlign: 'center' },
  menuCard: {},
  menuRow: { alignItems: 'center', gap: 12 },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuEmoji: { fontSize: 20 },
  menuLabel: { flex: 1, fontSize: FontSize.base, fontWeight: FontWeight.medium },
  signOutBtn: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  signOutLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: '#DC2626',
  },
});
