import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/auth-context';
import { theme } from '@/constants/theme';

export default function TeacherDashboard() {
  const { session, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setError(null);
    setSigningOut(true);
    try {
      await signOut();
    } catch (signOutError) {
      setError(signOutError instanceof Error ? signOutError.message : 'Unable to sign out.');
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>C</Text>
        </View>
        <Text style={styles.brand}>SchoolPaperGen</Text>
        <Pressable accessibilityRole="button" disabled={signingOut} onPress={handleSignOut}>
          {signingOut ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            <Text style={styles.signOut}>Sign out</Text>
          )}
        </Pressable>
      </View>
      <View style={styles.card}>
        <Text style={styles.eyebrow}>TEACHER WORKSPACE</Text>
        <Text style={styles.heading}>Your SchoolPaperGen, ready.</Text>
        <Text style={styles.body}>
          You’re signed in as {session?.user.email ?? 'a teacher'} for school {session?.user.schoolId}.
          Your exam tools will live here.
        </Text>
        {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  header: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  logo: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  brand: {
    flex: 1,
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: 700,
  },
  signOut: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    padding: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heading: {
    marginTop: 12,
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  body: {
    marginTop: 9,
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
  },
  error: {
    marginTop: 14,
    color: theme.colors.danger,
    fontSize: 13,
  },
});
