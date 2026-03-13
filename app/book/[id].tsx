import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors, Shadow, Radius, Font } from '../../constants/theme';
import { BookCover } from '../../components/BookCover';
import { Avatar } from '../../components/Avatar';
import { useIsWishlisted, toggleWishlist } from '../../store/wishlist';

const LENDERS = [
  { id: '1', name: 'Jaydon Workman', books: 12, borrows: 8, lends: 14, distance: '0.3 mi', available: true },
  { id: '2', name: 'Mira Siphron', books: 24, borrows: 19, lends: 22, distance: '0.6 mi', available: true },
  { id: '3', name: 'Carlos Reyes', books: 7, borrows: 3, lends: 5, distance: '1.1 mi', available: false },
];

const BOOKS: Record<string, { title: string; author: string; genre: string; description: string }> = {
  '1': { title: 'Life of Pi', author: 'Yann Martel', genre: 'Literary Fiction', description: 'A young man survives a disaster at sea and is hurtled into an epic journey of adventure and discovery.' },
  '2': { title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', description: "Set on the desert planet Arrakis, Dune is the story of Paul Atreides and of a great family's ambition to rule the most important and dangerous planet in the universe." },
  '3': { title: 'Macbeth', author: 'William Shakespeare', genre: 'Drama', description: 'A Scottish general receives a prophecy from witches that he will become King of Scotland.' },
  '4': { title: 'Lord of the Flies', author: 'William Golding', genre: 'Literary Fiction', description: 'A group of boys stranded on an uninhabited island attempt to govern themselves with disastrous results.' },
};

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const book = BOOKS[id] ?? BOOKS['2'];
  const saved = useIsWishlisted(id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={20} color={Colors.black} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.bookHeader}>
          <BookCover title={book.title} author={book.author} width={110} height={150} borderRadius={Radius.card} />
          <View style={styles.bookMeta}>
            <View style={styles.genrePill}>
              <Text style={styles.genreText}>{book.genre}</Text>
            </View>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookAuthor}>{book.author}</Text>
          </View>
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{book.description}</Text>
        </View>

        <Text style={styles.lendersSectionTitle}>{LENDERS.length} neighbors have this book</Text>

        {LENDERS.map((lender) => (
          <View key={lender.id} style={styles.lenderCard}>
            <Avatar name={lender.name} size={44} />
            <View style={styles.lenderInfo}>
              <Text style={styles.lenderName}>{lender.name}</Text>
              <View style={styles.lenderMeta}>
                <MaterialIcons name="place" size={11} color={Colors.gray} />
                <Text style={styles.lenderDistance}>{lender.distance} away</Text>
              </View>
              <View style={styles.lenderStats}>
                <Text style={styles.lenderStat}>{lender.books} books</Text>
                <Text style={styles.lenderStatDot}>·</Text>
                <Text style={styles.lenderStat}>{lender.borrows} borrows</Text>
                <Text style={styles.lenderStatDot}>·</Text>
                <Text style={styles.lenderStat}>{lender.lends} lends</Text>
              </View>
            </View>
            {lender.available ? (
              <TouchableOpacity
                style={[styles.requestButton, Shadow]}
                onPress={() => router.push(
                  `/borrow-request/${lender.id}?bookTitle=${encodeURIComponent(book.title)}&bookAuthor=${encodeURIComponent(book.author)}`
                )}
              >
                <Text style={styles.requestButtonText}>Request</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.unavailablePill}>
                <Text style={styles.unavailableText}>On Loan</Text>
              </View>
            )}
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom bar: bookmark (secondary) + request CTA (primary) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.bookmarkButton, saved && styles.bookmarkButtonSaved, Shadow]}
          onPress={() => toggleWishlist({ id, title: book.title, author: book.author })}
        >
          <MaterialIcons name={saved ? 'bookmark' : 'bookmark-outline'} size={22} color={saved ? Colors.white : Colors.black} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.borrowButton, Shadow]}>
          <Text style={styles.borrowButtonText}>Request to Borrow</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  backText: { fontSize: 14, fontWeight: '600', fontFamily: Font.bold, color: Colors.black },
  bookHeader: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  bookMeta: { flex: 1, justifyContent: 'center', gap: 8 },
  genrePill: {
    alignSelf: 'flex-start', borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 3,
    backgroundColor: Colors.white,
  },
  genreText: { fontSize: 11, fontWeight: '700', fontFamily: Font.bold, color: Colors.black },
  bookTitle: { fontSize: 22, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black },
  bookAuthor: { fontSize: 14, fontFamily: Font.regular, color: Colors.gray },
  descriptionCard: {
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    padding: 14, marginBottom: 20, gap: 8,
  },
  sectionTitle: {
    fontSize: 13, fontWeight: '800', fontFamily: Font.extraBold,
    color: Colors.gray, textTransform: 'uppercase', letterSpacing: 0.8,
  },
  description: { fontSize: 14, fontFamily: Font.regular, color: Colors.black, lineHeight: 21 },
  lendersSectionTitle: {
    fontSize: 16, fontWeight: '800', fontFamily: Font.extraBold,
    color: Colors.black, marginBottom: 12,
  },
  lenderCard: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    padding: 12, marginBottom: 10, gap: 12,
  },
  lenderInfo: { flex: 1, gap: 3 },
  lenderName: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold, color: Colors.black },
  lenderMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  lenderDistance: { fontSize: 12, fontFamily: Font.regular, color: Colors.gray },
  lenderStats: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  lenderStat: { fontSize: 11, fontFamily: Font.regular, color: Colors.gray },
  lenderStatDot: { fontSize: 11, color: Colors.lightGray },
  requestButton: {
    backgroundColor: Colors.purple, borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, paddingHorizontal: 14, paddingVertical: 8,
  },
  requestButtonText: { color: Colors.white, fontWeight: '700', fontFamily: Font.bold, fontSize: 13 },
  unavailablePill: {
    borderWidth: 1, borderColor: Colors.lightGray,
    borderRadius: Radius.pill, paddingHorizontal: 12, paddingVertical: 7,
  },
  unavailableText: { fontSize: 13, fontFamily: Font.regular, color: Colors.gray },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 10,
    padding: 16, backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.black,
  },
  bookmarkButton: {
    width: 50, height: 50,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
  },
  bookmarkButtonSaved: {
    backgroundColor: Colors.teal,
  },
  borrowButton: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: Colors.purple, borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, paddingVertical: 14,
  },
  borrowButtonText: { fontSize: 15, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.white },
});
