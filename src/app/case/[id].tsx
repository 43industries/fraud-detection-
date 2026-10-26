import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { RiskBadge } from '@/components/RiskBadge';
import { ScoreBreakdown } from '@/components/ScoreBreakdown';
import { Spacing } from '@/constants/theme';
import { getScoredCaseById } from '@/data/mock-cases';
import { useTheme } from '@/hooks/use-theme';
import { formatKes } from '@/lib/fraud-scoring';

export default function CaseDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = typeof id === 'string' ? getScoredCaseById(id) : undefined;

  if (!item) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <Text style={{ color: theme.text }}>Case not found.</Text>
      </View>
    );
  }

  const when = new Date(item.timestamp).toLocaleString('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          title: item.id,
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.text,
        }}
      />

      <View style={styles.titleRow}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[styles.type, { color: theme.textSecondary }]}>
            {item.type === 'transaction' ? 'Banking transaction' : 'Insurance claim'}
          </Text>
          <Text style={[styles.name, { color: theme.text }]}>{item.partyName}</Text>
        </View>
        <RiskBadge level={item.riskLevel} />
      </View>

      <View style={[styles.panel, { backgroundColor: theme.backgroundElement }]}>
        <DetailRow label="Amount" value={formatKes(item.amount)} theme={theme} />
        <DetailRow label="When" value={when} theme={theme} />
        <DetailRow label="Entity ID" value={item.entityId} theme={theme} />
        <DetailRow
          label="New counterparty"
          value={item.isNewCounterparty ? 'Yes' : 'No'}
          theme={theme}
        />

        {item.type === 'transaction' ? (
          <>
            <DetailRow label="Merchant" value={item.merchant} theme={theme} />
            <DetailRow label="Account" value={item.accountMasked} theme={theme} />
            <DetailRow label="Channel" value={item.channel} theme={theme} />
          </>
        ) : (
          <>
            <DetailRow label="Policy" value={item.policyNumber} theme={theme} />
            <DetailRow label="Category" value={item.claimCategory} theme={theme} />
            <DetailRow label="Provider" value={item.provider} theme={theme} />
            <DetailRow
              label="Typical for category"
              value={formatKes(item.typicalCategoryAmount)}
              theme={theme}
            />
          </>
        )}
      </View>

      <ScoreBreakdown rules={item.triggeredRules} score={item.score} />
    </ScrollView>
  );
}

function DetailRow({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: { text: string; textSecondary: string };
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.three,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  type: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
  },
  panel: {
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  detailRow: {
    gap: 2,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 15,
  },
});
