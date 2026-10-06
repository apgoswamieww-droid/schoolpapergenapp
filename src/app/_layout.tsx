import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthProvider, useAuth } from '@/auth/auth-context';
import { theme } from '@/constants/theme';

function RootNavigator() {
  const { session, isLoading, startupError, retrySessionLoad, clearSavedSession } = useAuth();
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  useEffect(() => {
    if (startupError) {
      console.error('Unable to restore the saved session.', startupError);
    }
  }, [startupError]);

  async function handleClearSavedSession() {
    setRecoveryError(null);
    try {
      await clearSavedSession();
    } catch (error) {
      setRecoveryError(error instanceof Error ? error.message : 'Unable to clear the saved session.');
    }
  }

  if (startupError) {
    return (
      <View style={styles.messageScreen}>
        <Text style={styles.errorTitle}>We couldn&apos;t restore your session</Text>
        <Text style={styles.errorBody}>{startupError}</Text>
        <Pressable style={styles.retryButton} onPress={retrySessionLoad}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
        <Pressable onPress={handleClearSavedSession}>
          <Text style={styles.clearSessionText}>Clear saved session and sign in</Text>
        </Pressable>
        {recoveryError && <Text style={styles.errorBody}>{recoveryError}</Text>}
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.messageScreen}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: styles.stackContent }}>
        <Stack.Screen name="index" />
        <Stack.Protected guard={!session}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={session?.user.role === 'TEACHER'}>
          <Stack.Screen name="(teacher)" />
        </Stack.Protected>
        <Stack.Protected guard={session?.user.role === 'STUDENT'}>
          <Stack.Screen name="(student)" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  stackContent: {
    backgroundColor: theme.colors.background,
  },
  messageScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    backgroundColor: theme.colors.background,
    gap: 14,
  },
  errorTitle: {
    color: theme.colors.text,
    fontSize: 21,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorBody: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 6,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 13,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  clearSessionText: {
    padding: 8,
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
