import { ScrollView, View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Colors, Shadow, Radius, Font, getColors } from '../../constants/theme';
import { Avatar } from '../../components/Avatar';
import { AnimatedButton } from '../../components/AnimatedButton';
import { useIsDark } from '../../store/theme';

// Hardcoded for now — will derive from library + auth store
const STATS = { books: 6, lending: 2, borrowing: 2 };

const ACTIVITY = [
  { icon: 'call-made',     text: 'Lent Piranesi to Jaydon Workman',           time: 'Mar 10', color: Colors.teal,   threadId: '1' },
  { icon: 'call-received', text: 'Borrowed Normal People from Jaydon Workman', time: 'Mar 1',  color: Colors.purple, threadId: '1' },
  { icon: 'check-circle',  text: 'Received Kindred back from Priya Okonkwo',   time: 'Feb 20', color: Colors.teal,   threadId: '2' },
  { icon: 'warning',       text: 'The Remains of the Day is overdue',           time: 'Mar 1',  color: '#C0392B',     threadId: '2' },
] as const;

// Friends = neighbors with whom at least one exchange has been completed
const FRIENDS = [
  { id: 'jaydon', name: 'Jaydon Workman', exchanges: 3 },
  { id: 'priya',  name: 'Priya Okonkwo',  exchanges: 1 },
  { id: 'marcus', name: 'Marcus Lee',     exchanges: 1 },
];

// Genre preferences (placeholder — will come from profile store)
const MY_GENRES = ['Literary Fiction', 'Sci-Fi', 'Fantasy'];

function makeStyles(C: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: C.background },
    content:  { padding: 16, paddingBottom: 48 },

    header: {
      flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: 16,
    },
    heading: { fontSize: 24, fontWeight: '800', fontFamily: Font.extraBold, color: C.black },
    settingsButton: {
      borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card, padding: 8, backgroundColor: C.white,
    },

    profileCard: {
      flexDirection: 'row', alignItems: 'flex-start',
      borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card, backgroundColor: C.white,
      padding: 14, marginBottom: 24, gap: 12,
    },
    profileInfo: { flex: 1, gap: 6 },
    name:     { fontSize: 15, fontWeight: '800', fontFamily: Font.extraBold, color: C.black },
    location: { fontSize: 12, fontFamily: Font.regular, color: C.gray },

    statsRow: {
      flexDirection: 'row', alignItems: 'center', marginTop: 4,
      borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card, backgroundColor: C.background,
      ...Shadow,
    },
    stat:        { flex: 1, alignItems: 'center', paddingVertical: 6 },
    statValue:   { fontSize: 16, fontWeight: '800', fontFamily: Font.extraBold, color: C.black },
    statLabel:   { fontSize: 10, fontFamily: Font.regular, color: C.gray, marginTop: 1 },
    statDivider: { width: 1, alignSelf: 'stretch', marginVertical: 6, backgroundColor: C.lightGray },

    editButton: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.pill, paddingHorizontal: 12, paddingVertical: 6,
      backgroundColor: C.white, alignSelf: 'flex-start',
    },
    editButtonText: { fontSize: 12, fontWeight: '700', fontFamily: Font.bold, color: C.black },

    sectionTitle: {
      fontSize: 12, fontWeight: '800', fontFamily: Font.extraBold,
      color: C.gray, textTransform: 'uppercase', letterSpacing: 0.8,
      marginBottom: 10,
    },

    // Genres
    genreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 24 },
    genreTag: {
      borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.pill, backgroundColor: C.white,
      paddingHorizontal: 10, paddingVertical: 5,
    },
    genreTagText: { fontSize: 12, fontFamily: Font.regular, color: C.black },

    // Friends
    friendsWrap: { marginBottom: 24 },
    friendsRow:  { flexDirection: 'row', gap: 10, paddingRight: 16 },
    friendChip:  {
      alignItems: 'center', gap: 5,
      borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card, backgroundColor: C.white,
      paddingHorizontal: 14, paddingVertical: 10,
    },
    friendName:   { fontSize: 11, fontFamily: Font.bold, fontWeight: '600', color: C.black, textAlign: 'center' },
    friendXCount: { fontSize: 10, fontFamily: Font.regular, color: C.gray },

    // Recent activity
    activityList: { gap: 8 },
    activityRow: {
      flexDirection: 'row', alignItems: 'center', gap: 12,
      borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card, backgroundColor: C.white,
      padding: 12,
    },
    activityIcon:  { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    activityInfo:  { flex: 1, gap: 2 },
    activityText:  { fontSize: 13, fontFamily: Font.bold, fontWeight: '600', color: C.black },
    activityTime:  { fontSize: 11, fontFamily: Font.regular, color: C.gray },
  });
}

export default function ProfileScreen() {
  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <Text style={styles.heading}>Profile</Text>
          <AnimatedButton style={[styles.settingsButton, Shadow]} onPress={() => router.push('/settings')}>
            <MaterialIcons name="settings" size={20} color={C.black} />
          </AnimatedButton>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <Avatar name="Avery Whitted" size={52} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Avery Whitted</Text>
            <Text style={styles.location}>
              <MaterialIcons name="place" size={11} color={C.gray} /> Brooklyn, NY
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{STATS.books}</Text>
                <Text style={styles.statLabel}>Books</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: C.teal }]}>{STATS.lending}</Text>
                <Text style={styles.statLabel}>Lending</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={[styles.statValue, { color: C.purple }]}>{STATS.borrowing}</Text>
                <Text style={styles.statLabel}>Borrowing</Text>
              </View>
            </View>
          </View>
          <AnimatedButton style={[styles.editButton, Shadow]} onPress={() => router.push('/profile-edit')}>
            <MaterialIcons name="edit" size={15} color={C.black} />
            <Text style={styles.editButtonText}>Edit</Text>
          </AnimatedButton>
        </View>

        {/* Genre preferences */}
        <Text style={styles.sectionTitle}>Genres</Text>
        <View style={styles.genreRow}>
          {MY_GENRES.map(g => (
            <View key={g} style={styles.genreTag}>
              <Text style={styles.genreTagText}>{g}</Text>
            </View>
          ))}
        </View>

        {/* Friends */}
        <Text style={styles.sectionTitle}>Friends</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.friendsWrap}
        >
          <View style={styles.friendsRow}>
            {FRIENDS.map(f => (
              <TouchableOpacity
                key={f.id}
                style={[styles.friendChip, Shadow]}
                onPress={() => router.push(`/user/${f.id}`)}
              >
                <Avatar name={f.name} size={36} />
                <Text style={styles.friendName}>{f.name.split(' ')[0]}</Text>
                <Text style={styles.friendXCount}>
                  {f.exchanges} exchange{f.exchanges !== 1 ? 's' : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Recent Activity */}
        <Text style={[styles.sectionTitle, { marginTop: 4 }]}>Recent Activity</Text>
        <View style={styles.activityList}>
          {ACTIVITY.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.activityRow, Shadow]}
              onPress={() => router.push(`/thread/${item.threadId}`)}
            >
              <View style={[styles.activityIcon, { backgroundColor: item.color }]}>
                <MaterialIcons name={item.icon as any} size={14} color="#fff" />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityText}>{item.text}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={18} color={C.lightGray} />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
