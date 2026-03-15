import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Radius, Font, getColors } from '../constants/theme';
import { Avatar } from '../components/Avatar';
import { useBlocked, unblockUser } from '../store/blocked';
import { useIsDark } from '../store/theme';

export default function BlockedUsersScreen() {
  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);
  const blocked = useBlocked();

  const handleUnblock = (id: string, name: string) => {
    Alert.alert(
      `Unblock ${name}?`,
      `${name} will be able to see your profile and send you messages again.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Unblock', onPress: () => unblockUser(id) },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={20} color={C.black} />
        </TouchableOpacity>
        <Text style={styles.heading}>Blocked Users</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {blocked.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons name="block" size={36} color={C.lightGray} />
            <Text style={styles.emptyTitle}>No blocked users</Text>
            <Text style={styles.emptySubtitle}>
              Users you block won't be able to see your profile or message you.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionNote}>
              Blocked users can't see your profile or send you messages.
            </Text>
            {blocked.map((user) => (
              <View key={user.id} style={styles.row}>
                <Avatar name={user.name} size={40} />
                <Text style={styles.name}>{user.name}</Text>
                <TouchableOpacity
                  style={styles.unblockBtn}
                  onPress={() => handleUnblock(user.id, user.name)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.unblockText}>Unblock</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: C.background },
    header: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      borderBottomWidth: 1, borderBottomColor: C.black,
      backgroundColor: C.white, paddingHorizontal: 16, paddingVertical: 14,
    },
    backBtn: {
      width: 34, height: 34, borderRadius: Radius.card,
      borderWidth: 1, borderColor: C.black, backgroundColor: C.background,
      alignItems: 'center', justifyContent: 'center',
    },
    heading: { fontSize: 18, fontWeight: '800', fontFamily: Font.extraBold, color: C.black },
    content: { padding: 16, paddingBottom: 40 },
    sectionNote: {
      fontSize: 13, fontFamily: Font.regular, color: C.gray,
      marginBottom: 16, lineHeight: 19,
    },
    row: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card, backgroundColor: C.white,
      padding: 12, marginBottom: 10,
    },
    name: { flex: 1, fontSize: 15, fontWeight: '600', fontFamily: Font.bold, color: C.black },
    unblockBtn: {
      paddingHorizontal: 14, paddingVertical: 7,
      borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.pill, backgroundColor: C.background,
    },
    unblockText: { fontSize: 13, fontWeight: '700', fontFamily: Font.bold, color: C.black },
    empty: { alignItems: 'center', gap: 10, paddingVertical: 60 },
    emptyTitle: { fontSize: 16, fontWeight: '700', fontFamily: Font.bold, color: C.black },
    emptySubtitle: {
      fontSize: 13, fontFamily: Font.regular, color: C.gray,
      textAlign: 'center', lineHeight: 19, maxWidth: 260,
    },
  });
}
