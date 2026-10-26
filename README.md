# CIC Fraud Detection

Expo / React Native app for reviewing insurance claims and banking transactions with on-device rule scoring.

## Get started

```bash
npm install
npm start
```

Demo login: any email and password (defaults are prefilled).

## App structure

- **Login** — mock auth gate
- **Dashboard** — case counts and recent high-risk items
- **Cases** — filterable list (all / transactions / claims)
- **Alerts** — medium and high risk cases
- **Case detail** — fields + triggered rule breakdown

Mock data lives in `src/data/mock-cases.ts`. Scoring rules live in `src/lib/fraud-scoring.ts`.
