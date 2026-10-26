import { useMemo } from 'react';
import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { CaseCard } from '@/components/CaseCard';
import { Spacing } from '@/constants/theme';
import { scoredCases } from '@/data/mock-cases';
import { useTheme } from '@/hooks/use-theme';

export default function AlertsScreen() {
  const theme = useTheme();

  const alerts = useMemo(
    () => scoredCases.filter((c) => c.riskLevel === 'high' || c.riskLevel === 'medium'),
    [],
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.caption, { color: theme.textSecondary }]}>
        Medium and high risk cases needing review.
      </Text>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={{ color: theme.textSecondary, textAlign: 'center', marginTop: 24 }}>
            No active alerts.
          </Text>
        }
        renderItem={({ item }) => (
          <CaseCard item={item} onPress={() => router.push(`/case/${item.id}`)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  caption: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.one,
    fontSize: 14,
  },
  list: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
  },
});
