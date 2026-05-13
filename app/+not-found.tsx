import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import { Colors, FontSize, FontWeight, Gradients } from '@/constants/tokens';
import PrimaryBtn from '@/components/PrimaryBtn';

export default function NotFoundScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dark } = useAppStore();

  const bg = dark ? Colors.d_bg : '#FAFAFF';
  const textColor = dark ? Colors.d_text : Colors.text;
  const text2Color = dark ? Colors.d_text2 : Colors.text2;

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <LinearGradient
            colors={Gradients.soft}
            style={styles.iconWrap}
          >
            <Text style={styles.icon}>🔍</Text>
          </LinearGradient>
          <Text style={[styles.title, { color: textColor }]}>
            {t('notFound.title')}
          </Text>
          <Text style={[styles.message, { color: text2Color }]}>
            {t('notFound.message')}
          </Text>
          <PrimaryBtn onPress={() => router.replace('/(tabs)')} height={52}>
            {t('notFound.goHome')}
          </PrimaryBtn>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: { fontSize: 44 },
  title: { fontSize: FontSize['2xl'], fontWeight: FontWeight.extrabold, textAlign: 'center' },
  message: { fontSize: FontSize.base, textAlign: 'center', lineHeight: 24, marginBottom: 8 },
});
