import {
  ScrollView, View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, Modal, Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Colors, Shadow, Radius, Font, getColors, getShadow } from '../../constants/theme';
import { BookCover } from '../../components/BookCover';
import { AnimatedButton } from '../../components/AnimatedButton';
import { useIsWishlisted, toggleWishlist } from '../../store/wishlist';
import { useBooks } from '../../store/library';
import { useIsDark } from '../../store/theme';

const GENRES = ['Fantasy', 'Sci-Fi', 'Mystery', 'LGBTQ+', 'Horror', 'Romance'];

const BOOKS = [
  { id: 'f1', title: 'Life of Pi',            author: 'Yann Martel',          nearby: 16, genre: 'Literary Fiction' },
  { id: 'f2', title: 'Dune',                  author: 'Frank Herbert',         nearby: 26, genre: 'Sci-Fi',    badge: '#1 In Series' },
  { id: 'f3', title: 'Macbeth',               author: 'William Shakespeare',   nearby: 25, genre: 'Fantasy'  },
  { id: 'f4', title: 'Lord of the Flies',     author: 'William Golding',       nearby: 12, genre: 'Literary Fiction' },
  { id: 'f5', title: 'Catcher in the Rye',    author: 'J.D. Salinger',         nearby: 20, genre: 'Literary Fiction' },
  { id: 'f6', title: 'Fahrenheit 451',        author: 'Ray Bradbury',          nearby: 30, genre: 'Sci-Fi'   },
  { id: 'f7', title: 'The Stand',             author: 'Stephen King',          nearby: 8,  genre: 'Horror'   },
  { id: 'f8', title: 'Jane Eyre',             author: 'Charlotte Brontë',      nearby: 9,  genre: 'Romance'  },
];

type Book = typeof BOOKS[number];

// ── Mini star rating ───────────────────────────────────────────────────────────
function MiniStars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <MaterialIcons
          key={i}
          name={i <= full ? 'star' : (i === full + 1 && half) ? 'star-half' : 'star-outline'}
          size={11}
          color="#F5A623"
        />
      ))}
    </View>
  );
}

// ── Bookmark button ───────────────────────────────────────────────────────────
function BookmarkButton({ book, onPress }: { book: Book; onPress: () => void }) {
  const saved = useIsWishlisted(book.id);
  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);
  return (
    <AnimatedButton
      style={[styles.wishlistButton, saved && styles.wishlistButtonSaved, getShadow(isDark)]}
      onPress={onPress}
    >
      <MaterialIcons name={saved ? 'bookmark' : 'bookmark-outline'} size={18} color={Colors.white} />
      {!saved && <Text style={styles.wishlistPlus}>+</Text>}
    </AnimatedButton>
  );
}

// ── Three-dot options modal ───────────────────────────────────────────────────
function OptionsModal({ book, onClose }: { book: Book; onClose: () => void }) {
  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

  const saved = useIsWishlisted(book.id);
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetY = useRef(new Animated.Value(400)).current;
  const [gbInfo, setGbInfo] = useState<{ rating?: number; pages?: number; year?: string }>({});

  // Fetch Google Books stats
  useEffect(() => {
    const q = `intitle:${encodeURIComponent(book.title)}+inauthor:${encodeURIComponent(book.author)}`;
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1`)
      .then(r => r.json())
      .then(data => {
        const info = data?.items?.[0]?.volumeInfo;
        if (!info) return;
        setGbInfo({ rating: info.averageRating, pages: info.pageCount, year: info.publishedDate?.slice(0, 4) });
      })
      .catch(() => {});
  }, [book.title, book.author]);

  // Animate in on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(sheetY, { toValue: 0, duration: 260, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(sheetY, { toValue: 400, duration: 200, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  const options: { icon: string; label: string; onPress: () => void; danger?: boolean }[] = [
    {
      icon: saved ? 'bookmark' : 'bookmark-outline',
      label: saved ? 'Remove from Wishlist' : 'Save to Wishlist',
      onPress: () => {
        toggleWishlist({ id: book.id, title: book.title, author: book.author, nearbyCount: book.nearby });
        handleClose();
      },
    },
    {
      icon: 'open-in-new',
      label: 'View Details',
      onPress: () => { handleClose(); setTimeout(() => router.push(`/book/${book.id}`), 220); },
    },
    {
      icon: 'library-add',
      label: 'I have this book',
      onPress: () => { handleClose(); setTimeout(() => router.push('/add-book'), 220); },
    },
    {
      icon: 'share',
      label: 'Share',
      onPress: () => handleClose(),
    },
    {
      icon: 'block',
      label: 'Not Interested',
      danger: true,
      onPress: () => handleClose(),
    },
  ];

  return (
    <Modal visible transparent animationType="none" onRequestClose={handleClose}>
      {/* Fade-in backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} activeOpacity={1} />
      </Animated.View>

      {/* Slide-up sheet */}
      <View style={styles.sheetContainer} pointerEvents="box-none">
        <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>
          <View style={styles.handle} />

          {/* Book info + stats */}
          <View style={styles.sheetHeader}>
            <BookCover title={book.title} author={book.author} width={44} height={60} borderRadius={6} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.sheetTitle} numberOfLines={2}>{book.title}</Text>
              <Text style={styles.sheetAuthor}>{book.author}</Text>

              {/* Stats row */}
              {(gbInfo.pages || gbInfo.year || gbInfo.rating) ? (
                <View style={styles.sheetStats}>
                  {gbInfo.rating && <MiniStars rating={gbInfo.rating} />}
                  {gbInfo.rating && <Text style={styles.sheetStatText}>{gbInfo.rating.toFixed(1)}</Text>}
                  {gbInfo.pages && <Text style={styles.sheetStatDot}>·</Text>}
                  {gbInfo.pages && <Text style={styles.sheetStatText}>{gbInfo.pages} pages</Text>}
                  {gbInfo.year && <Text style={styles.sheetStatDot}>·</Text>}
                  {gbInfo.year && <Text style={styles.sheetStatText}>{gbInfo.year}</Text>}
                </View>
              ) : (
                <View style={styles.sheetStats}>
                  <MaterialIcons name="place" size={11} color={C.gray} />
                  <Text style={styles.sheetStatText}>{book.nearby} nearby</Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.sheetClose} onPress={handleClose}>
              <MaterialIcons name="close" size={20} color={C.black} />
            </TouchableOpacity>
          </View>

          <View style={styles.sheetDivider} />

          {options.map((opt) => (
            <TouchableOpacity key={opt.label} style={styles.sheetOption} onPress={opt.onPress}>
              <MaterialIcons name={opt.icon as any} size={20} color={opt.danger ? '#C0392B' : C.black} />
              <Text style={[styles.sheetOptionText, opt.danger && styles.sheetOptionDanger]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>
    </Modal>
  );
}

// ── Home screen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

  const [optionsBook, setOptionsBook] = useState<Book | null>(null);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  // Hide books that are already in the user's library (matched by title)
  const libraryBooks = useBooks();
  const libraryTitles = new Set(libraryBooks.map(b => b.title.toLowerCase()));

  const filteredBooks = BOOKS
    .filter((b) => !libraryTitles.has(b.title.toLowerCase()))
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
          <MaterialIcons name="search" size={16} color={C.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search books in your area"
            placeholderTextColor={C.gray}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <MaterialIcons name="close" size={16} color={C.gray} />
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
            <MaterialIcons name="search-off" size={32} color={C.lightGray} />
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
                  <MaterialIcons name="place" size={12} color={C.gray} />
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
                  style={[styles.moreButton, getShadow(isDark)]}
                  onPress={(e) => { e.stopPropagation?.(); setOptionsBook(book); }}
                >
                  <MaterialIcons name="more-horiz" size={20} color={C.black} />
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
function makeStyles(C: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: C.background },
    container: { flex: 1 },
    content: { padding: 16, paddingBottom: 32 },
    heading: {
      fontSize: 24, fontWeight: '800', fontFamily: Font.extraBold,
      color: C.black, marginBottom: 12,
    },

    // Search
    searchBar: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card, backgroundColor: C.white,
      paddingHorizontal: 14, paddingVertical: 10, marginBottom: 14,
    },
    searchInput: { flex: 1, fontSize: 14, fontFamily: Font.regular, color: C.black },

    // Genre chips
    genreRow: { marginBottom: 8 },
    genreRowContent: { paddingBottom: 10, paddingRight: 16 },
    genrePill: {
      borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.pill, backgroundColor: C.white,
      paddingHorizontal: 14, paddingVertical: 10, marginRight: 8,
    },
    genrePillActive: { backgroundColor: C.pillActive, borderColor: C.pillActive },
    genreText: { fontSize: 13, fontWeight: '600', fontFamily: Font.bold, color: C.black },
    genreTextActive: { color: C.white },

    // Book card
    card: {
      flexDirection: 'row',
      borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card, backgroundColor: C.white,
      padding: 10, marginBottom: 12, alignItems: 'center', gap: 10,
    },
    cardInfo: { flex: 1 },
    badge: {
      backgroundColor: C.lightGray, borderRadius: Radius.pill,
      paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginBottom: 4,
    },
    badgeText: { fontSize: 10, fontWeight: '700', fontFamily: Font.bold, color: C.gray },
    bookTitle: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold, color: C.black, marginBottom: 2 },
    bookAuthor: { fontSize: 12, fontFamily: Font.regular, color: C.gray, marginBottom: 4 },
    nearbyRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    bookNearby: { fontSize: 11, color: C.gray, fontFamily: Font.regular },
    cardActions: { gap: 8, alignItems: 'center' },

    // Bookmark button
    wishlistButton: {
      width: 90, height: 40,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
      backgroundColor: C.purple,
      borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card,
    },
    wishlistButtonSaved: { backgroundColor: C.teal },
    wishlistPlus: { fontSize: 16, fontWeight: '800', fontFamily: Font.extraBold, color: C.white },

    // More button
    moreButton: {
      width: 90, height: 40,
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: C.lightGray,
      borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card,
    },

    // Empty state
    emptyState: { alignItems: 'center', gap: 8, paddingVertical: 40 },
    emptyText: { fontSize: 14, fontFamily: Font.regular, color: C.gray },
    clearText: { fontSize: 13, fontWeight: '700', fontFamily: Font.bold, color: C.teal },

    // Options modal — custom animation
    backdrop: {
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    sheetContainer: {
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: C.white,
      borderTopWidth: 2, borderTopColor: C.black,
      borderTopLeftRadius: 16, borderTopRightRadius: 16,
      paddingBottom: 32,
    },
    handle: {
      width: 36, height: 4, borderRadius: 2,
      backgroundColor: C.lightGray,
      alignSelf: 'center', marginTop: 10, marginBottom: 2,
    },
    sheetHeader: {
      flexDirection: 'row', alignItems: 'flex-start', gap: 12,
      paddingHorizontal: 20, paddingVertical: 14,
    },
    sheetClose: {
      width: 32, height: 32, borderRadius: Radius.card,
      borderWidth: 1, borderColor: C.black,
      backgroundColor: C.lightGray,
      alignItems: 'center', justifyContent: 'center',
    },
    sheetTitle: { fontSize: 15, fontWeight: '800', fontFamily: Font.extraBold, color: C.black },
    sheetAuthor: { fontSize: 12, fontFamily: Font.regular, color: C.gray },
    sheetStats: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
    sheetStatText: { fontSize: 11, fontFamily: Font.regular, color: C.gray },
    sheetStatDot: { fontSize: 14, fontWeight: '700', color: C.gray, lineHeight: 14 },
    sheetDivider: { height: 1, backgroundColor: C.black, marginBottom: 4 },
    sheetOption: {
      flexDirection: 'row', alignItems: 'center', gap: 14,
      paddingHorizontal: 20, paddingVertical: 16,
    },
    sheetOptionText: { fontSize: 15, fontFamily: Font.bold, fontWeight: '600', color: C.black },
    sheetOptionDanger: { color: '#C0392B' },
  });
}
