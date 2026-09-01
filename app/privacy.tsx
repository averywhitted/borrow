import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Radius, Font, getColors } from '../constants/theme';
import { useIsDark } from '../store/theme';

const LAST_UPDATED = 'March 2026';

const SECTIONS = [
  {
    title: 'What we collect',
    icon: 'inbox',
    body: `When you use Borrow we collect the information you provide directly — your name, location, and the books you list. We also collect usage data to improve the app (screen views, tap events) and device information needed to deliver push notifications.

We do not collect precise GPS location — only the neighborhood or city you provide manually.`,
  },
  {
    title: 'How we use it',
    icon: 'settings',
    body: `Your information is used solely to power the Borrow experience: matching you with nearby books, enabling messaging between lenders and borrowers, and delivering notifications about your transactions.

We do not sell your personal information to third parties. We do not use your data for targeted advertising.`,
  },
  {
    title: 'Who we share with',
    icon: 'people',
    body: `Other Borrow users can see your display name, profile photo, neighborhood, bio, and the books you've listed as available. Your email address and full address are never visible to other users.

We use trusted third-party services to operate the app (cloud hosting, analytics). These providers are contractually prohibited from using your data for any other purpose.`,
  },
  {
    title: 'Your rights',
    icon: 'verified-user',
    body: `You can update or delete your profile information at any time from Edit Profile. You can request a full export or deletion of your account data by contacting us at privacy@borrow.app.

If you are in the EU or California, you have additional rights under GDPR and CCPA respectively. These include the right to access, correct, port, or erase your personal data.`,
  },
  {
    title: 'Data retention',
    icon: 'history',
    body: `We retain your data for as long as your account is active. After account deletion, we remove personal data within 30 days, except where we are required to retain it for legal or safety purposes (e.g. reports of abuse).`,
  },
  {
    title: 'Contact us',
    icon: 'mail',
    body: `Questions about this policy or your data?\n\nprivacy@borrow.app\n\nBorrow Inc.\nNew York, NY`,
  },
];

export default function PrivacyScreen() {
  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: C.background }]}>

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: C.black, backgroundColor: C.white }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={20} color={C.black} />
        </TouchableOpacity>
        <Text style={[styles.heading, { color: C.black }]}>Privacy Policy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        <View style={[styles.draftBanner, { backgroundColor: isDark ? '#1a1a2e' : '#EEF2FF', borderColor: '#6366F1' }]}>
          <MaterialIcons name="edit-note" size={16} color="#6366F1" />
          <Text style={[styles.draftText, { color: isDark ? '#A5B4FC' : '#3730A3' }]}>
            This is a draft policy. It will be reviewed by legal counsel before public launch.
          </Text>
        </View>

        <Text style={[styles.lastUpdated, { color: C.gray }]}>Last updated: {LAST_UPDATED}</Text>
        <Text style={[styles.intro, { color: C.black }]}>
          Borrow is built on trust between neighbors. This policy explains what we collect, why, and how you stay in control.
        </Text>

        {SECTIONS.map((s, i) => (
          <View key={s.title} style={[styles.section, { borderColor: C.black, backgroundColor: C.white }]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name={s.icon as any} size={16} color={C.teal} />
              <Text style={[styles.sectionTitle, { color: C.black }]}>{s.title}</Text>
            </View>
            <Text style={[styles.sectionBody, { color: C.black }]}>{s.body}</Text>
          </View>
        ))}

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

    draftBanner: {
      flexDirection: 'row', alignItems: 'flex-start', gap: 10,
      padding: 12, borderWidth: 1, borderRadius: Radius.card,
    },
    draftText: { flex: 1, fontSize: 12, fontFamily: Font.regular, lineHeight: 18 },

    lastUpdated: { fontSize: 12, fontFamily: Font.regular },
    intro: { fontSize: 14, fontFamily: Font.regular, lineHeight: 22 },

    section: {
      borderWidth: 1, borderRadius: Radius.card, padding: 16, gap: 10,
    },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    sectionTitle: { fontSize: 14, fontWeight: '800', fontFamily: Font.extraBold },
    sectionBody: { fontSize: 13, fontFamily: Font.regular, lineHeight: 21 },
  });
}
