import {
  View, Text, Switch, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useMemo } from 'react';
import { Radius, Font, getColors } from '../constants/theme';
import { useIsDark } from '../store/theme';

// ── Types ─────────────────────────────────────────────────────────────────────
type NotifKey =
  | 'msg_new'
  | 'borrow_accepted' | 'borrow_declined' | 'due_soon' | 'overdue'
  | 'lend_request' | 'lend_returned'
  | 'extend_request';

type NotifState = Record<NotifKey, boolean>;

const DEFAULT_STATE: NotifState = {
  msg_new:         true,
  borrow_accepted: true,
  borrow_declined: true,
  due_soon:        true,
  overdue:         true,
  lend_request:    true,
  lend_returned:   true,
  extend_request:  true,
};

// ── Row component ─────────────────────────────────────────────────────────────
function NotifRow({
  label, sub, value, onToggle, last, C,
}: {
  label: string; sub?: string; value: boolean;
  onToggle: (v: boolean) => void; last?: boolean;
  C: ReturnType<typeof getColors>;
}) {
  return (
    <View style={[
      notifRowStyles.row,
      { borderBottomColor: C.lightGray, borderBottomWidth: last ? 0 : 1 },
    ]}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[notifRowStyles.label, { color: C.black }]}>{label}</Text>
        {sub && <Text style={[notifRowStyles.sub, { color: C.gray }]}>{sub}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: C.lightGray, true: C.teal }}
        thumbColor={C.white}
      />
    </View>
  );
}

const notifRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 13,
  },
  label: { fontSize: 14, fontWeight: '600', fontFamily: Font.bold },
  sub:   { fontSize: 12, fontFamily: Font.regular },
});

// ── Screen ─────────────────────────────────────────────────────────────────────
export default function NotificationsSettingsScreen() {
  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

  const [notifs, setNotifs] = useState<NotifState>(DEFAULT_STATE);

  const toggle = (key: NotifKey) => (val: boolean) =>
    setNotifs(prev => ({ ...prev, [key]: val }));

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: C.background }]}>

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: C.black, backgroundColor: C.white }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={20} color={C.black} />
        </TouchableOpacity>
        <Text style={[styles.heading, { color: C.black }]}>Notifications</Text>
      </View>

      <ScrollView>

        {/* Pending note */}
        <View style={[styles.pendingBanner, { backgroundColor: isDark ? '#2a2200' : '#FFF8E1', borderColor: '#F9A825' }]}>
          <MaterialIcons name="info-outline" size={16} color="#F9A825" />
          <Text style={[styles.pendingText, { color: isDark ? '#FFD54F' : '#5D4037' }]}>
            Push notifications are coming soon. These settings will take effect once notifications are enabled.
          </Text>
        </View>

        {/* Messages */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.gray }]}>MESSAGES</Text>
          <View style={[styles.card, { backgroundColor: C.white, borderColor: C.black }]}>
            <NotifRow
              label="New message"
              sub="When someone sends you a message"
              value={notifs.msg_new}
              onToggle={toggle('msg_new')}
              last C={C}
            />
          </View>
        </View>

        {/* Borrowing */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.gray }]}>BORROWING</Text>
          <View style={[styles.card, { backgroundColor: C.white, borderColor: C.black }]}>
            <NotifRow
              label="Request accepted"
              sub="When a lender accepts your borrow request"
              value={notifs.borrow_accepted}
              onToggle={toggle('borrow_accepted')}
              C={C}
            />
            <NotifRow
              label="Request declined"
              sub="When a lender declines your borrow request"
              value={notifs.borrow_declined}
              onToggle={toggle('borrow_declined')}
              C={C}
            />
            <NotifRow
              label="Due date reminder"
              sub="3 days before a borrowed book is due"
              value={notifs.due_soon}
              onToggle={toggle('due_soon')}
              C={C}
            />
            <NotifRow
              label="Overdue notice"
              sub="When a borrowed book is past its due date"
              value={notifs.overdue}
              onToggle={toggle('overdue')}
              last C={C}
            />
          </View>
        </View>

        {/* Lending */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.gray }]}>LENDING</Text>
          <View style={[styles.card, { backgroundColor: C.white, borderColor: C.black }]}>
            <NotifRow
              label="New borrow request"
              sub="When someone requests one of your books"
              value={notifs.lend_request}
              onToggle={toggle('lend_request')}
              C={C}
            />
            <NotifRow
              label="Book returned"
              sub="When a borrower marks your book as returned"
              value={notifs.lend_returned}
              onToggle={toggle('lend_returned')}
              C={C}
            />
            <NotifRow
              label="Extension request"
              sub="When a borrower asks to extend their lending window"
              value={notifs.extend_request}
              onToggle={toggle('extend_request')}
              last C={C}
            />
          </View>
        </View>

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

    pendingBanner: {
      flexDirection: 'row', alignItems: 'flex-start', gap: 10,
      margin: 16, padding: 12,
      borderWidth: 1, borderRadius: Radius.card,
    },
    pendingText: { flex: 1, fontSize: 12, fontFamily: Font.regular, lineHeight: 18 },

    section: { paddingHorizontal: 16, marginBottom: 8 },
    sectionLabel: {
      fontSize: 11, fontWeight: '800', fontFamily: Font.extraBold,
      letterSpacing: 0.8, marginBottom: 10,
    },
    card: { borderWidth: 1, borderRadius: Radius.card, overflow: 'hidden' },
  });
}
