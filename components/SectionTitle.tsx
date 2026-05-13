import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight } from '@/constants/tokens';

interface SectionTitleProps {
  title: string;
  action?: string;
  onAction?: () => void;
  dark?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  action,
  onAction,
  dark = false,
}) => {
  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: dark ? Colors.d_text : Colors.text }]}>
        {title}
      </Text>
      {action && onAction && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={styles.action}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
  action: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.indigoDeep,
  },
});

export default SectionTitle;
