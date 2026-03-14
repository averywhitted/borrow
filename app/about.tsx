import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Linking,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Radius, Font, getColors, getShadow } from '../constants/theme';
import { useIsDark } from '../store/theme';

const APP_VERSION = '0.1.0';
const BUILD = '1';

const LINKS = [
  { label: 'Privacy Policy', icon: 'lock-outline', route: '/privacy' as const },
  { label: 'Terms of Service', icon: 'description', route: null, url: 'https://borrow.app/terms' },
  { label: 'Contact / Support', icon: 'mail-outline', route: null, url: 'mailto:support@borrow.app' },
  { label: 'Report a Bug', icon: 'bug-report', route: '/report?type=bug' as const },
];

export default function AboutScreen() {
  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

  const handleLink = (item: typeof LINKS[number]) => {
    if (item.route) {
      router.push(item.route as any);
    } else if (item.url) {
      Linking.openURL(item.url);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: C.background }]}>

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: C.black, backgroundColor: C.white }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={20} color={C.black} />
        </TouchableOpacity>
        <Text style={[styles.heading, { color: C.black }]}>About Borrow</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: C.white, borderColor: C.black }, getShadow(isDark)]}>
          <View style={[styles.appIcon, { backgroundColor: C.teal, borderColor: C.black }]}>
            <MaterialIcons name="menu-book" size={32} color={C.white} />
          </View>
          <Text style={[styles.appName, { color: C.black }]}>Borrow</Text>
          <Text style={[styles.appTagline, { color: C.gray }]}>
            Share books with your neighbors.
          </Text>
          <View style={[styles.versionBadge, { backgroundColor: C.background, borderColor: C.lightGray }]}>
            <Text style={[styles.versionText, { color: C.gray }]}>
              Version {APP_VERSION} (build {BUILD})
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={[styles.card, { backgroundColor: C.white, borderColor: C.black }]}>
          <Text style={[styles.descText, { color: C.black }]}>
            Borrow is a hyper-local book lending app. Find books your neighbors have available, request to borrow them, and return them when you're done. No library card needed — just neighbors helping neighbors.
          </Text>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.gray }]}>MORE</Text>
          <View style={[styles.card, { backgroundColor: C.white, borderColor: C.black, padding: 0 }]}>
            {LINKS.map((item, i) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.linkRow,
                  { borderBottomColor: C.lightGray, borderBottomWidth: i < LINKS.length - 1 ? 1 : 0 },
                ]}
                onPress={() => handleLink(item)}
                activeOpacity={0.7}
              >
                <MaterialIcons name={item.icon as any} size={20} color={C.gray} />
                <Text style={[styles.linkLabel, { color: C.black }]}>{item.label}</Text>
                <MaterialIcons name="chevron-right" size={18} color={C.lightGray} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <Text style={[styles.footerNote, { color: C.lightGray }]}>
          Made with ♥ in New York{'\n'}© 2026 Borrow Inc.
        </Text>

        <View style={{ height: 32 }} />
      </ScrollView>
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
    content: { padding: 16, gap: 16 },

    hero: {
      alignItems: 'center', borderWidth: 1, borderRadius: Radius.card,
      padding: 28, gap: 8,
    },
    appIcon: {
      width: 64, height: 64, borderRadius: 16, borderWidth: 1,
      alignItems: 'center', justifyContent: 'center',
      marginBottom: 4,
    },
    appName: { fontSize: 22, fontWeight: '800', fontFamily: Font.extraBold },
    appTagline: { fontSize: 14, fontFamily: Font.regular },
    versionBadge: {
      borderWidth: 1, borderRadius: Radius.pill,
      paddingHorizontal: 12, paddingVertical: 4, marginTop: 4,
    },
    versionText: { fontSize: 11, fontFamily: Font.regular },

    card: { borderWidth: 1, borderRadius: Radius.card, padding: 16 },
    descText: { fontSize: 14, fontFamily: Font.regular, lineHeight: 22 },

    section: { gap: 10 },
    sectionLabel: {
      fontSize: 11, fontWeight: '800', fontFamily: Font.extraBold, letterSpacing: 0.8,
    },
    linkRow: {
      flexDirection: 'row', alignItems: 'center', gap: 14,
      paddingHorizontal: 16, paddingVertical: 14,
    },
    linkLabel: { flex: 1, fontSize: 14, fontFamily: Font.bold, fontWeight: '600' },

    footerNote: {
      textAlign: 'center', fontSize: 12, fontFamily: Font.regular, lineHeight: 20,
    },
  });
}
