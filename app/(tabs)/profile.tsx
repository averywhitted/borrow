import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Shadow, Radius, Font } from '../../constants/theme';
import { BookCover } from '../../components/BookCover';

const STATS = [
  { label: 'Books', value: 6 },
  { label: 'Borrowed', value: 4 },
  { label: 'Lent Out', value: 3 },
];

const RECENT = [
  { id: '1', title: 'Piranesi', author: 'Susanna Clarke', status: 'On Loan' },
  { id: '2', title: 'Dune', author: 'Frank Herbert', status: 'In Library' },
  { id: '3', title: 'Kindred', author: 'Octavia Butler', status: 'In Library' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <Text style={styles.heading}>Profile</Text>
          <TouchableOpacity style={[styles.settingsButton, Shadow]}>
            <MaterialIcons name="settings" size={20} color={Colors.black} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Avery Whitted</Text>
            <Text style={styles.location}>Brooklyn, NY</Text>
          </View>
          <TouchableOpacity style={[styles.editButton, Shadow]}>
            <MaterialIcons name="edit" size={16} color={Colors.black} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          {STATS.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {RECENT.map((book) => (
          <View key={book.id} style={styles.bookRow}>
            <BookCover title={book.title} author={book.author} width={44} height={60} />
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookAuthor}>{book.author}</Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: book.status === 'On Loan' ? Colors.purple : Colors.teal }]}>
              <Text style={styles.statusText}>{book.status}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Account</Text>
        {['Notifications', 'Privacy', 'Help & Feedback', 'Log Out'].map((item) => (
          <TouchableOpacity key={item} style={[styles.settingsRow, Shadow]}>
            <Text style={[styles.settingsRowText, item === 'Log Out' && { color: '#C0392B' }]}>{item}</Text>
            {item !== 'Log Out' && <MaterialIcons name="chevron-right" size={20} color={Colors.gray} />}
          </TouchableOpacity>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: { fontSize: 24, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black },
  settingsButton: {
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    padding: 8,
    backgroundColor: Colors.white,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.white,
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.black,
    backgroundColor: Colors.lightGray,
  },
  profileInfo: { flex: 1, gap: 4 },
  name: { fontSize: 16, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black },
  location: { fontSize: 12, fontFamily: Font.regular, color: Colors.gray },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.white,
  },
  editButtonText: { fontSize: 12, fontWeight: '700', fontFamily: Font.bold, color: Colors.black },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.white,
    padding: 12,
    alignItems: 'center',
  },
  statValue: { fontSize: 22, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black },
  statLabel: { fontSize: 11, fontFamily: Font.bold, color: Colors.gray, fontWeight: '600', marginTop: 2 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    fontFamily: Font.extraBold,
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  bookRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.white,
    padding: 10,
    marginBottom: 10,
    gap: 12,
  },
  bookInfo: { flex: 1 },
  bookTitle: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold, color: Colors.black },
  bookAuthor: { fontSize: 12, fontFamily: Font.regular, color: Colors.gray, marginTop: 2 },
  statusPill: {
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: { fontSize: 11, fontWeight: '700', fontFamily: Font.bold, color: Colors.white },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
  },
  settingsRowText: { fontSize: 14, fontWeight: '600', fontFamily: Font.bold, color: Colors.black },
});
