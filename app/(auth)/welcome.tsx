import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { useAppStore } from '@/store/useAppStore';
import { Colors, FontSize, FontWeight, Gradients } from '@/constants/tokens';
import TaraOrb from '@/components/TaraOrb';
import PrimaryBtn from '@/components/PrimaryBtn';

const { width: W, height: H } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dark, rtl, toggleRtl } = useAppStore();

  const handleLanguageToggle = () => {
    const nextLang = i18n.language === 'en' ? 'fa' : 'en';
    i18n.changeLanguage(nextLang);
    if (nextLang === 'fa') {
      if (!rtl) toggleRtl();
    } else {
      if (rtl) toggleRtl();
    }
  };

  const bg = dark ? Colors.d_bg : '#FAFAFF';
  const textColor = dark ? Colors.d_text : Colors.text;
  const text2Color = dark ? Colors.d_text2 : Colors.text2;

  return (
    <View style={[styles.root, { backgroundColor: bg }]}>
      {/* Decorative blobs */}
      <View style={[styles.blob1, { overflow: 'hidden' }]}>
        <LinearGradient
          colors={['rgba(129,140,248,0.35)', 'rgba(167,139,250,0.18)']}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View style={[styles.blob2, { overflow: 'hidden' }]}>
        <LinearGradient
          colors={['rgba(244,114,182,0.22)', 'rgba(236,72,153,0.12)']}
          style={StyleSheet.absoluteFill}
        />
      </View>
      <View style={[styles.blob3, { overflow: 'hidden' }]}>
        <LinearGradient
          colors={['rgba(99,102,241,0.15)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <SafeAreaView style={styles.safe}>
        {/* Language toggle */}
        <View style={styles.langRow}>
          <TouchableOpacity
            onPress={handleLanguageToggle}
            style={[
              styles.langBtn,
              {
                backgroundColor: dark ? Colors.d_card2 : 'rgba(255,255,255,0.85)',
                borderColor: dark ? Colors.d_border : Colors.border,
              },
            ]}
            activeOpacity={0.75}
          >
            <Text style={[styles.langLabel, { color: Colors.indigoDeep }]}>
              {i18n.language === 'en' ? t('welcome.languageToggle') : t('welcome.languageToggleEn')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Orb */}
        <View style={styles.orbContainer}>
          <TaraOrb size={148} state="happy" dark={dark} />
        </View>

        {/* Text block */}
        <View style={styles.textBlock}>
          <LinearGradient
            colors={Gradients.deep}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.taglineGradient}
          >
            <Text style={styles.tagline}>{t('welcome.tagline')}</Text>
          </LinearGradient>
          <Text style={[styles.subtitle, { color: text2Color }]}>
            {t('welcome.subtitle')}
          </Text>
        </View>

        {/* CTAs */}
        <View style={styles.ctaBlock}>
          <PrimaryBtn
            full
            onPress={() => router.push('/(auth)/goal')}
            height={58}
          >
            {t('welcome.getStarted')}
          </PrimaryBtn>

          <TouchableOpacity activeOpacity={0.7} style={styles.signInRow}>
            <Text style={[styles.signInText, { color: text2Color }]}>
              {t('welcome.alreadyHaveAccount')}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    position: 'relative',
  },
  blob1: {
    position: 'absolute',
    width: W * 0.7,
    height: W * 0.7,
    borderRadius: W * 0.35,
    top: -W * 0.2,
    right: -W * 0.15,
  },
  blob2: {
    position: 'absolute',
    width: W * 0.55,
    height: W * 0.55,
    borderRadius: W * 0.28,
    bottom: H * 0.22,
    left: -W * 0.12,
  },
  blob3: {
    position: 'absolute',
    width: W * 0.4,
    height: W * 0.4,
    borderRadius: W * 0.2,
    bottom: 0,
    right: -W * 0.05,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 24,
  },
  langRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
  },
  langBtn: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  langLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  orbContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  textBlock: {
    alignItems: 'center',
    marginBottom: 40,
    gap: 12,
  },
  taglineGradient: {
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  tagline: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.extrabold,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.base,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  ctaBlock: {
    gap: 16,
    marginBottom: 12,
  },
  signInRow: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  signInText: {
    fontSize: FontSize.sm,
    textAlign: 'center',
  },
});
