import { api, assertApiConfigured } from '@/api/client';
import type { AuthSession, UserRole } from '@/auth/types';

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readStringOrNumber(value: unknown): string | number | undefined {
  return typeof value === 'string' || typeof value === 'number' ? value : undefined;
}

function parseLoginResponse(response: unknown): AuthSession {
  if (!isRecord(response)) {
    throw new Error('The server returned an invalid sign-in response.');
  }

  const payload = isRecord(response.data) ? response.data : response;
  const user = isRecord(payload.user) ? payload.user : payload;
  const token =
    (typeof payload.access_token === 'string' && payload.access_token) ||
    (typeof payload.accessToken === 'string' && payload.accessToken) ||
    (typeof payload.token === 'string' && payload.token);
  const roleValue = typeof user.role === 'string' ? user.role.toUpperCase() : '';
  const role: UserRole | undefined =
    roleValue === 'TEACHER' || roleValue === 'STUDENT' ? roleValue : undefined;
  const schoolId = readStringOrNumber(
    user.school_id ?? user.schoolId ?? payload.school_id ?? payload.schoolId,
  );

  if (!token || !role || schoolId === undefined || schoolId === '') {
    throw new Error(
      'The sign-in response is missing a valid token, user role, or school_id. Please contact your school administrator.',
    );
  }

  return {
    token,
    user: {
      id: readStringOrNumber(user.id),
      email: typeof user.email === 'string' ? user.email : undefined,
      role,
      schoolId,
    },
  };
}

export async function login(email: string, password: string): Promise<AuthSession> {
  assertApiConfigured();
  const response = await api.post<unknown>('/api/auth/login', { email, password });
  return parseLoginResponse(response.data);
}
