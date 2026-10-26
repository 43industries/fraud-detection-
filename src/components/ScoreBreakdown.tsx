import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { TriggeredRule } from '@/types/fraud';

type Props = {
  rules: TriggeredRule[];
  score: number;
};

export function ScoreBreakdown({ rules, score }: Props) {
  const theme = useTheme();

  if (rules.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: theme.backgroundElement }]}>
        <Text style={{ color: theme.textSecondary }}>No fraud rules triggered.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: theme.text }]}>Triggered rules</Text>
        <Text style={[styles.total, { color: theme.text }]}>Total {score}</Text>
      </View>
      {rules.map((rule) => (
        <View
          key={rule.id}
          style={[styles.row, { backgroundColor: theme.backgroundElement }]}>
          <Text style={[styles.label, { color: theme.text }]}>{rule.label}</Text>
          <Text style={[styles.points, { color: theme.textSecondary }]}>+{rule.points}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
  },
  total: {
    fontSize: 14,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 10,
  },
  label: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  points: {
    fontSize: 14,
    fontWeight: '700',
  },
  empty: {
    padding: Spacing.three,
    borderRadius: 10,
  },
});
