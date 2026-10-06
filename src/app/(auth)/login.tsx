import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/auth/auth-context';
import { theme } from '@/constants/theme';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      setError('Enter your school email and password to continue.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await signIn(normalizedEmail, password);
    } catch (signInError) {
      setError(
        signInError instanceof Error
          ? signInError.message
          : 'We couldn’t sign you in. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.brandRow}>
              <View style={styles.logo}>
                <SymbolView
                  name={{ ios: 'graduationcap.fill', android: 'school', web: 'school' }}
                  size={24}
                  tintColor="#FFFFFF"
                />
              </View>
              <View>
                <Text style={styles.brandName}>SchoolPaperGen</Text>
                <Text style={styles.brandCaption}>SCHOOL EXAM GENERATOR</Text>
              </View>
            </View>

            <View style={styles.welcome}>
              <View style={styles.welcomeBadge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>Your school workspace</Text>
              </View>
              <Text style={styles.heading}>Welcome{'\n'}back.</Text>
              <Text style={styles.subtitle}>
                Sign in to create, manage, and take exams—all in one place.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Sign in to your account</Text>
              <Text style={styles.cardSubtitle}>
                Use the email address provided by your school.
              </Text>

              <View style={styles.field}>
                <Text style={styles.label}>School email</Text>
                <View style={styles.inputShell}>
                  <SymbolView
                    name={{ ios: 'envelope', android: 'email', web: 'mail' }}
                    size={18}
                    tintColor={theme.colors.textMuted}
                  />
                  <TextInput
                    accessibilityLabel="School email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    placeholder="you@school.edu"
                    placeholderTextColor="#94A3B8"
                    returnKeyType="next"
                    style={styles.input}
                    textContentType="emailAddress"
                    value={email}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputShell}>
                  <SymbolView
                    name={{ ios: 'lock', android: 'lock', web: 'lock' }}
                    size={18}
                    tintColor={theme.colors.textMuted}
                  />
                  <TextInput
                    accessibilityLabel="Password"
                    autoCapitalize="none"
                    autoComplete="password"
                    onChangeText={setPassword}
                    onSubmitEditing={handleSubmit}
                    placeholder="Enter your password"
                    placeholderTextColor="#94A3B8"
                    returnKeyType="go"
                    secureTextEntry={!passwordVisible}
                    style={styles.input}
                    textContentType="password"
                    value={password}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
                    onPress={() => setPasswordVisible((visible) => !visible)}
                    hitSlop={10}>
                    <Text style={styles.showPassword}>{passwordVisible ? 'Hide' : 'Show'}</Text>
                  </Pressable>
                </View>
              </View>

              {error && (
                <View accessibilityRole="alert" style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <Pressable
                accessibilityRole="button"
                disabled={submitting}
                onPress={handleSubmit}
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed && !submitting && styles.buttonPressed,
                  submitting && styles.buttonDisabled,
                ]}>
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.submitText}>Sign in</Text>
                    <SymbolView
                      name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_right' }}
                      size={18}
                      tintColor="#FFFFFF"
                    />
                  </>
                )}
              </Pressable>

              <View style={styles.secureNote}>
                <SymbolView
                  name={{ ios: 'lock.shield', android: 'verified_user', web: 'verified_user' }}
                  size={15}
                  tintColor={theme.colors.textMuted}
                />
                <Text style={styles.secureText}>Secure access to your school account</Text>
              </View>
            </View>

            <Text style={styles.footer}>
              Need help signing in? Contact your school administrator.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 32,
  },
  content: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 42,
  },
  logo: {
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: theme.colors.primary,
    boxShadow: '0px 6px 12px rgba(79, 70, 229, 0.2)',
  },
  brandName: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: 800,
    letterSpacing: -0.3,
  },
  brandCaption: {
    marginTop: 3,
    color: theme.colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.35,
  },
  welcome: {
    marginBottom: 26,
  },
  welcomeBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    borderRadius: 20,
    backgroundColor: theme.colors.primarySoft,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  badgeText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  heading: {
    marginTop: 18,
    color: theme.colors.text,
    fontSize: 43,
    fontWeight: '800',
    letterSpacing: -1.7,
    lineHeight: 47,
  },
  subtitle: {
    maxWidth: 350,
    marginTop: 10,
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
  },
  card: {
    padding: 22,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    backgroundColor: theme.colors.surface,
    boxShadow: '0px 12px 24px rgba(15, 23, 42, 0.07)',
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 19,
    fontWeight: 700,
    letterSpacing: -0.35,
  },
  cardSubtitle: {
    marginTop: 6,
    marginBottom: 22,
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  field: {
    marginBottom: 17,
  },
  label: {
    marginBottom: 8,
    color: '#334155',
    fontSize: 13,
    fontWeight: 600,
  },
  inputShell: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 14,
    color: theme.colors.text,
    fontSize: 14,
  },
  showPassword: {
    paddingVertical: 8,
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  errorBox: {
    marginBottom: 14,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 13,
    lineHeight: 19,
  },
  submitButton: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 4,
    borderRadius: 13,
    backgroundColor: theme.colors.primary,
    boxShadow: '0px 6px 12px rgba(79, 70, 229, 0.22)',
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 18,
  },
  secureText: {
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  footer: {
    marginTop: 23,
    color: theme.colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
});
