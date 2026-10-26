export type CaseType = 'transaction' | 'claim';

export type RiskLevel = 'low' | 'medium' | 'high';

export type TriggeredRule = {
  id: string;
  label: string;
  points: number;
};

export type FraudCaseBase = {
  id: string;
  type: CaseType;
  amount: number;
  currency: 'KES';
  timestamp: string;
  entityId: string;
  partyName: string;
  isNewCounterparty: boolean;
};

export type TransactionCase = FraudCaseBase & {
  type: 'transaction';
  merchant: string;
  accountMasked: string;
  channel: 'mobile' | 'card' | 'transfer';
};

export type ClaimCase = FraudCaseBase & {
  type: 'claim';
  policyNumber: string;
  claimCategory: 'motor' | 'medical' | 'property' | 'life';
  provider: string;
  typicalCategoryAmount: number;
};

export type FraudCase = TransactionCase | ClaimCase;

export type ScoredFraudCase = FraudCase & {
  score: number;
  riskLevel: RiskLevel;
  triggeredRules: TriggeredRule[];
};
