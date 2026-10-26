import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CaseCard } from '@/components/CaseCard';
import { StatCard } from '@/components/StatCard';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import { scoredCases } from '@/data/mock-cases';
import { useTheme } from '@/hooks/use-theme';

export default function DashboardScreen() {
  const theme = useTheme();
  const { email, signOut } = useAuth();

  const highRisk = scoredCases.filter((c) => c.riskLevel === 'high');
  const transactions = scoredCases.filter((c) => c.type === 'transaction');
  const claims = scoredCases.filter((c) => c.type === 'claim');
  const recentHigh = highRisk.slice(0, 4);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>Signed in as</Text>
          <Text style={[styles.email, { color: theme.text }]} numberOfLines={1}>
            {email}
          </Text>
        </View>
        <Pressable onPress={signOut} style={[styles.signOut, { borderColor: theme.backgroundSelected }]}>
          <Text style={{ color: theme.text, fontWeight: '600' }}>Sign out</Text>
        </Pressable>
      </View>

      <Text style={[styles.heading, { color: theme.text }]}>Fraud overview</Text>

      <View style={styles.stats}>
        <StatCard label="Total cases" value={scoredCases.length} />
        <StatCard label="High risk" value={highRisk.length} accent="#B91C1C" />
        <StatCard label="Transactions" value={transactions.length} />
        <StatCard label="Claims" value={claims.length} />
      </View>

      <Text style={[styles.section, { color: theme.text }]}>Recent high-risk</Text>
      {recentHigh.length === 0 ? (
        <Text style={{ color: theme.textSecondary }}>No high-risk cases.</Text>
      ) : (
        recentHigh.map((item) => (
          <CaseCard
            key={item.id}
            item={item}
            onPress={() => router.push(`/case/${item.id}`)}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.three,
    paddingBottom: Spacing.six,
    gap: Spacing.two,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  greeting: {
    fontSize: 12,
  },
  email: {
    fontSize: 15,
    fontWeight: '600',
  },
  signOut: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: Spacing.one,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  section: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.one,
  },
});
