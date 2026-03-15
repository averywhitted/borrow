import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useMemo } from 'react';
import { Colors, Shadow, Radius, Font, getColors, getShadow } from '../../constants/theme';
import { Avatar } from '../../components/Avatar';
import { BookCover } from '../../components/BookCover';
import { AnimatedButton } from '../../components/AnimatedButton';
import { getOrCreateThread } from '../../store/threads';
import { useIsDark } from '../../store/theme';

// Placeholder user data — will come from API
type UserBook = { id: string; title: string; author: string; available: boolean };
type UserData = {
  id: string; name: string; pronouns?: string; location: string; bio: string;
  stats: { books: number; lends: number; borrows: number; rating: number };
  books: UserBook[];
};

const USERS: Record<string, UserData> = {
  'jaydon': {
    id: 'jaydon', name: 'Jaydon Workman', pronouns: 'he/him', location: 'Brooklyn, NY', bio: 'Big sci-fi and literary fiction reader. I lend happily — just return on time 😄',
    stats: { books: 24, lends: 14, borrows: 8, rating: 4.8 },
    books: [
      { id: 'u1', title: 'The Song of Achilles', author: 'Madeline Miller', available: true },
      { id: 'u2', title: 'Klara and the Sun', author: 'Kazuo Ishiguro', available: true },
      { id: 'u3', title: 'Never Let Me Go', author: 'Kazuo Ishiguro', available: false },
      { id: 'u4', title: 'Recursion', author: 'Blake Crouch', available: true },
      { id: 'u5', title: 'Project Hail Mary', author: 'Andy Weir', available: true },
    ],
  },
  'priya': {
    id: 'priya', name: 'Priya Okonkwo', pronouns: 'she/her', location: 'Brooklyn, NY', bio: "I read mostly fiction and love discovering new authors. Currently working through Octavia Butler's back catalogue.",
    stats: { books: 18, lends: 11, borrows: 7, rating: 5.0 },
    books: [
      { id: 'u6', title: 'Parable of the Sower', author: 'Octavia Butler', available: true },
      { id: 'u7', title: 'Beloved', author: 'Toni Morrison', available: true },
      { id: 'u8', title: 'Their Eyes Were Watching God', author: 'Zora Neale Hurston', available: false },
    ],
  },
  'marcus': {
    id: 'marcus', name: 'Marcus Lee', location: 'Brooklyn, NY', bio: 'I love a good thriller and anything Stephen King. Also big on audiobooks.',
    stats: { books: 12, lends: 5, borrows: 3, rating: 4.6 },
    books: [
      { id: 'u9', title: 'It', author: 'Stephen King', available: true },
      { id: 'u10', title: 'The Shining', author: 'Stephen King', available: true },
    ],
  },
};

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <MaterialIcons
          key={i}
          name={i <= full ? 'star' : (i === full + 1 && half) ? 'star-half' : 'star-outline'}
          size={13}
          color="#F5A623"
        />
      ))}
    </View>
  );
}

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = USERS[id] ?? USERS['jaydon'];

  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

  const handleMessage = () => {
    const thread = getOrCreateThread(user.id, user.name);
    router.push(`/thread/${thread.id}`);
  };

  const availableBooks = user.books.filter(b => b.available);
  const onLoanBooks = user.books.filter(b => !b.available);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Back + report */}
        <View style={styles.navRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color={C.black} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.reportBtn}
            onPress={() => router.push(`/report?type=user&targetName=${encodeURIComponent(user.name)}&targetId=${user.id}`)}
          >
            <MaterialIcons name="flag" size={18} color={C.gray} />
          </TouchableOpacity>
        </View>

        {/* Profile card */}
        <View style={[styles.profileCard, getShadow(isDark)]}>
          <View style={styles.profileTop}>
            <Avatar name={user.name} size={56} />
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{user.name}</Text>
                {user.pronouns ? (
                  <Text style={styles.pronouns}>{user.pronouns}</Text>
                ) : null}
              </View>
              <View style={styles.locationRow}>
                <MaterialIcons name="place" size={12} color={C.gray} />
                <Text style={styles.location}>{user.location}</Text>
              </View>
              <View style={styles.ratingRow}>
                <StarRating rating={user.stats.rating} />
                <Text style={styles.ratingText}>{user.stats.rating.toFixed(1)}</Text>
              </View>
            </View>
            <AnimatedButton style={[styles.msgBtn, getShadow(isDark)]} onPress={handleMessage}>
              <MaterialIcons name="chat-bubble-outline" size={16} color={C.white} />
              <Text style={styles.msgBtnText}>Message</Text>
            </AnimatedButton>
          </View>

          {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{user.stats.books}</Text>
              <Text style={styles.statLabel}>Books</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: C.teal }]}>{user.stats.lends}</Text>
              <Text style={styles.statLabel}>Lends</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: C.purple }]}>{user.stats.borrows}</Text>
              <Text style={styles.statLabel}>Borrows</Text>
            </View>
          </View>
        </View>

        {/* Available books */}
        <Text style={styles.sectionTitle}>Available to Borrow ({availableBooks.length})</Text>
        {availableBooks.map(book => (
          <View key={book.id} style={[styles.bookRow, getShadow(isDark)]}>
            <BookCover title={book.title} author={book.author} width={44} height={60} borderRadius={6} />
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookAuthor}>{book.author}</Text>
            </View>
            <AnimatedButton
              style={[styles.requestBtn, getShadow(isDark)]}
              onPress={() => router.push(
                `/borrow-request/${user.id}?bookTitle=${encodeURIComponent(book.title)}&bookAuthor=${encodeURIComponent(book.author)}`
              )}
            >
              <Text style={styles.requestBtnText}>Request</Text>
            </AnimatedButton>
          </View>
        ))}

        {/* On loan books */}
        {onLoanBooks.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Currently On Loan ({onLoanBooks.length})</Text>
            {onLoanBooks.map(book => (
              <View key={book.id} style={[styles.bookRow, getShadow(isDark)]}>
                <BookCover title={book.title} author={book.author} width={44} height={60} borderRadius={6} />
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookAuthor}>{book.author}</Text>
                </View>
                <View style={styles.onLoanPill}>
                  <Text style={styles.onLoanText}>On Loan</Text>
                </View>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof getColors>) { return StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.background },
  content: { padding: 16, paddingBottom: 32 },

  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { fontSize: 14, fontWeight: '600', fontFamily: Font.bold, color: C.black },
  reportBtn: { padding: 6 },

  profileCard: {
    borderWidth: 1, borderColor: C.black,
    borderRadius: Radius.card, backgroundColor: C.white,
    padding: 14, marginBottom: 24, gap: 12,
  },
  profileTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  profileInfo: { flex: 1, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' },
  name: { fontSize: 16, fontWeight: '800', fontFamily: Font.extraBold, color: C.black },
  pronouns: { fontSize: 11, fontFamily: Font.regular, color: C.gray },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  location: { fontSize: 12, fontFamily: Font.regular, color: C.gray },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  ratingText: { fontSize: 12, fontFamily: Font.bold, fontWeight: '700', color: C.gray },

  msgBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: C.teal, borderWidth: 1, borderColor: C.black,
    borderRadius: Radius.card, paddingHorizontal: 12, paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  msgBtnText: { fontSize: 12, fontWeight: '700', fontFamily: Font.bold, color: C.white },

  bio: { fontSize: 13, fontFamily: Font.regular, color: C.gray, lineHeight: 19 },

  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: C.black,
    borderRadius: Radius.card, backgroundColor: C.background,
    ...C.shadow,
  },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  statValue: { fontSize: 16, fontWeight: '800', fontFamily: Font.extraBold, color: C.black },
  statLabel: { fontSize: 10, fontFamily: Font.regular, color: C.gray, marginTop: 1 },
  statDivider: { width: 1, alignSelf: 'stretch', marginVertical: 6, backgroundColor: C.lightGray },

  sectionTitle: {
    fontSize: 13, fontWeight: '800', fontFamily: Font.extraBold,
    color: C.gray, textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: 10,
  },
  bookRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: C.black,
    borderRadius: Radius.card, backgroundColor: C.white,
    padding: 12, marginBottom: 10,
  },
  bookInfo: { flex: 1, gap: 3 },
  bookTitle: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold, color: C.black },
  bookAuthor: { fontSize: 12, fontFamily: Font.regular, color: C.gray },
  requestBtn: {
    backgroundColor: C.purple, borderWidth: 1, borderColor: C.black,
    borderRadius: Radius.card, paddingHorizontal: 14, paddingVertical: 8,
  },
  requestBtnText: { fontSize: 12, fontWeight: '700', fontFamily: Font.bold, color: C.white },
  onLoanPill: {
    borderWidth: 1, borderColor: C.lightGray,
    borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 6,
  },
  onLoanText: { fontSize: 12, fontFamily: Font.regular, color: C.gray },
}); }
