import type {
  FraudCase,
  RiskLevel,
  ScoredFraudCase,
  TriggeredRule,
} from '@/types/fraud';

const TRANSACTION_HIGH_AMOUNT = 150_000;
const CLAIM_HIGH_AMOUNT = 500_000;
const NIGHT_START = 0;
const NIGHT_END = 5;
const SAME_DAY_REPEAT_THRESHOLD = 2;

function riskFromScore(score: number): RiskLevel {
  if (score >= 60) return 'high';
  if (score >= 30) return 'medium';
  return 'low';
}

function isNightTime(iso: string): boolean {
  const hour = new Date(iso).getHours();
  return hour >= NIGHT_START && hour < NIGHT_END;
}

function sameDayKey(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

function countSameDayEvents(cases: FraudCase[], entityId: string, iso: string): number {
  const day = sameDayKey(iso);
  return cases.filter(
    (c) => c.entityId === entityId && sameDayKey(c.timestamp) === day,
  ).length;
}

export function scoreCase(fraudCase: FraudCase, allCases: FraudCase[]): ScoredFraudCase {
  const rules: TriggeredRule[] = [];

  if (fraudCase.type === 'transaction' && fraudCase.amount >= TRANSACTION_HIGH_AMOUNT) {
    rules.push({
      id: 'txn_high_amount',
      label: `Transaction amount ≥ KES ${TRANSACTION_HIGH_AMOUNT.toLocaleString()}`,
      points: 35,
    });
  }

  if (fraudCase.type === 'claim' && fraudCase.amount >= CLAIM_HIGH_AMOUNT) {
    rules.push({
      id: 'claim_high_amount',
      label: `Claim amount ≥ KES ${CLAIM_HIGH_AMOUNT.toLocaleString()}`,
      points: 35,
    });
  }

  if (isNightTime(fraudCase.timestamp)) {
    rules.push({
      id: 'night_activity',
      label: 'Activity between 00:00–05:00',
      points: 20,
    });
  }

  if (fraudCase.isNewCounterparty) {
    rules.push({
      id: 'new_counterparty',
      label:
        fraudCase.type === 'transaction'
          ? 'First-time payee / merchant'
          : 'First-time service provider',
      points: 25,
    });
  }

  const sameDayCount = countSameDayEvents(allCases, fraudCase.entityId, fraudCase.timestamp);
  if (sameDayCount >= SAME_DAY_REPEAT_THRESHOLD) {
    rules.push({
      id: 'rapid_repeat',
      label: `${sameDayCount} events same day for this entity`,
      points: 20,
    });
  }

  if (fraudCase.type === 'claim') {
    const ratio = fraudCase.amount / Math.max(fraudCase.typicalCategoryAmount, 1);
    if (ratio >= 2) {
      rules.push({
        id: 'claim_vs_typical',
        label: `Claim is ${ratio.toFixed(1)}× typical for ${fraudCase.claimCategory}`,
        points: 30,
      });
    }
  }

  const score = rules.reduce((sum, rule) => sum + rule.points, 0);

  return {
    ...fraudCase,
    score,
    riskLevel: riskFromScore(score),
    triggeredRules: rules,
  };
}

export function scoreAllCases(cases: FraudCase[]): ScoredFraudCase[] {
  return cases
    .map((c) => scoreCase(c, cases))
    .sort((a, b) => b.score - a.score || b.timestamp.localeCompare(a.timestamp));
}

export function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE')}`;
}

export function riskLabel(level: RiskLevel): string {
  switch (level) {
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    default:
      return 'Low';
  }
}
