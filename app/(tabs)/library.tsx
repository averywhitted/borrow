import {
  ScrollView, View, Text, TouchableOpacity,
  StyleSheet, SafeAreaView, Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useRef, useCallback, useMemo } from 'react';
import { router } from 'expo-router';
import { Colors, Shadow, Radius, Font, getColors, getShadow } from '../../constants/theme';
import { BookCover } from '../../components/BookCover';
import { AnimatedButton } from '../../components/AnimatedButton';
import { useWishlist } from '../../store/wishlist';
import { useBooks } from '../../store/library';
import { useIsDark } from '../../store/theme';

type LibraryTab = 'lending' | 'borrowing' | 'wishlist';

const TAB_COLOR: Record<LibraryTab, string> = {
  lending:   Colors.teal,
  borrowing: Colors.purple,
  wishlist:  '#555',
};

export default function LibraryScreen() {
  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

  const books = useBooks();
  const [activeTab, setActiveTab] = useState<LibraryTab>('lending');
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const indicatorX = useRef(new Animated.Value(0)).current;
  const wishlist = useWishlist();

  const switchTab = useCallback((tab: LibraryTab) => {
    setActiveTab(tab);
    const slotW = (tabBarWidth - 8) / 3;
    const toValue = tab === 'lending' ? 0 : tab === 'borrowing' ? slotW : slotW * 2;
    Animated.timing(indicatorX, { toValue, duration: 160, useNativeDriver: true }).start();
  }, [tabBarWidth]);

  const outOnLoan = books.filter(b => b.status === 'lending' || b.status === 'overdue');
  const inLibrary = books.filter(b => b.status === 'in-library');
  const borrowingBooks = books.filter(b => b.status === 'borrowing');

  const slotWidth = tabBarWidth > 0 ? (tabBarWidth - 8) / 3 : undefined;
  const indicatorColor = C[activeTab === 'lending' ? 'teal' : activeTab === 'borrowing' ? 'purple' : 'gray'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.heading}>Your Library</Text>
        <AnimatedButton style={[styles.addButton, getShadow(isDark)]} onPress={() => router.push('/add-book')}>
          <MaterialIcons name="add" size={16} color={Colors.white} />
          <Text style={styles.addButtonText}>Add Book</Text>
        </AnimatedButton>
      </View>

      {/* 3-tab sliding selector */}
      <View
        style={styles.tabBar}
        onLayout={e => setTabBarWidth(e.nativeEvent.layout.width)}
      >
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              width: slotWidth,
              backgroundColor: indicatorColor,
              transform: [{ translateX: indicatorX }],
            },
          ]}
        />
        {(['lending', 'borrowing', 'wishlist'] as LibraryTab[]).map((tab) => (
          <TouchableOpacity key={tab} style={styles.tab} onPress={() => switchTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'lending' ? 'Lending' : tab === 'borrowing' ? 'Borrowing' : 'Wishlist'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.list}>

        {/* ── LENDING TAB ── */}
        {activeTab === 'lending' && (
          outOnLoan.length === 0 && inLibrary.length === 0
            ? <EmptyState icon="menu-book" text="Your library is empty" />
            : <>
                {outOnLoan.length > 0 && (
                  <>
                    <SectionHeader
                      label="Out on Loan"
                      count={outOnLoan.length}
                      color={C.teal}
                    />
                    {outOnLoan.map(book => (
                      <TouchableOpacity
                        key={book.id}
                        style={styles.card}
                        onPress={() => router.push(`/book/${book.id}`)}
                        activeOpacity={0.85}
                      >
                        <BookCover title={book.title} author={book.author} width={50} height={66} />
                        <View style={styles.cardInfo}>
                          <Text style={styles.bookTitle}>{book.title}</Text>
                          <Text style={styles.bookAuthor}>{book.author}</Text>
                          <Text style={[styles.dueText, { color: book.status === 'overdue' ? '#C0392B' : C.teal }]}>
                            {book.status === 'overdue' ? 'Overdue' : 'Lending'} · {book.dueDate}
                          </Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={20} color={C.lightGray} />
                      </TouchableOpacity>
                    ))}
                  </>
                )}

                {inLibrary.length > 0 && (
                  <>
                    <SectionHeader
                      label="In Your Library"
                      count={inLibrary.length}
                      color={C.gray}
                    />
                    {inLibrary.map(book => (
                      <TouchableOpacity
                        key={book.id}
                        style={styles.card}
                        onPress={() => router.push(`/book/${book.id}`)}
                        activeOpacity={0.85}
                      >
                        <BookCover title={book.title} author={book.author} width={50} height={66} />
                        <View style={styles.cardInfo}>
                          <Text style={styles.bookTitle}>{book.title}</Text>
                          <Text style={styles.bookAuthor}>{book.author}</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={20} color={C.lightGray} />
                      </TouchableOpacity>
                    ))}
                  </>
                )}
              </>
        )}

        {/* ── BORROWING TAB ── */}
        {activeTab === 'borrowing' && (
          borrowingBooks.length === 0
            ? <EmptyState icon="swap-horiz" text="You're not borrowing anything" />
            : borrowingBooks.map(book => (
                <TouchableOpacity
                  key={book.id}
                  style={styles.card}
                  onPress={() => router.push(`/book/${book.id}`)}
                  activeOpacity={0.85}
                >
                  <BookCover title={book.title} author={book.author} width={50} height={66} />
                  <View style={styles.cardInfo}>
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={styles.bookAuthor}>{book.author}</Text>
                    <Text style={[styles.dueText, { color: C.purple }]}>
                      Due {book.dueDate}
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color={C.lightGray} />
                </TouchableOpacity>
              ))
        )}

        {/* ── WISHLIST TAB ── */}
        {activeTab === 'wishlist' && (
          wishlist.length === 0
            ? <EmptyState icon="bookmark-outline" text="Books you bookmark will appear here" />
            : wishlist.map(book => (
                <TouchableOpacity
                  key={book.id}
                  style={styles.card}
                  onPress={() => router.push(`/book/${book.id}`)}
                  activeOpacity={0.85}
                >
                  <BookCover title={book.title} author={book.author} width={50} height={66} />
                  <View style={styles.cardInfo}>
                    <Text style={styles.bookTitle}>{book.title}</Text>
                    <Text style={styles.bookAuthor}>{book.author}</Text>
                    {book.nearbyCount != null && (
                      <View style={styles.nearbyRow}>
                        <MaterialIcons name="place" size={11} color={C.gray} />
                        <Text style={styles.nearbyText}>{book.nearbyCount} near you</Text>
                      </View>
                    )}
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color={C.lightGray} />
                </TouchableOpacity>
              ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ label, count, color }: { label: string; count: number; color: string }) {
  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionLabel, { color }]}>{label.toUpperCase()}</Text>
      <View style={[styles.sectionCount, { backgroundColor: color }]}>
        <Text style={styles.sectionCountText}>{count}</Text>
      </View>
    </View>
  );
}

function EmptyState({ icon, text }: { icon: React.ComponentProps<typeof MaterialIcons>['name']; text: string }) {
  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);
  return (
    <View style={styles.empty}>
      <MaterialIcons name={icon} size={28} color={C.lightGray} />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

function makeStyles(C: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: C.background },

    header: {
      flexDirection: 'row', alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    },
    heading: { fontSize: 24, fontWeight: '800', fontFamily: Font.extraBold, color: C.black },
    addButton: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      backgroundColor: C.teal, borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card, paddingHorizontal: 12, paddingVertical: 7,
    },
    addButtonText: { color: Colors.white, fontWeight: '700', fontFamily: Font.bold, fontSize: 13 },

    tabBar: {
      flexDirection: 'row', position: 'relative',
      marginHorizontal: 16, marginBottom: 12,
      borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.pill, padding: 3,
      backgroundColor: C.white,
    },
    tabIndicator: {
      position: 'absolute', top: 3, bottom: 3, left: 3,
      borderRadius: Radius.pill,
    },
    tab: { flex: 1, paddingVertical: 8, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
    tabText: { fontSize: 13, fontWeight: '700', fontFamily: Font.bold, color: C.gray },
    tabTextActive: { color: Colors.white },

    scroll: { flex: 1 },
    list: { paddingHorizontal: 16, paddingBottom: 32, gap: 8 },

    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 4, marginBottom: 2 },
    sectionLabel: { fontSize: 11, fontWeight: '800', fontFamily: Font.extraBold, letterSpacing: 0.8 },
    sectionCount: {
      borderRadius: Radius.pill, borderWidth: 1, borderColor: C.black,
      minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5,
    },
    sectionCountText: { fontSize: 10, fontWeight: '700', fontFamily: Font.bold, color: Colors.white },

    card: {
      flexDirection: 'row', borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card, backgroundColor: C.white,
      padding: 10, alignItems: 'center', gap: 10,
    },
    cardInfo: { flex: 1, gap: 3 },
    bookTitle: { fontSize: 13, fontWeight: '700', fontFamily: Font.bold, color: C.black, lineHeight: 17 },
    bookAuthor: { fontSize: 12, fontFamily: Font.regular, color: C.gray },
    dueText: { fontSize: 11, fontFamily: Font.bold, fontWeight: '700', marginTop: 1 },
    nearbyRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 1 },
    nearbyText: { fontSize: 11, fontFamily: Font.regular, color: C.gray },

    empty: {
      flexDirection: 'row', alignItems: 'center', gap: 10,
      borderWidth: 1, borderColor: C.lightGray,
      borderRadius: Radius.card, padding: 16,
      backgroundColor: C.white,
    },
    emptyText: { fontSize: 13, fontFamily: Font.regular, color: C.gray },
  });
}
