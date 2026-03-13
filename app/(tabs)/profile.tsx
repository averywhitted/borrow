import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors, Shadow, Radius, Font } from '../../constants/theme';
import { BookCover } from '../../components/BookCover';
import { Avatar } from '../../components/Avatar';
import { AnimatedButton } from '../../components/AnimatedButton';
import { useWishlist, removeFromWishlist } from '../../store/wishlist';

// Teal = contributing (lending), Purple = withdrawing (borrowing)
const CHIP_COLORS: Record<string, string> = {
  all:       Colors.black,
  borrowing: Colors.purple,
  lending:   Colors.teal,
};

const CHIP_ACTIVE_BG: Record<string, string> = {
  all:       '#333',
  borrowing: Colors.purple,
  lending:   Colors.teal,
};

const STAT_FILTERS = [
  { key: 'all',       label: 'Books',     value: 6 },
  { key: 'borrowing', label: 'Borrowing', value: 4 },
  { key: 'lending',   label: 'Lending',   value: 3 },
] as const;

type FilterKey = typeof STAT_FILTERS[number]['key'];

const RECENT = [
  { id: '1', title: 'Piranesi', author: 'Susanna Clarke', status: 'Lending', type: 'lending' as const },
  { id: '2', title: 'Dune', author: 'Frank Herbert', status: 'In Library', type: 'all' as const },
  { id: '3', title: 'Kindred', author: 'Octavia Butler', status: 'Borrowing', type: 'borrowing' as const },
  { id: '4', title: 'Normal People', author: 'Sally Rooney', status: 'Lending', type: 'lending' as const },
  { id: '5', title: 'The Secret History', author: 'Donna Tartt', status: 'Borrowing', type: 'borrowing' as const },
];

// Teal = contributing (lending), Purple = withdrawing (borrowing)
const STATUS_COLORS: Record<string, string> = {
  'Lending':    Colors.teal,
  'Borrowing':  Colors.purple,
  'In Library': '#888',
};

export default function ProfileScreen() {
  const wishlist = useWishlist();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filteredRecent = activeFilter === 'all'
    ? RECENT
    : RECENT.filter((b) => b.type === activeFilter);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <Text style={styles.heading}>Profile</Text>
          <AnimatedButton style={[styles.settingsButton, Shadow]}>
            <MaterialIcons name="settings" size={20} color={Colors.black} />
          </AnimatedButton>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <Avatar name="Avery Whitted" size={56} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Avery Whitted</Text>
            <Text style={styles.location}>Brooklyn, NY</Text>
          </View>
          <AnimatedButton style={[styles.editButton, Shadow]}>
            <MaterialIcons name="edit" size={16} color={Colors.black} />
            <Text style={styles.editButtonText}>Edit</Text>
          </AnimatedButton>
        </View>

        {/* Filter chips — tap to filter activity below */}
        <View style={styles.statsRow}>
          {STAT_FILTERS.map((stat) => {
            const active = activeFilter === stat.key;
            const accent = CHIP_COLORS[stat.key];
            const activeBg = CHIP_ACTIVE_BG[stat.key];
            return (
              <AnimatedButton
                key={stat.key}
                style={[styles.statChip, { borderColor: accent, backgroundColor: active ? activeBg : Colors.white }, Shadow]}
                onPress={() => setActiveFilter(stat.key)}
              >
                <Text style={[styles.statValue, { color: active ? Colors.white : accent }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statLabel, { color: active ? Colors.white : accent }]}>
                  {stat.label}
                </Text>
              </AnimatedButton>
            );
          })}
        </View>

        {/* Wishlist section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Wishlist</Text>
          <View style={styles.wishlistBadge}>
            <Text style={styles.wishlistBadgeText}>{wishlist.length}</Text>
          </View>
        </View>

        {wishlist.length === 0 ? (
          <View style={styles.emptyWishlist}>
            <MaterialIcons name="bookmark-outline" size={28} color={Colors.lightGray} />
            <Text style={styles.emptyWishlistText}>Books you bookmark will appear here</Text>
          </View>
        ) : (
          wishlist.map((book) => (
            <View key={book.id} style={styles.wishlistRow}>
              <BookCover title={book.title} author={book.author} width={44} height={60} />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>{book.author}</Text>
                {book.nearbyCount != null && (
                  <View style={styles.nearbyRow}>
                    <MaterialIcons name="place" size={11} color={Colors.gray} />
                    <Text style={styles.nearbyText}>{book.nearbyCount} near you</Text>
                  </View>
                )}
              </View>
              <View style={styles.wishlistActions}>
                <AnimatedButton
                  style={[styles.findButton, Shadow]}
                  onPress={() => router.push(`/book/${book.id}`)}
                >
                  <Text style={styles.findButtonText}>Find</Text>
                </AnimatedButton>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromWishlist(book.id)}
                >
                  <MaterialIcons name="bookmark" size={18} color={Colors.teal} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* Recent activity — filtered by stat chip */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>
            {activeFilter === 'all' ? 'Recent Activity' : activeFilter === 'borrowing' ? 'Borrowing' : 'Lending'}
          </Text>
          <View style={[styles.wishlistBadge, { backgroundColor: Colors.gray }]}>
            <Text style={styles.wishlistBadgeText}>{filteredRecent.length}</Text>
          </View>
        </View>

        {filteredRecent.length === 0 ? (
          <View style={styles.emptyWishlist}>
            <MaterialIcons name="menu-book" size={28} color={Colors.lightGray} />
            <Text style={styles.emptyWishlistText}>Nothing here yet</Text>
          </View>
        ) : (
          filteredRecent.map((book) => (
            <View key={book.id} style={styles.bookRow}>
              <BookCover title={book.title} author={book.author} width={44} height={60} />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>{book.author}</Text>
              </View>
              <View style={[styles.statusPill, { backgroundColor: STATUS_COLORS[book.status] ?? Colors.gray }]}>
                <Text style={styles.statusText}>{book.status}</Text>
              </View>
            </View>
          ))
        )}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Account</Text>
        {['Notifications', 'Privacy', 'Help & Feedback', 'Log Out'].map((item) => (
          <AnimatedButton key={item} style={[styles.settingsRow, Shadow]}>
            <Text style={[styles.settingsRowText, item === 'Log Out' && { color: '#C0392B' }]}>{item}</Text>
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
    alignItems: 'center', marginBottom: 20,
  },
  heading: { fontSize: 24, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black },
  settingsButton: {
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, padding: 8, backgroundColor: Colors.white,
  },

  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    padding: 14, marginBottom: 16, gap: 12,
  },
  profileInfo: { flex: 1, gap: 4 },
  name: { fontSize: 16, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black },
  location: { fontSize: 12, fontFamily: Font.regular, color: Colors.gray },
  editButton: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.pill, paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: Colors.white,
  },
  editButtonText: { fontSize: 12, fontWeight: '700', fontFamily: Font.bold, color: Colors.black },

  // Stat filter chips
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24, paddingBottom: 4 },
  statChip: {
    flex: 1, borderWidth: 1.5,
    borderRadius: Radius.card,
    padding: 12, alignItems: 'center',
  },
  statValue: { fontSize: 22, fontWeight: '800', fontFamily: Font.extraBold },
  statLabel: { fontSize: 11, fontFamily: Font.bold, fontWeight: '600', marginTop: 2 },

  // Section headers
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionTitle: {
    fontSize: 13, fontWeight: '800', fontFamily: Font.extraBold,
    color: Colors.gray, textTransform: 'uppercase', letterSpacing: 0.8,
  },
  wishlistBadge: {
    backgroundColor: Colors.teal, borderRadius: Radius.pill,
    borderWidth: 1, borderColor: Colors.black,
    minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 5,
  },
  wishlistBadgeText: { fontSize: 10, fontWeight: '700', fontFamily: Font.bold, color: Colors.white },

  // Empty state
  emptyWishlist: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: Colors.lightGray,
    borderRadius: Radius.card, padding: 16, marginBottom: 10,
    backgroundColor: Colors.white,
  },
  emptyWishlistText: { fontSize: 13, fontFamily: Font.regular, color: Colors.gray },

  // Wishlist book row
  wishlistRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    padding: 10, marginBottom: 10, gap: 12,
  },
  wishlistActions: { alignItems: 'center', gap: 6 },
  findButton: {
    backgroundColor: Colors.purple, borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, paddingHorizontal: 14, paddingVertical: 7,
  },
  findButtonText: { fontSize: 12, fontWeight: '700', fontFamily: Font.bold, color: Colors.white },
  removeButton: { padding: 4 },

  // Activity book row
  bookRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    padding: 10, marginBottom: 10, gap: 12,
  },
  bookInfo: { flex: 1 },
  bookTitle: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold, color: Colors.black },
  bookAuthor: { fontSize: 12, fontFamily: Font.regular, color: Colors.gray, marginTop: 2 },
  nearbyRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 3 },
  nearbyText: { fontSize: 11, fontFamily: Font.regular, color: Colors.gray },
  statusPill: {
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 4,
  },
  statusText: { fontSize: 11, fontWeight: '700', fontFamily: Font.bold, color: Colors.white },

  // Settings rows
  settingsRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    paddingLeft: 14, paddingRight: 20, paddingVertical: 14, marginBottom: 10,
  },
  settingsRowText: { fontSize: 14, fontWeight: '600', fontFamily: Font.bold, color: Colors.black },
});
