import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
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
  icon, label, onPress, isDark,
}: { icon: string; label: string; onPress?: () => void; isDark: boolean }) {
  const C = getColors(isDark);
  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: C.lightGray }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <MaterialIcons name={icon as any} size={20} color={C.gray} />
      <Text style={[styles.rowLabel, { color: C.black }]}>{label}</Text>
      {onPress && <MaterialIcons name="chevron-right" size={18} color={C.lightGray} />}
    </TouchableOpacity>
  );
}

// ── Screen ─────────────────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const isDark = useIsDark();
  const pref = useThemePref();
  const C = getColors(isDark);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: C.background }]}>

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: C.black, backgroundColor: C.white }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={20} color={C.black} />
        </TouchableOpacity>
        <Text style={[styles.heading, { color: C.black }]}>Settings</Text>
      </View>

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
          <SettingsRow icon="person-outline" label="Edit Profile" onPress={() => router.push('/profile-edit')} isDark={isDark} />
          <SettingsRow icon="notifications-none" label="Notifications" isDark={isDark} />
          <SettingsRow icon="lock-outline" label="Privacy" isDark={isDark} />
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: C.gray }]}>ABOUT</Text>
        <View style={[styles.card, { backgroundColor: C.white, borderColor: C.black, padding: 0 }]}>
          <SettingsRow icon="info-outline" label="About Borrow" isDark={isDark} />
          <SettingsRow icon="star-outline" label="Rate the App" isDark={isDark} />
        </View>
      </View>

      <Text style={[styles.version, { color: C.lightGray }]}>Version 0.1.0</Text>
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
  },
  settingTitle: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold },
  settingDesc: { fontSize: 12, fontFamily: Font.regular, marginTop: -4 },

  row: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1,
  },
  rowLabel: { flex: 1, fontSize: 14, fontFamily: Font.bold, fontWeight: '600' },

  version: { textAlign: 'center', fontSize: 11, fontFamily: Font.regular, marginTop: 32 },
});
