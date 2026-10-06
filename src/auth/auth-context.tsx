import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

import { login } from '@/api/auth';
import { clearStoredSession, getStoredSession, storeSession } from '@/auth/session-storage';
import type { AuthSession } from '@/auth/types';

type AuthContextValue = {
  session: AuthSession | null;
  isLoading: boolean;
  startupError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  retrySessionLoad: () => void;
  clearSavedSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'An unexpected authentication error occurred.';
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startupError, setStartupError] = useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    getStoredSession()
      .then((savedSession) => {
        if (active) {
          setSession(savedSession);
          setIsLoading(false);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setStartupError(getErrorMessage(error));
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [loadAttempt]);

  const signIn = useCallback(async (email: string, password: string) => {
    const nextSession = await login(email, password);
    await storeSession(nextSession);
    setSession(nextSession);
  }, []);

  const signOut = useCallback(async () => {
    await clearStoredSession();
    setSession(null);
  }, []);

  const retrySessionLoad = useCallback(() => {
    setIsLoading(true);
    setStartupError(null);
    setLoadAttempt((attempt) => attempt + 1);
  }, []);

  const clearSavedSession = useCallback(async () => {
    await clearStoredSession();
    setSession(null);
    setStartupError(null);
    setIsLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isLoading,
      startupError,
      signIn,
      signOut,
      retrySessionLoad,
      clearSavedSession,
    }),
    [session, isLoading, startupError, signIn, signOut, retrySessionLoad, clearSavedSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return context;
}
