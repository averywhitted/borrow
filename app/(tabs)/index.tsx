import {
  ScrollView, View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Colors, Shadow, Radius, Font } from '../../constants/theme';
import { BookCover } from '../../components/BookCover';
import { AnimatedButton } from '../../components/AnimatedButton';
import { useIsWishlisted, toggleWishlist } from '../../store/wishlist';

const GENRES = ['Fantasy', 'Sci-Fi', 'Mystery', 'LGBTQ+', 'Horror', 'Romance'];

const BOOKS = [
  { id: '1', title: 'Life of Pi',            author: 'Yann Martel',          nearby: 16, genre: 'Literary Fiction' },
  { id: '2', title: 'Dune',                  author: 'Frank Herbert',         nearby: 26, genre: 'Sci-Fi',    badge: '#1 In Series' },
  { id: '3', title: 'Macbeth',               author: 'William Shakespeare',   nearby: 25, genre: 'Fantasy'  },
  { id: '4', title: 'Lord of the Flies',     author: 'William Golding',       nearby: 12, genre: 'Literary Fiction' },
  { id: '5', title: 'Catcher in the Rye',    author: 'J.D. Salinger',         nearby: 20, genre: 'Literary Fiction' },
  { id: '6', title: 'Fahrenheit 451',        author: 'Ray Bradbury',          nearby: 30, genre: 'Sci-Fi'   },
  { id: '7', title: 'The Stand',             author: 'Stephen King',          nearby: 8,  genre: 'Horror'   },
  { id: '8', title: 'Jane Eyre',             author: 'Charlotte Brontë',      nearby: 9,  genre: 'Romance'  },
];

type Book = typeof BOOKS[number];

// ── Bookmark button ───────────────────────────────────────────────────────────
function BookmarkButton({ book, onPress }: { book: Book; onPress: () => void }) {
  const saved = useIsWishlisted(book.id);
  return (
    <AnimatedButton
      style={[styles.wishlistButton, saved && styles.wishlistButtonSaved, Shadow]}
      onPress={onPress}
    >
      <MaterialIcons name={saved ? 'bookmark' : 'bookmark-outline'} size={18} color={Colors.white} />
      {!saved && <Text style={styles.wishlistPlus}>+</Text>}
    </AnimatedButton>
  );
}

// ── Three-dot options modal ───────────────────────────────────────────────────
function OptionsModal({ book, onClose }: { book: Book; onClose: () => void }) {
  const saved = useIsWishlisted(book.id);

  const options: { icon: string; label: string; onPress: () => void; danger?: boolean }[] = [
    {
      icon: saved ? 'bookmark' : 'bookmark-outline',
      label: saved ? 'Remove from Wishlist' : 'Save to Wishlist',
      onPress: () => {
        toggleWishlist({ id: book.id, title: book.title, author: book.author, nearbyCount: book.nearby });
        onClose();
      },
    },
    {
      icon: 'open-in-new',
      label: 'View Details',
      onPress: () => { onClose(); router.push(`/book/${book.id}`); },
    },
    {
      icon: 'library-add',
      label: 'I have this book',
      onPress: () => { onClose(); router.push('/add-book'); },
    },
    {
      icon: 'share',
      label: 'Share',
      onPress: () => { onClose(); },
    },
    {
      icon: 'block',
      label: 'Not Interested',
      danger: true,
      onPress: () => { onClose(); },
    },
  ];

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <View style={styles.sheetHeader}>
              <BookCover title={book.title} author={book.author} width={36} height={50} borderRadius={6} />
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={styles.sheetTitle} numberOfLines={2}>{book.title}</Text>
                <Text style={styles.sheetAuthor}>{book.author}</Text>
              </View>
              <TouchableOpacity style={styles.sheetClose} onPress={onClose}>
                <MaterialIcons name="close" size={20} color={Colors.black} />
              </TouchableOpacity>
            </View>
            <View style={styles.sheetDivider} />
            {options.map((opt) => (
              <TouchableOpacity key={opt.label} style={styles.sheetOption} onPress={opt.onPress}>
                <MaterialIcons name={opt.icon as any} size={20} color={opt.danger ? '#C0392B' : Colors.black} />
                <Text style={[styles.sheetOptionText, opt.danger && styles.sheetOptionDanger]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ── Home screen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const [optionsBook, setOptionsBook] = useState<Book | null>(null);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filteredBooks = BOOKS
    .filter((b) => !activeGenre || b.genre === activeGenre)
    .filter((b) => !query ||
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.author.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Books in Brooklyn, NY</Text>

        {/* Live search bar */}
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={16} color={Colors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search books in your area"
            placeholderTextColor={Colors.gray}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <MaterialIcons name="close" size={16} color={Colors.gray} />
            </TouchableOpacity>
          )}
        </View>

        {/* Genre filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.genreRow}
          contentContainerStyle={styles.genreRowContent}
        >
          {GENRES.map((genre) => (
            <AnimatedButton
              key={genre}
              style={[
                styles.genrePill,
                activeGenre === genre && styles.genrePillActive,
                Shadow,
              ]}
              onPress={() => setActiveGenre(activeGenre === genre ? null : genre)}
            >
              <Text style={[styles.genreText, activeGenre === genre && styles.genreTextActive]}>
                {genre}
              </Text>
            </AnimatedButton>
          ))}
        </ScrollView>

        {/* Results or empty state */}
        {filteredBooks.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={32} color={Colors.lightGray} />
            <Text style={styles.emptyText}>No books found{activeGenre ? ` in ${activeGenre}` : ''}</Text>
            {(activeGenre || query) && (
              <TouchableOpacity onPress={() => { setActiveGenre(null); setQuery(''); }}>
                <Text style={styles.clearText}>Clear filters</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredBooks.map((book) => (
            <TouchableOpacity
              key={book.id}
              style={styles.card}
              onPress={() => router.push(`/book/${book.id}`)}
            >
              <BookCover title={book.title} author={book.author} width={60} height={80} />
              <View style={styles.cardInfo}>
                {book.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{book.badge}</Text>
                  </View>
                )}
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>{book.author}</Text>
                <View style={styles.nearbyRow}>
                  <MaterialIcons name="place" size={12} color={Colors.gray} />
                  <Text style={styles.bookNearby}>{book.nearby} near you</Text>
                </View>
              </View>
              <View style={styles.cardActions}>
                <BookmarkButton
                  book={book}
                  onPress={() =>
                    toggleWishlist({ id: book.id, title: book.title, author: book.author, nearbyCount: book.nearby })
                  }
                />
                <AnimatedButton
                  style={[styles.moreButton, Shadow]}
                  onPress={(e) => { e.stopPropagation?.(); setOptionsBook(book); }}
                >
                  <MaterialIcons name="more-horiz" size={20} color={Colors.black} />
                </AnimatedButton>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {optionsBook && (
        <OptionsModal book={optionsBook} onClose={() => setOptionsBook(null)} />
      )}
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  heading: {
    fontSize: 24, fontWeight: '800', fontFamily: Font.extraBold,
    color: Colors.black, marginBottom: 12,
  },

  // Search
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    paddingHorizontal: 14, paddingVertical: 10, marginBottom: 14,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: Font.regular, color: Colors.black },

  // Genre chips
  genreRow: { marginBottom: 8 },
  genreRowContent: { paddingBottom: 10, paddingRight: 16 },
  genrePill: {
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.pill, backgroundColor: Colors.white,
    paddingHorizontal: 14, paddingVertical: 10, marginRight: 8,
  },
  genrePillActive: { backgroundColor: '#333', borderColor: '#333' },
  genreText: { fontSize: 13, fontWeight: '600', fontFamily: Font.bold, color: Colors.black },
  genreTextActive: { color: Colors.white },

  // Book card — no shadow, border only
  card: {
    flexDirection: 'row',
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    padding: 10, marginBottom: 12, alignItems: 'center', gap: 10,
  },
  cardInfo: { flex: 1 },
  badge: {
    backgroundColor: Colors.lightGray, borderRadius: Radius.pill,
    paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginBottom: 4,
  },
  badgeText: { fontSize: 10, fontWeight: '700', fontFamily: Font.bold, color: Colors.gray },
  bookTitle: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold, color: Colors.black, marginBottom: 2 },
  bookAuthor: { fontSize: 12, fontFamily: Font.regular, color: Colors.gray, marginBottom: 4 },
  nearbyRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  bookNearby: { fontSize: 11, color: Colors.gray, fontFamily: Font.regular },
  cardActions: { gap: 8, alignItems: 'center' },

  // Bookmark button
  wishlistButton: {
    width: 90, height: 40,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    backgroundColor: Colors.purple,
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card,
  },
  wishlistButtonSaved: { backgroundColor: Colors.teal },
  wishlistPlus: { fontSize: 16, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.white },

  // More button
  moreButton: {
    width: 90, height: 40,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.lightGray,
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card,
  },

  // Empty state
  emptyState: {
    alignItems: 'center', gap: 8, paddingVertical: 40,
  },
  emptyText: { fontSize: 14, fontFamily: Font.regular, color: Colors.gray },
  clearText: { fontSize: 13, fontWeight: '700', fontFamily: Font.bold, color: Colors.teal },

  // Options modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.white,
    borderTopWidth: 2, borderTopColor: Colors.black,
    borderTopLeftRadius: 16, borderTopRightRadius: 16,
    paddingTop: 0, paddingBottom: 32,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: Colors.lightGray,
    alignSelf: 'center', marginTop: 10, marginBottom: 2,
  },
  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 14,
  },
  sheetClose: {
    width: 32, height: 32, borderRadius: Radius.card,
    borderWidth: 1, borderColor: Colors.black,
    backgroundColor: Colors.lightGray,
    alignItems: 'center', justifyContent: 'center',
  },
  sheetTitle: { fontSize: 15, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black },
  sheetAuthor: { fontSize: 12, fontFamily: Font.regular, color: Colors.gray },
  sheetDivider: { height: 1, backgroundColor: Colors.black, marginBottom: 4 },
  sheetOption: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 20, paddingVertical: 16,
  },
  sheetOptionText: { fontSize: 15, fontFamily: Font.bold, fontWeight: '600', color: Colors.black },
  sheetOptionDanger: { color: '#C0392B' },
});
