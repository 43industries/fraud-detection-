import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CaseCard } from '@/components/CaseCard';
import { Spacing } from '@/constants/theme';
import { scoredCases } from '@/data/mock-cases';
import { useTheme } from '@/hooks/use-theme';
import type { CaseType } from '@/types/fraud';

type Filter = 'all' | CaseType;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'transaction', label: 'Transactions' },
  { key: 'claim', label: 'Claims' },
];

export default function CasesScreen() {
  const theme = useTheme();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scoredCases.filter((item) => {
      if (filter !== 'all' && item.type !== filter) return false;
      if (!q) return true;
      const haystack = [
        item.partyName,
        item.id,
        item.type === 'transaction' ? item.merchant : item.policyNumber,
        item.type === 'claim' ? item.provider : '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [filter, query]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search party, merchant, policy…"
        placeholderTextColor={theme.textSecondary}
        style={[
          styles.search,
          { backgroundColor: theme.backgroundElement, color: theme.text },
        ]}
      />

      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? '#0B5CAB' : theme.backgroundElement,
                },
              ]}>
              <Text style={{ color: active ? '#fff' : theme.text, fontWeight: '600', fontSize: 13 }}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={{ color: theme.textSecondary, textAlign: 'center', marginTop: 24 }}>
            No cases match your filters.
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
    paddingTop: Spacing.two,
  },
  search: {
    marginHorizontal: Spacing.three,
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: Spacing.two,
  },
  filters: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.two,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  list: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
  },
});
