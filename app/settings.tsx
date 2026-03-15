import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Shadow, Radius, Font, getColors } from '../constants/theme';
import { ThemePref, setThemePref, useIsDark, useThemePref } from '../store/theme';
import { SlidingSelector } from '../components/SlidingSelector';

const THEME_OPTIONS: { key: ThemePref; label: string; icon: React.ComponentProps<typeof MaterialIcons>['name'] }[] = [
  { key: 'light',  label: 'Light',  icon: 'light-mode' },
  { key: 'dark',   label: 'Dark',   icon: 'dark-mode' },
  { key: 'system', label: 'Device', icon: 'smartphone' },
];

// ── Settings row ──────────────────────────────────────────────────────────────
function SettingsRow({
  icon, label, onPress, isDark, color, last,
}: {
  icon: string; label: string; onPress?: () => void;
  isDark: boolean; color?: string; last?: boolean;
}) {
  const C = getColors(isDark);
  const labelColor = color ?? C.black;
  const iconColor = color ?? C.gray;
  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: C.lightGray, borderBottomWidth: last ? 0 : 1 }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <MaterialIcons name={icon as any} size={20} color={iconColor} />
      <Text style={[styles.rowLabel, { color: labelColor }]}>{label}</Text>
      {onPress && !color && <MaterialIcons name="chevron-right" size={18} color={C.lightGray} />}
    </TouchableOpacity>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const isDark = useIsDark();
  const pref = useThemePref();
  const C = getColors(isDark);

  const handleLogout = () => {
    Alert.alert(
      'Log out?',
      'You will be returned to the login screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out', style: 'destructive',
          onPress: () => {
            // TODO: clear auth tokens (issue #13)
            router.replace('/auth/index');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: C.background }]}>

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: C.black, backgroundColor: C.white }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={20} color={C.black} />
        </TouchableOpacity>
        <Text style={[styles.heading, { color: C.black }]}>Settings</Text>
      </View>

      <ScrollView>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.gray }]}>APPEARANCE</Text>
          <View style={[styles.card, { backgroundColor: C.white, borderColor: C.black }]}>
            <Text style={[styles.settingTitle, { color: C.black }]}>Theme</Text>
            <Text style={[styles.settingDesc, { color: C.gray }]}>
              Choose how Borrow looks on this device
            </Text>
            <SlidingSelector
              options={THEME_OPTIONS}
              selected={pref}
              onSelect={(key) => setThemePref(key as ThemePref)}
            />
          </View>
        </View>

        {/* Account */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.gray }]}>ACCOUNT</Text>
          <View style={[styles.card, { backgroundColor: C.white, borderColor: C.black, padding: 0 }]}>
            <SettingsRow
              icon="person-outline" label="Edit Profile"
              onPress={() => router.push('/profile-edit')}
              isDark={isDark}
            />
            <SettingsRow
              icon="notifications-none" label="Notifications"
              onPress={() => router.push('/notifications-settings')}
              isDark={isDark}
            />
            <SettingsRow
              icon="lock-outline" label="Privacy"
              onPress={() => router.push('/privacy')}
              isDark={isDark}
              last
            />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.gray }]}>ABOUT</Text>
          <View style={[styles.card, { backgroundColor: C.white, borderColor: C.black, padding: 0 }]}>
            <SettingsRow
              icon="info-outline" label="About Borrow"
              onPress={() => router.push('/about')}
              isDark={isDark}
            />
            <SettingsRow
              icon="bug-report" label="Report a Bug"
              onPress={() => router.push('/report?type=bug')}
              isDark={isDark}
            />
            <SettingsRow
              icon="star-outline" label="Rate the App"
              isDark={isDark}
              last
              // TODO: StoreKit / Play In-App Review once live in stores (issue #22)
            />
          </View>
        </View>

        {/* Log out */}
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: C.white, borderColor: C.black, padding: 0 }]}>
            <SettingsRow
              icon="logout" label="Log out"
              onPress={handleLogout}
              isDark={isDark}
              color="#E53935"
              last
            />
          </View>
        </View>

        <Text style={[styles.version, { color: C.gray }]}>Version 0.1.0</Text>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, gap: 12,
  },
  backBtn: { padding: 4 },
  heading: { fontSize: 17, fontWeight: '800', fontFamily: Font.extraBold },

  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionLabel: {
    fontSize: 11, fontWeight: '800', fontFamily: Font.extraBold,
    letterSpacing: 0.8, marginBottom: 10,
  },
  card: {
    borderWidth: 1, borderRadius: Radius.card,
    padding: 16, gap: 12,
    overflow: 'hidden',
  },
  settingTitle: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold },
  settingDesc: { fontSize: 12, fontFamily: Font.regular, marginTop: -4 },

  row: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  rowLabel: { flex: 1, fontSize: 14, fontFamily: Font.bold, fontWeight: '600' },

  version: { textAlign: 'center', fontSize: 11, fontFamily: Font.regular, marginTop: 32 },
});
