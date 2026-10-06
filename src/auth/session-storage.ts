import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { AuthSession, UserRole } from '@/auth/types';

const SESSION_KEY = 'schoolpapergenapp.session';

function isAuthSession(value: unknown): value is AuthSession {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const session = value as Partial<AuthSession>;
  return (
    typeof session.token === 'string' &&
    typeof session.user === 'object' &&
    session.user !== null &&
    (session.user.role === ('TEACHER' satisfies UserRole) ||
      session.user.role === ('STUDENT' satisfies UserRole)) &&
    (typeof session.user.schoolId === 'string' || typeof session.user.schoolId === 'number')
  );
}

async function readValue(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return globalThis.sessionStorage.getItem(SESSION_KEY);
  }
  return SecureStore.getItemAsync(SESSION_KEY);
}

async function writeValue(value: string): Promise<void> {
  if (Platform.OS === 'web') {
    globalThis.sessionStorage.setItem(SESSION_KEY, value);
    return;
  }
  await SecureStore.setItemAsync(SESSION_KEY, value);
}

async function removeValue(): Promise<void> {
  if (Platform.OS === 'web') {
    globalThis.sessionStorage.removeItem(SESSION_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

export async function getStoredSession(): Promise<AuthSession | null> {
  const storedValue = await readValue();
  if (storedValue === null) {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(storedValue);
  } catch {
    throw new Error('The saved sign-in session is corrupted. Sign out and sign in again.');
  }

  if (!isAuthSession(parsed)) {
    throw new Error('The saved sign-in session is invalid. Sign out and sign in again.');
  }

  return parsed;
}

export async function storeSession(session: AuthSession): Promise<void> {
  await writeValue(JSON.stringify(session));
}

export async function clearStoredSession(): Promise<void> {
  await removeValue();
}
