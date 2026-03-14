import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useMemo } from 'react';
import { Radius, Font, getColors, getShadow } from '../../constants/theme';
import { useIsDark } from '../../store/theme';
import { AnimatedButton } from '../../components/AnimatedButton';

export default function SignupScreen() {
  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrength = password.length === 0
    ? null
    : password.length < 8
      ? 'weak'
      : /[A-Z]/.test(password) && /[0-9]/.test(password)
        ? 'strong'
        : 'medium';

  const strengthColor = passwordStrength === 'strong' ? '#22C55E'
    : passwordStrength === 'medium' ? '#F59E0B'
    : passwordStrength === 'weak' ? '#EF4444'
    : 'transparent';

  const canSubmit = name.trim().length > 1
    && email.includes('@')
    && password.length >= 8
    && agreedToTerms;

  const handleSignup = async () => {
    if (!canSubmit) return;
    setLoading(true);
    // TODO: wire to auth backend (issue #13)
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Auth coming soon',
        'Sign-up is not yet connected to a backend. This UI is ready for wiring.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }],
      );
    }, 800);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: C.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: C.black, backgroundColor: C.white }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color={C.black} />
          </TouchableOpacity>
          <Text style={[styles.heading, { color: C.black }]}>Create account</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          <Text style={[styles.welcomeText, { color: C.black }]}>Join Borrow</Text>
          <Text style={[styles.welcomeSub, { color: C.gray }]}>
            Share books with your neighborhood
          </Text>

          {/* Name */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: C.black }]}>Full name</Text>
            <View style={[styles.inputRow, { backgroundColor: C.white, borderColor: C.black }, getShadow(isDark)]}>
              <MaterialIcons name="person-outline" size={18} color={C.gray} />
              <TextInput
                style={[styles.input, { color: C.black }]}
                value={name}
                onChangeText={setName}
                placeholder="Jane Smith"
                placeholderTextColor={C.lightGray}
                autoComplete="name"
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: C.black }]}>Email</Text>
            <View style={[styles.inputRow, { backgroundColor: C.white, borderColor: C.black }, getShadow(isDark)]}>
              <MaterialIcons name="mail-outline" size={18} color={C.gray} />
              <TextInput
                style={[styles.input, { color: C.black }]}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={C.lightGray}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: C.black }]}>Password</Text>
            <Text style={[styles.fieldHint, { color: C.gray }]}>At least 8 characters</Text>
            <View style={[styles.inputRow, { backgroundColor: C.white, borderColor: C.black }, getShadow(isDark)]}>
              <MaterialIcons name="lock-outline" size={18} color={C.gray} />
              <TextInput
                style={[styles.input, { color: C.black }]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={C.lightGray}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
              />
              <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                <MaterialIcons
                  name={showPassword ? 'visibility-off' : 'visibility'}
                  size={18} color={C.gray}
                />
              </TouchableOpacity>
            </View>
            {/* Strength indicator */}
            {passwordStrength && (
              <View style={styles.strengthRow}>
                <View style={styles.strengthBars}>
                  {(['weak', 'medium', 'strong'] as const).map((level, i) => (
                    <View
                      key={level}
                      style={[
                        styles.strengthBar,
                        {
                          backgroundColor:
                            (passwordStrength === 'weak' && i === 0) ||
                            (passwordStrength === 'medium' && i <= 1) ||
                            (passwordStrength === 'strong')
                              ? strengthColor
                              : C.lightGray,
                        },
                      ]}
                    />
                  ))}
                </View>
                <Text style={[styles.strengthLabel, { color: strengthColor }]}>
                  {passwordStrength}
                </Text>
              </View>
            )}
          </View>

          {/* Terms */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAgreedToTerms(v => !v)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.checkbox,
              { borderColor: C.black, backgroundColor: agreedToTerms ? C.pillActive : C.white },
            ]}>
              {agreedToTerms && <MaterialIcons name="check" size={14} color={C.white} />}
            </View>
            <Text style={[styles.termsText, { color: C.gray }]}>
              I agree to the{' '}
              <Text
                style={{ color: C.teal, textDecorationLine: 'underline' }}
                onPress={() => router.push('/privacy')}
              >
                Privacy Policy
              </Text>
              {' '}and Terms of Service
            </Text>
          </TouchableOpacity>

          {/* Submit */}
          <AnimatedButton
            style={[
              styles.submitBtn,
              {
                backgroundColor: canSubmit ? C.teal : C.lightGray,
                borderColor: canSubmit ? C.black : C.lightGray,
              },
              canSubmit && getShadow(isDark),
            ]}
            onPress={handleSignup}
            disabled={!canSubmit || loading}
          >
            <Text style={[styles.submitBtnText, { color: C.white }]}>
              {loading ? 'Creating account…' : 'Create account'}
            </Text>
          </AnimatedButton>

          {/* Log in link */}
          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: C.gray }]}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.replace('/auth/login')}>
              <Text style={[styles.switchLink, { color: C.teal }]}>Log in</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 16, paddingVertical: 14,
      borderBottomWidth: 1, gap: 12,
    },
    backBtn: { padding: 4 },
    heading: { fontSize: 17, fontWeight: '800', fontFamily: Font.extraBold },
    content: { padding: 24, gap: 4, paddingBottom: 40 },

    welcomeText: { fontSize: 22, fontWeight: '800', fontFamily: Font.extraBold, marginBottom: 4 },
    welcomeSub: { fontSize: 14, fontFamily: Font.regular, marginBottom: 20 },

    fieldGroup: { gap: 6, marginBottom: 14 },
    fieldLabel: { fontSize: 13, fontWeight: '700', fontFamily: Font.bold },
    fieldHint: { fontSize: 11, fontFamily: Font.regular, marginTop: -2 },

    inputRow: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      borderWidth: 1, borderRadius: Radius.card,
      paddingHorizontal: 14, paddingVertical: 12,
    },
    input: { flex: 1, fontSize: 14, fontFamily: Font.regular },

    strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
    strengthBars: { flexDirection: 'row', gap: 4, flex: 1 },
    strengthBar: { flex: 1, height: 4, borderRadius: 2 },
    strengthLabel: { fontSize: 11, fontFamily: Font.bold, fontWeight: '600', textTransform: 'capitalize' },

    termsRow: {
      flexDirection: 'row', alignItems: 'flex-start', gap: 10,
      marginBottom: 6, marginTop: 8,
    },
    checkbox: {
      width: 20, height: 20, borderWidth: 1, borderRadius: 4,
      alignItems: 'center', justifyContent: 'center', marginTop: 1,
    },
    termsText: { flex: 1, fontSize: 13, fontFamily: Font.regular, lineHeight: 20 },

    submitBtn: {
      borderWidth: 1, borderRadius: Radius.card,
      paddingVertical: 15, alignItems: 'center',
      marginTop: 8,
    },
    submitBtnText: { fontSize: 15, fontWeight: '800', fontFamily: Font.extraBold },

    switchRow: {
      flexDirection: 'row', justifyContent: 'center', gap: 6,
      marginTop: 20,
    },
    switchText: { fontSize: 13, fontFamily: Font.regular },
    switchLink: { fontSize: 13, fontFamily: Font.bold, fontWeight: '700' },
  });
}
