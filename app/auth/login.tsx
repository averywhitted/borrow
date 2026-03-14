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

export default function LoginScreen() {
  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = email.includes('@') && password.length >= 6;

  const handleLogin = async () => {
    if (!canSubmit) return;
    setLoading(true);
    // TODO: wire to auth backend (issue #13)
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Auth coming soon',
        'Login is not yet connected to a backend. This UI is ready for wiring.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }],
      );
    }, 800);
  };

  const handleForgotPassword = () => {
    Alert.alert('Reset password', 'A reset link will be sent to ' + (email || 'your email address') + ' once auth is live.');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: C.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: C.black, backgroundColor: C.white }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color={C.black} />
          </TouchableOpacity>
          <Text style={[styles.heading, { color: C.black }]}>Log in</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          <Text style={[styles.welcomeText, { color: C.black }]}>Welcome back</Text>
          <Text style={[styles.welcomeSub, { color: C.gray }]}>Log in to your Borrow account</Text>

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
            <View style={styles.passwordLabelRow}>
              <Text style={[styles.fieldLabel, { color: C.black }]}>Password</Text>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={[styles.forgotLink, { color: C.teal }]}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <View style={[styles.inputRow, { backgroundColor: C.white, borderColor: C.black }, getShadow(isDark)]}>
              <MaterialIcons name="lock-outline" size={18} color={C.gray} />
              <TextInput
                style={[styles.input, { color: C.black }]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={C.lightGray}
                secureTextEntry={!showPassword}
                autoComplete="current-password"
              />
              <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                <MaterialIcons
                  name={showPassword ? 'visibility-off' : 'visibility'}
                  size={18} color={C.gray}
                />
              </TouchableOpacity>
            </View>
          </View>

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
            onPress={handleLogin}
            disabled={!canSubmit || loading}
          >
            <Text style={[styles.submitBtnText, { color: C.white }]}>
              {loading ? 'Logging in…' : 'Log in'}
            </Text>
          </AnimatedButton>

          {/* Sign up link */}
          <View style={styles.switchRow}>
            <Text style={[styles.switchText, { color: C.gray }]}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.replace('/auth/signup')}>
              <Text style={[styles.switchLink, { color: C.teal }]}>Sign up</Text>
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
    content: { padding: 24, gap: 4 },

    welcomeText: { fontSize: 22, fontWeight: '800', fontFamily: Font.extraBold, marginBottom: 4 },
    welcomeSub: { fontSize: 14, fontFamily: Font.regular, marginBottom: 20 },

    fieldGroup: { gap: 8, marginBottom: 16 },
    fieldLabel: { fontSize: 13, fontWeight: '700', fontFamily: Font.bold },
    passwordLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    forgotLink: { fontSize: 12, fontFamily: Font.bold, fontWeight: '600' },

    inputRow: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      borderWidth: 1, borderRadius: Radius.card,
      paddingHorizontal: 14, paddingVertical: 12,
    },
    input: {
      flex: 1, fontSize: 14, fontFamily: Font.regular,
    },

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
