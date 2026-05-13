import React, { useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, FontSize, FontWeight, Radius } from '@/constants/tokens';
import { useTranslation } from 'react-i18next';
import { CloseIcon, SpeakerIcon } from '@/components/icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.68;

interface CorrectionSheetProps {
  visible: boolean;
  onClose: () => void;
  onGotIt: () => void;
  dark?: boolean;
  rtl?: boolean;
}

const CorrectionSheet: React.FC<CorrectionSheetProps> = ({
  visible,
  onClose,
  onGotIt,
  dark = false,
  rtl = false,
}) => {
  const { t } = useTranslation();
  const translateY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 300 });
      translateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      backdropOpacity.value = withTiming(0, { duration: 250 });
      translateY.value = withTiming(SHEET_HEIGHT, {
        duration: 300,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [visible]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <TouchableOpacity style={styles.backdropTouch} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: dark ? Colors.d_card : '#FFFFFF',
              height: SHEET_HEIGHT,
            },
            sheetStyle,
          ]}
        >
          {/* Drag handle */}
          <View style={styles.handleContainer}>
            <View
              style={[
                styles.handle,
                { backgroundColor: dark ? Colors.d_border : Colors.border },
              ]}
            />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <View style={[styles.header, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
              <View style={[styles.headerLeft, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                <View style={styles.sparkBadge}>
                  <Text style={styles.sparkEmoji}>✨</Text>
                  <Text style={styles.tipLabel}>{t('correction.tipLabel')}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <CloseIcon size={20} color={dark ? Colors.d_text2 : Colors.text2} />
              </TouchableOpacity>
            </View>

            <Text
              style={[
                styles.title,
                {
                  color: dark ? Colors.d_text : Colors.text,
                  textAlign: rtl ? 'right' : 'left',
                },
              ]}
            >
              {t('correction.grammarTitle')}
            </Text>

            {/* You Said */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionLabel,
                  {
                    color: dark ? Colors.d_text2 : Colors.text2,
                    textAlign: rtl ? 'right' : 'left',
                  },
                ]}
              >
                {t('correction.youSaid')}
              </Text>
              <View style={[styles.bubbleYou, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                <Text style={styles.bubbleText}>
                  I{' '}
                  <Text style={styles.underlineWord}>
                    goed
                  </Text>{' '}
                  to the store{' '}
                  <Text style={styles.underlineWord}>
                    yesterday night
                  </Text>
                  .
                </Text>
              </View>
            </View>

            {/* Tara Suggests */}
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionLabel,
                  {
                    color: dark ? Colors.d_text2 : Colors.text2,
                    textAlign: rtl ? 'right' : 'left',
                  },
                ]}
              >
                {t('correction.taraSuggests')}
              </Text>
              <View style={[styles.bubbleTara, { flexDirection: rtl ? 'row-reverse' : 'row' }]}>
                <Text style={styles.bubbleTaraText}>
                  I{' '}
                  <Text style={styles.boldWord}>
                    went
                  </Text>{' '}
                  to the store{' '}
                  <Text style={styles.boldWord}>
                    last night
                  </Text>
                  .
                </Text>
              </View>
            </View>

            {/* Why tip */}
            <View
              style={[
                styles.whyCard,
                {
                  backgroundColor: dark ? Colors.d_card2 : '#F8FAFC',
                  borderColor: dark ? Colors.d_border : Colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.whyTitle,
                  { color: dark ? Colors.d_text : Colors.text, textAlign: rtl ? 'right' : 'left' },
                ]}
              >
                {t('correction.whyTitle')}
              </Text>
              <Text
                style={[
                  styles.whyText,
                  {
                    color: dark ? Colors.d_text2 : Colors.text2,
                    textAlign: rtl ? 'right' : 'left',
                  },
                ]}
              >
                "Goed" is not a word — use the irregular past tense "went." Also, "last night"
                is the correct phrase, not "yesterday night."
              </Text>
            </View>
          </ScrollView>

          {/* Buttons */}
          <View
            style={[
              styles.footer,
              {
                borderTopColor: dark ? Colors.d_border : Colors.border,
                flexDirection: rtl ? 'row-reverse' : 'row',
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.hearBtn,
                {
                  backgroundColor: dark ? Colors.d_card2 : '#F1F5F9',
                  borderColor: dark ? Colors.d_border : Colors.border,
                },
              ]}
              activeOpacity={0.75}
            >
              <SpeakerIcon size={18} color={Colors.indigo} />
              <Text style={[styles.hearLabel, { color: Colors.indigo }]}>
                {t('correction.hearIt')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gotItBtn}
              onPress={onGotIt}
              activeOpacity={0.82}
            >
              <Text style={styles.gotItLabel}>{t('correction.gotIt')}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11,15,30,0.52)',
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: { elevation: 16 },
      default: {},
    }),
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 8,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerLeft: {
    alignItems: 'center',
    gap: 8,
  },
  sparkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  sparkEmoji: {
    fontSize: 14,
  },
  tipLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: '#92400E',
  },
  closeBtn: {
    padding: 4,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: 16,
  },
  section: {
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  bubbleYou: {
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 14,
  },
  bubbleText: {
    fontSize: FontSize.base,
    color: '#92400E',
    lineHeight: 22,
  },
  underlineWord: {
    textDecorationLine: 'underline',
    fontWeight: FontWeight.semibold,
    color: '#DC2626',
  },
  bubbleTara: {
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    padding: 14,
  },
  bubbleTaraText: {
    fontSize: FontSize.base,
    color: '#065F46',
    lineHeight: 22,
  },
  boldWord: {
    fontWeight: FontWeight.bold,
    color: '#065F46',
  },
  whyCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 4,
  },
  whyTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginBottom: 6,
  },
  whyText: {
    fontSize: FontSize.sm,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    borderTopWidth: 1,
    gap: 12,
  },
  hearBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    gap: 8,
  },
  hearLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
  gotItBtn: {
    flex: 2,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.indigo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gotItLabel: {
    color: '#FFFFFF',
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
  },
});

export default CorrectionSheet;
