/**
 * Auth landing — shown when a user is logged out.
 * Connects to login and signup flows.
 * Actual auth is stubbed (issue #13 — blocked on backend).
 */
import {
  View, Text, StyleSheet, SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Radius, Font, getColors, getShadow } from '../../constants/theme';
import { useIsDark } from '../../store/theme';
import { AnimatedButton } from '../../components/AnimatedButton';

export default function AuthLandingScreen() {
  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: C.background }]}>

      <View style={styles.container}>

        {/* Brand */}
        <View style={styles.brandSection}>
          <View style={[styles.appIcon, { backgroundColor: C.teal, borderColor: C.black }, getShadow(isDark)]}>
            <MaterialIcons name="menu-book" size={40} color={C.white} />
          </View>
          <Text style={[styles.appName, { color: C.black }]}>Borrow</Text>
          <Text style={[styles.tagline, { color: C.gray }]}>
            Share books with your neighbors.{'\n'}No library card needed.
          </Text>
        </View>

        {/* Feature highlights */}
        <View style={[styles.featureCard, { backgroundColor: C.white, borderColor: C.black }, getShadow(isDark)]}>
          {[
            { icon: 'search', text: 'Find books nearby' },
            { icon: 'swap-horiz', text: 'Request, lend, return' },
            { icon: 'people', text: 'Build your reading community' },
          ].map(f => (
            <View key={f.text} style={styles.featureRow}>
              <View style={[styles.featureIcon, { backgroundColor: isDark ? C.pillActive : '#EEF2FF' }]}>
                <MaterialIcons name={f.icon as any} size={18} color={C.teal} />
              </View>
              <Text style={[styles.featureText, { color: C.black }]}>{f.text}</Text>
            </View>
          ))}
        </View>

        {/* CTAs */}
        <View style={styles.ctaSection}>
          <AnimatedButton
            style={[styles.primaryBtn, { backgroundColor: C.teal, borderColor: C.black }, getShadow(isDark)]}
            onPress={() => router.push('/auth/signup')}
          >
            <Text style={[styles.primaryBtnText, { color: C.white }]}>Create account</Text>
          </AnimatedButton>

          <AnimatedButton
            style={[styles.secondaryBtn, { backgroundColor: C.white, borderColor: C.black }, getShadow(isDark)]}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={[styles.secondaryBtnText, { color: C.black }]}>Log in</Text>
          </AnimatedButton>

          <Text style={[styles.termsNote, { color: C.gray }]}>
            By continuing you agree to our{' '}
            <Text
              style={{ textDecorationLine: 'underline' }}
              onPress={() => router.push('/privacy')}
            >
              Privacy Policy
            </Text>
            {' '}and Terms of Service.
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    safeArea: { flex: 1 },
    container: {
      flex: 1, paddingHorizontal: 24, paddingVertical: 32,
      justifyContent: 'space-between',
    },

    brandSection: { alignItems: 'center', gap: 12 },
    appIcon: {
      width: 80, height: 80, borderRadius: 20, borderWidth: 1,
      alignItems: 'center', justifyContent: 'center',
    },
    appName: { fontSize: 32, fontWeight: '800', fontFamily: Font.extraBold },
    tagline: { fontSize: 15, fontFamily: Font.regular, textAlign: 'center', lineHeight: 22 },

    featureCard: {
      borderWidth: 1, borderRadius: Radius.card,
      padding: 20, gap: 14,
    },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    featureIcon: {
      width: 36, height: 36, borderRadius: 10,
      alignItems: 'center', justifyContent: 'center',
    },
    featureText: { fontSize: 14, fontFamily: Font.bold, fontWeight: '600' },

    ctaSection: { gap: 12 },
    primaryBtn: {
      borderWidth: 1, borderRadius: Radius.card,
      paddingVertical: 15, alignItems: 'center',
    },
    primaryBtnText: { fontSize: 15, fontWeight: '800', fontFamily: Font.extraBold },
    secondaryBtn: {
      borderWidth: 1, borderRadius: Radius.card,
      paddingVertical: 15, alignItems: 'center',
    },
    secondaryBtnText: { fontSize: 15, fontWeight: '700', fontFamily: Font.bold },
    termsNote: {
      fontSize: 11, fontFamily: Font.regular,
      textAlign: 'center', lineHeight: 18,
    },
  });
}
