import { create, isAxiosError } from 'axios';

import { getStoredSession } from '@/auth/session-storage';

const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function assertApiConfigured() {
  if (!apiBaseUrl) {
    throw new Error(
      'The API URL is not configured. Set EXPO_PUBLIC_API_URL to your backend origin and restart Expo.',
    );
  }
}

export const api = create({
  baseURL: apiBaseUrl,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  if (config.url !== '/api/auth/login') {
    const session = await getStoredSession();
    if (session?.token) {
      config.headers.Authorization = `Bearer ${session.token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError<{ message?: string; error?: string }>(error)) {
      const serverMessage = error.response?.data?.message ?? error.response?.data?.error;
      const message =
        serverMessage ??
        (error.code === 'ECONNABORTED'
          ? 'The request timed out. Please try again.'
          : error.response
            ? 'The request could not be completed. Please check your details and try again.'
            : 'Unable to reach the school server. Check your connection and try again.');

      return Promise.reject(new ApiError(message, error.response?.status));
    }

    return Promise.reject(error);
  },
);
