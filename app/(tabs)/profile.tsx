import { ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Shadow, Radius, Font } from '../../constants/theme';
import { Avatar } from '../../components/Avatar';
import { AnimatedButton } from '../../components/AnimatedButton';

// Hardcoded for now — will derive from library store
const STATS = { books: 6, lending: 2, borrowing: 2 };

const ACTIVITY = [
  { icon: 'call-made', text: 'Lent Piranesi to Jaydon Workman', time: 'Mar 10', color: Colors.teal, threadId: '1' },
  { icon: 'call-received', text: 'Borrowed Normal People from Jaydon Workman', time: 'Mar 1', color: Colors.purple, threadId: '1' },
  { icon: 'check-circle', text: 'Received Kindred back from Priya Okonkwo', time: 'Feb 20', color: Colors.teal, threadId: '2' },
  { icon: 'warning', text: 'The Remains of the Day is overdue', time: 'Mar 1', color: '#C0392B', threadId: '2' },
] as const;

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <Text style={styles.heading}>Profile</Text>
          <AnimatedButton style={[styles.settingsButton, Shadow]} onPress={() => router.push('/settings')}>
            <MaterialIcons name="settings" size={20} color={Colors.black} />
          </AnimatedButton>
        </View>

        {/* Profile card with inline stats */}
        <View style={styles.profileCard}>
          <Avatar name="Avery Whitted" size={52} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Avery Whitted</Text>
            <Text style={styles.location}>
              <MaterialIcons name="place" size={11} color={Colors.gray} /> Brooklyn, NY
            </Text>
            {/* Inline stats */}
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{STATS.books}</Text>
                <Text style={styles.statLabel}>Books</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: Colors.teal }]}>{STATS.lending}</Text>
                <Text style={styles.statLabel}>Lending</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: Colors.purple }]}>{STATS.borrowing}</Text>
                <Text style={styles.statLabel}>Borrowing</Text>
              </View>
            </View>
          </View>
          <AnimatedButton style={[styles.editButton, Shadow]} onPress={() => router.push('/profile-edit')}>
            <MaterialIcons name="edit" size={15} color={Colors.black} />
            <Text style={styles.editButtonText}>Edit</Text>
          </AnimatedButton>
        </View>

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {ACTIVITY.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.activityRow, Shadow]}
              onPress={() => router.push(`/thread/${item.threadId}`)}
            >
              <View style={[styles.activityIcon, { backgroundColor: item.color }]}>
                <MaterialIcons name={item.icon as any} size={14} color={Colors.white} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityText}>{item.text}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={18} color={Colors.lightGray} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Account settings */}
        <Text style={styles.sectionTitle}>Account</Text>
        {(['Notifications', 'Privacy', 'Help & Feedback', 'Log Out'] as const).map((item) => (
          <AnimatedButton key={item} style={[styles.settingsRow, Shadow]}>
            <Text style={[styles.settingsRowText, item === 'Log Out' && { color: '#C0392B' }]}>
              {item}
            </Text>
            {item !== 'Log Out' && <MaterialIcons name="chevron-right" size={20} color={Colors.gray} />}
          </AnimatedButton>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingRight: 20, paddingBottom: 40 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  heading: { fontSize: 24, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black },
  settingsButton: {
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, padding: 8, backgroundColor: Colors.white,
  },

  profileCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    padding: 14, marginBottom: 24, gap: 12,
  },
  profileInfo: { flex: 1, gap: 6 },
  name: { fontSize: 15, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black },
  location: { fontSize: 12, fontFamily: Font.regular, color: Colors.gray },

  // Inline stats row
  statsRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 4,
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.background,
    ...Shadow,
  },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  statValue: { fontSize: 16, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black },
  statLabel: { fontSize: 10, fontFamily: Font.regular, color: Colors.gray, marginTop: 1 },
  statDivider: { width: 1, alignSelf: 'stretch', marginVertical: 6, backgroundColor: Colors.lightGray },

  editButton: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.pill, paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: Colors.white, alignSelf: 'flex-start',
  },
  editButtonText: { fontSize: 12, fontWeight: '700', fontFamily: Font.bold, color: Colors.black },

  sectionTitle: {
    fontSize: 13, fontWeight: '800', fontFamily: Font.extraBold,
    color: Colors.gray, textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: 10,
  },
  activityList: { gap: 8, marginBottom: 24 },
  activityRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    padding: 12,
  },
  activityIcon: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  activityInfo: { flex: 1, gap: 2 },
  activityText: { fontSize: 13, fontFamily: Font.bold, fontWeight: '600', color: Colors.black },
  activityTime: { fontSize: 11, fontFamily: Font.regular, color: Colors.gray },
  settingsRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    paddingLeft: 14, paddingRight: 20, paddingVertical: 14, marginBottom: 10,
  },
  settingsRowText: { fontSize: 14, fontWeight: '600', fontFamily: Font.bold, color: Colors.black },
});
