import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RiskBadge } from '@/components/RiskBadge';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatKes } from '@/lib/fraud-scoring';
import type { ScoredFraudCase } from '@/types/fraud';

type Props = {
  item: ScoredFraudCase;
  onPress: () => void;
};

export function CaseCard({ item, onPress }: Props) {
  const theme = useTheme();
  const subtitle =
    item.type === 'transaction'
      ? `${item.merchant} · ${item.channel}`
      : `${item.claimCategory} · ${item.policyNumber}`;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.backgroundElement,
          opacity: pressed ? 0.85 : 1,
        },
      ]}>
      <View style={styles.row}>
        <View style={styles.meta}>
          <Text style={[styles.type, { color: theme.textSecondary }]}>
            {item.type === 'transaction' ? 'Transaction' : 'Insurance claim'}
          </Text>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
            {item.partyName}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        <View style={styles.right}>
          <RiskBadge level={item.riskLevel} />
          <Text style={[styles.amount, { color: theme.text }]}>{formatKes(item.amount)}</Text>
          <Text style={[styles.score, { color: theme.textSecondary }]}>Score {item.score}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.three,
    borderRadius: 12,
    marginBottom: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  type: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  score: {
    fontSize: 12,
  },
});
