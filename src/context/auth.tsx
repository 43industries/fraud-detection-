import { createContext, use, useMemo, useState, type PropsWithChildren } from 'react';

type AuthContextValue = {
  isSignedIn: boolean;
  email: string | null;
  signIn: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [email, setEmail] = useState<string | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      isSignedIn: email != null,
      email,
      signIn: (nextEmail, password) => {
        const trimmed = nextEmail.trim();
        if (!trimmed || !password.trim()) {
          return { ok: false, error: 'Enter email and password.' };
        }
        if (!trimmed.includes('@')) {
          return { ok: false, error: 'Enter a valid email.' };
        }
        setEmail(trimmed);
        return { ok: true };
      },
      signOut: () => setEmail(null),
    }),
    [email],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return value;
}
