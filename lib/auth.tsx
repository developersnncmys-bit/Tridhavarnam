'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

// Frontend-only auth state. There is no real backend yet — LoginModal
// simulates a successful request and hands the resulting user record to
// this provider. The user is persisted in localStorage so the signed-in
// state survives a hard reload, like every real e-commerce site.

const STORAGE_KEY = 'tridha-user';

export type AuthUser = {
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  mobile?: string;
  dob?: string; // ISO yyyy-mm-dd
};

type AuthContextValue = {
  user: AuthUser | null;
  // Hydrated flips to true after the initial localStorage read on the
  // client. Components that key UI off `user` should also wait for
  // `hydrated` to avoid a "Sign In" → "Account" flash on first paint.
  hydrated: boolean;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
};

const Ctx = createContext<AuthContextValue | null>(null);

// Derive a friendly display name from an email when the user signs in
// without supplying one (sign-in form only asks for email + password).
// `john.doe@example.com` -> `John`.
export function deriveNameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? '';
  const first = local.split(/[._-]/)[0] ?? local;
  if (!first) return 'Friend';
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthUser;
        if (parsed && typeof parsed.email === 'string') {
          setUser(parsed);
        }
      }
    } catch {
      /* private mode / malformed payload — treat as signed out */
    }
    setHydrated(true);
  }, []);

  const signIn = useCallback((next: AuthUser) => {
    setUser(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ user, hydrated, signIn, signOut }),
    [user, hydrated, signIn, signOut],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
