import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { useAppStore } from '@/store/useAppStore';
import { Colors, FontSize, FontWeight, Radius } from '@/constants/tokens';
import Card from '@/components/Card';
import { ChevLeftIcon, ChevRightIcon } from '@/components/icons';

interface ToggleSetting {
  id: string;
  labelKey: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

interface ActionSetting {
  id: string;
  labelKey: string;
  value?: string;
  onPress: () => void;
  destructive?: boolean;
}

type SettingItem = ToggleSetting | ActionSetting;

function isToggle(item: SettingItem): item is ToggleSetting {
  return 'onChange' in item;
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dark, toggleDark, rtl, toggleRtl } = useAppStore();
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [sound, setSound] = useState(true);
  const [haptics, setHaptics] = useState(true);

  const bg = dark ? Colors.d_bg : '#F8FAFC';
  const textColor = dark ? Colors.d_text : Colors.text;
  const text2Color = dark ? Colors.d_text2 : Colors.text2;
  const text3Color = dark ? Colors.d_text3 : Colors.text3;

  const handleLanguageToggle = () => {
    const nextLang = i18n.language === 'en' ? 'fa' : 'en';
    i18n.changeLanguage(nextLang);
    if (nextLang === 'fa' && !rtl) toggleRtl();
    if (nextLang === 'en' && rtl) toggleRtl();
  };

  const APP_SETTINGS: SettingItem[] = [
    { id: 'dark', labelKey: 'settings.darkMode', value: dark, onChange: toggleDark },
    {
      id: 'language',
      labelKey: 'settings.language',
      value: i18n.language === 'en' ? 'English' : 'فارسی',
      onPress: handleLanguageToggle,
    },
  ];

  const NOTIFICATION_SETTINGS: SettingItem[] = [
    { id: 'notifs', labelKey: 'settings.notifications', value: notifications, onChange: setNotifications },
    { id: 'reminder', labelKey: 'settings.dailyReminder', value: dailyReminder, onChange: setDailyReminder },
    { id: 'sound', labelKey: 'settings.sound', value: sound, onChange: setSound },
    { id: 'haptics', labelKey: 'settings.haptics', value: haptics, onChange: setHaptics },
  ];

  const ACCOUNT_SETTINGS: SettingItem[] = [
    { id: 'subscription', labelKey: 'settings.subscription', onPress: () => {} },
    { id: 'privacy', labelKey: 'settings.privacy', onPress: () => {} },
    { id: 'terms', labelKey: 'settings.terms', onPress: () => {} },
    { id: 'about', labelKey: 'settings.about', value: '1.0.0', onPress: () => {} },
    { id: 'rate', labelKey: 'settings.rateApp', onPress: () => {} },
  ];

  const renderSettingItem = (item: SettingItem) => {
    if (isToggle(item)) {
      return (
        <View
          key={item.id}
          style={[
            styles.settingRow,
            {
              borderBottomColor: dark ? Colors.d_border : Colors.border,
              flexDirection: rtl ? 'row-reverse' : 'row',
            },
          ]}
        >
          <Text style={[styles.settingLabel, { color: textColor }]}>
            {t(item.labelKey as any)}
          </Text>
          <Switch
            value={item.value}
            onValueChange={item.onChange}
            trackColor={{ false: Colors.border, true: Colors.indigo }}
            thumbColor={Platform.OS === 'android' ? (item.value ? '#FFFFFF' : '#F4F4F5') : undefined}
            ios_backgroundColor={Colors.border}
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={item.id}
        onPress={item.onPress}
        activeOpacity={0.75}
        style={[
          styles.settingRow,
          {
            borderBottomColor: dark ? Colors.d_border : Colors.border,
            flexDirection: rtl ? 'row-reverse' : 'row',
          },
        ]}
      >
        <Text
          style={[
            styles.settingLabel,
            {
              color: item.destructive ? '#DC2626' : textColor,
            },
          ]}
        >
          {t(item.labelKey as any)}
        </Text>
        <View style={[styles.settingRight, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
          {item.value && (
            <Text style={[styles.settingValue, { color: text3Color }]}>{item.value}</Text>
          )}
          <ChevRightIcon size={18} color={text3Color} />
        </View>
      </TouchableOpacity>
    );
  };

  const GROUPS = [
    { titleKey: 'settings.app', items: APP_SETTINGS },
    { titleKey: 'settings.notifications', items: NOTIFICATION_SETTINGS },
    { titleKey: 'settings.account', items: ACCOUNT_SETTINGS },
  ];

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header */}
        <View style={[styles.header, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ChevLeftIcon size={24} color={textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            {t('settings.title')}
          </Text>
          <View style={styles.backBtn} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {GROUPS.map((group) => (
            <View key={group.titleKey} style={styles.group}>
              <Text style={[styles.groupTitle, { color: text3Color }]}>
                {t(group.titleKey as any).toUpperCase()}
              </Text>
              <Card dark={dark} style={styles.groupCard} pad={0} radius={18}>
                {group.items.map((item, index) => (
                  <View
                    key={item.id}
                    style={[
                      index < group.items.length - 1
                        ? {}
                        : styles.lastItem,
                    ]}
                  >
                    {renderSettingItem(item)}
                  </View>
                ))}
              </Card>
            </View>
          ))}

          <Text style={[styles.version, { color: text3Color }]}>
            {t('settings.version', { version: '1.0.0' })}
          </Text>
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
  scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 8 },
  group: { gap: 8 },
  groupTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1,
    paddingLeft: 4,
  },
  groupCard: { overflow: 'hidden' },
  settingRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lastItem: {},
  settingLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    flex: 1,
  },
  settingRight: { alignItems: 'center', gap: 6 },
  settingValue: { fontSize: FontSize.sm },
  version: { textAlign: 'center', fontSize: FontSize.xs, marginTop: 8 },
});
