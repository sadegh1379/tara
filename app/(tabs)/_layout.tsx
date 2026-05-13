import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { Colors, FontSize, FontWeight, Gradients } from '@/constants/tokens';
import {
  HomeIcon,
  LessonsIcon,
  MicFillIcon,
  PracticeIcon,
  ProfileIcon,
} from '@/components/icons';

interface TabBarItemProps {
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  active: boolean;
  onPress: () => void;
}

function TabBarItem({ label, icon, activeIcon, active, onPress }: TabBarItemProps) {
  const { dark } = useAppStore();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.tabItem}
    >
      {active ? activeIcon : icon}
      <Text
        style={[
          styles.tabLabel,
          {
            color: active
              ? Colors.indigoDeep
              : dark
              ? Colors.d_text3
              : Colors.text3,
            fontWeight: active ? FontWeight.semibold : FontWeight.regular,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, navigation }: { state: any; navigation: any }) {
  const { t } = useTranslation();
  const { dark } = useAppStore();
  const router = useRouter();

  const tabs = [
    {
      name: 'index',
      label: t('home.dailyGoal').split(' ')[0],
      icon: <HomeIcon size={24} color={dark ? Colors.d_text3 : Colors.text3} />,
      activeIcon: <HomeIcon size={24} color={Colors.indigoDeep} />,
    },
    {
      name: 'lessons',
      label: t('lessons.title'),
      icon: <LessonsIcon size={24} color={dark ? Colors.d_text3 : Colors.text3} />,
      activeIcon: <LessonsIcon size={24} color={Colors.indigoDeep} />,
    },
    {
      name: 'talk',
      label: null,
      icon: null,
      activeIcon: null,
    },
    {
      name: 'practice',
      label: t('practice.title'),
      icon: <PracticeIcon size={24} color={dark ? Colors.d_text3 : Colors.text3} />,
      activeIcon: <PracticeIcon size={24} color={Colors.indigoDeep} />,
    },
    {
      name: 'profile',
      label: t('profile.title'),
      icon: <ProfileIcon size={24} color={dark ? Colors.d_text3 : Colors.text3} />,
      activeIcon: <ProfileIcon size={24} color={Colors.indigoDeep} />,
    },
  ];

  const currentRoute = state.routes[state.index]?.name ?? '';

  const bgColor = dark ? Colors.d_card : '#FFFFFF';
  const borderColor = dark ? Colors.d_border : Colors.border;

  return (
    <View
      style={[
        styles.tabBar,
        {
          backgroundColor: bgColor,
          borderTopColor: borderColor,
        },
        Platform.select({
          ios: {
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
          },
          android: { elevation: 12 },
          default: {},
        }),
      ]}
    >
      {tabs.map((tab, index) => {
        if (tab.name === 'talk') {
          const isTalkActive = currentRoute === 'talk' || currentRoute.startsWith('talk/');
          return (
            <TouchableOpacity
              key="talk"
              onPress={() => router.push('/(tabs)/talk')}
              activeOpacity={0.85}
              style={styles.talkBtnWrap}
            >
              <LinearGradient
                colors={Gradients.deep}
                style={styles.talkBtn}
              >
                <MicFillIcon size={26} color="#FFFFFF" />
              </LinearGradient>
              <Text
                style={[
                  styles.talkLabel,
                  { color: isTalkActive ? Colors.indigoDeep : dark ? Colors.d_text3 : Colors.text3 },
                ]}
              >
                {t('talk.title').split(' ')[0]}
              </Text>
            </TouchableOpacity>
          );
        }

        const route = state.routes.find((r: any) => r.name === tab.name);
        const routeIndex = state.routes.indexOf(route);
        const isActive = state.index === routeIndex;

        return (
          <TabBarItem
            key={tab.name}
            label={tab.label ?? ''}
            icon={tab.icon ?? <View />}
            activeIcon={tab.activeIcon ?? <View />}
            active={isActive}
            onPress={() => {
              if (route) {
                navigation.navigate(tab.name);
              }
            }}
          />
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="lessons" options={{ href: '/(tabs)/lessons' }} />
      <Tabs.Screen name="talk" options={{ href: '/(tabs)/talk' }} />
      <Tabs.Screen name="practice" options={{ href: '/(tabs)/practice' }} />
      <Tabs.Screen name="profile" options={{ href: '/(tabs)/profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 82 : 64,
    paddingBottom: Platform.OS === 'ios' ? 20 : 4,
    paddingHorizontal: 8,
    borderTopWidth: 1,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: FontSize.xs,
  },
  talkBtnWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  talkBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
  },
  talkLabel: {
    fontSize: FontSize.xs,
  },
});
