import { StyleSheet, Text, View } from 'react-native';

import { riskLabel } from '@/lib/fraud-scoring';
import type { RiskLevel } from '@/types/fraud';

const COLORS: Record<RiskLevel, { bg: string; text: string }> = {
  high: { bg: '#FEE2E2', text: '#B91C1C' },
  medium: { bg: '#FEF3C7', text: '#B45309' },
  low: { bg: '#DCFCE7', text: '#15803D' },
};

type Props = {
  level: RiskLevel;
};

export function RiskBadge({ level }: Props) {
  const colors = COLORS[level];
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{riskLabel(level)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
