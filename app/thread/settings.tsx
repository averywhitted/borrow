import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Switch, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useMemo } from 'react';
import { Radius, Font, getColors, getShadow } from '../../constants/theme';
import { useIsDark } from '../../store/theme';
import { useThread } from '../../store/threads';
import { AnimatedButton } from '../../components/AnimatedButton';

export default function ThreadSettingsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);
  const thread = useThread(id);

  const [muted, setMuted] = useState(false);

  const neighborName = thread?.neighborName ?? 'this user';

  const handleReport = () => {
    router.push(`/report?type=user&targetName=${encodeURIComponent(neighborName)}&targetId=${thread?.neighborId ?? ''}`);
  };

  const handleBlock = () => {
    Alert.alert(
      `Block ${neighborName}?`,
      "They won't be able to message you or request your books. You can unblock from your privacy settings.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block', style: 'destructive',
          onPress: () => {
            // TODO: wire to backend
            Alert.alert('Blocked', `${neighborName} has been blocked.`);
            router.back();
          },
        },
      ],
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete conversation?',
      'This removes the conversation from your view. The other person can still see it.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: () => {
            // TODO: wire to backend
            router.navigate('/(tabs)/messages');
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
        <Text style={[styles.heading, { color: C.black }]}>Conversation Settings</Text>
      </View>

      <View style={styles.content}>

        {/* Person info */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.gray }]}>CONVERSATION WITH</Text>
          <View style={[styles.card, { backgroundColor: C.white, borderColor: C.black }]}>
            <TouchableOpacity
              style={styles.personRow}
              onPress={() => router.push(`/user/${thread?.neighborId}`)}
            >
              <View style={[styles.avatarPlaceholder, { backgroundColor: C.pillActive }]}>
                <Text style={[styles.avatarInitial, { color: C.white }]}>
                  {neighborName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.personName, { color: C.black }]}>{neighborName}</Text>
                <Text style={[styles.personSub, { color: C.gray }]}>View profile →</Text>
              </View>
              <MaterialIcons name="chevron-right" size={18} color={C.lightGray} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.gray }]}>PREFERENCES</Text>
          <View style={[styles.card, { backgroundColor: C.white, borderColor: C.black, padding: 0 }]}>
            <View style={[styles.toggleRow, { borderBottomColor: C.lightGray }]}>
              <MaterialIcons name="notifications-off" size={20} color={C.gray} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.rowLabel, { color: C.black }]}>Mute notifications</Text>
                <Text style={[styles.rowSub, { color: C.gray }]}>Stop alerts for new messages</Text>
              </View>
              <Switch
                value={muted}
                onValueChange={setMuted}
                trackColor={{ false: C.lightGray, true: C.pillActive }}
                thumbColor={C.white}
              />
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: C.gray }]}>ACTIONS</Text>
          <View style={[styles.card, { backgroundColor: C.white, borderColor: C.black, padding: 0 }]}>
            <ActionRow
              icon="flag"
              label={`Report ${neighborName}`}
              color={C.gray}
              borderColor={C.lightGray}
              onPress={handleReport}
            />
            <ActionRow
              icon="block"
              label={`Block ${neighborName}`}
              color="#E53935"
              borderColor={C.lightGray}
              onPress={handleBlock}
            />
            <ActionRow
              icon="delete-outline"
              label="Delete conversation"
              color="#E53935"
              borderColor="transparent"
              onPress={handleDelete}
              last
            />
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

function ActionRow({
  icon, label, color, borderColor, onPress, last,
}: {
  icon: string; label: string; color: string;
  borderColor: string; onPress: () => void; last?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionRow, { borderBottomColor: borderColor, borderBottomWidth: last ? 0 : 1 }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialIcons name={icon as any} size={20} color={color} />
      <Text style={[styles.actionLabel, { color }]}>{label}</Text>
    </TouchableOpacity>
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
    content: { flex: 1 },

    section: { paddingHorizontal: 16, marginTop: 24 },
    sectionLabel: {
      fontSize: 11, fontWeight: '800', fontFamily: Font.extraBold,
      letterSpacing: 0.8, marginBottom: 10,
    },
    card: { borderWidth: 1, borderRadius: Radius.card, overflow: 'hidden' },

    personRow: {
      flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    },
    avatarPlaceholder: {
      width: 40, height: 40, borderRadius: 20,
      alignItems: 'center', justifyContent: 'center',
    },
    avatarInitial: { fontSize: 16, fontWeight: '700', fontFamily: Font.bold },
    personName: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold },
    personSub: { fontSize: 12, fontFamily: Font.regular, marginTop: 2 },

    toggleRow: {
      flexDirection: 'row', alignItems: 'center', gap: 14,
      paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
    },
    rowLabel: { fontSize: 14, fontWeight: '600', fontFamily: Font.bold },
    rowSub: { fontSize: 12, fontFamily: Font.regular, marginTop: 1 },

    actionRow: {
      flexDirection: 'row', alignItems: 'center', gap: 14,
      paddingHorizontal: 16, paddingVertical: 14,
    },
    actionLabel: { fontSize: 14, fontWeight: '600', fontFamily: Font.bold },
  });
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  actionLabel: { fontSize: 14, fontWeight: '600', fontFamily: Font.bold },
});
