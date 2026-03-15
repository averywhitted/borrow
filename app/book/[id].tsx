import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useMemo } from 'react';
import { Radius, Font, getColors, getShadow } from '../../constants/theme';
import { BookCover } from '../../components/BookCover';
import { Avatar } from '../../components/Avatar';
import { AnimatedButton } from '../../components/AnimatedButton';
import { useIsWishlisted, toggleWishlist } from '../../store/wishlist';
import { useBook, markReceived } from '../../store/library';
import { getThread } from '../../store/threads';
import { useIsDark } from '../../store/theme';

// ── Static book metadata ───────────────────────────────────────────────────────

const LENDERS = [
  { id: '1', name: 'Jaydon Workman', books: 12, borrows: 8, lends: 14, distance: '0.3 mi', available: true },
  { id: '2', name: 'Mira Siphron', books: 24, borrows: 19, lends: 22, distance: '0.6 mi', available: true },
  { id: '3', name: 'Carlos Reyes', books: 7, borrows: 3, lends: 5, distance: '1.1 mi', available: false },
];

type HistoryEntry = { event: string; person: string; dates: string; type: 'lent' | 'borrowed' };
const BOOK_HISTORY: Record<string, HistoryEntry[]> = {
  '1': [
    { event: 'Lent to', person: 'Jaydon Workman', dates: 'Mar 10 – present', type: 'lent' },
    { event: 'Lent to', person: 'Priya Okonkwo', dates: 'Jan 2 – Jan 18', type: 'lent' },
    { event: 'Borrowed from', person: 'Marcus Lee', dates: 'Oct 5 – Oct 22, 2024', type: 'borrowed' },
  ],
  '2': [{ event: 'Borrowed from', person: 'Jaydon Workman', dates: 'Feb 14 – present (overdue)', type: 'borrowed' }],
  '3': [
    { event: 'Lent to', person: 'Priya Okonkwo', dates: 'Nov 5 – Nov 22, 2024', type: 'lent' },
    { event: 'Lent to', person: 'Sam Rivera', dates: 'Aug 12 – Aug 30, 2024', type: 'lent' },
  ],
  '4': [
    { event: 'Received back from', person: 'Priya Okonkwo', dates: 'Feb 20, 2025', type: 'lent' },
    { event: 'Lent to', person: 'Priya Okonkwo', dates: 'Jan 15 – Feb 20', type: 'lent' },
  ],
  '7': [{ event: 'Borrowed from', person: 'Jaydon Workman', dates: 'Mar 1 – present', type: 'borrowed' }],
  '8': [{ event: 'Borrowed from', person: 'Marcus Lee', dates: 'Mar 3 – present', type: 'borrowed' }],
};

const BOOKS: Record<string, { title: string; author: string; genre: string; description: string }> = {
  // Library books (matched by library store IDs)
  '1': { title: 'Piranesi', author: 'Susanna Clarke', genre: 'Fantasy', description: 'In a house of infinite halls and tidal seas, Piranesi must solve the mystery of his own existence and uncover the secrets of a dangerous adversary.' },
  '2': { title: 'The Remains of the Day', author: 'Kazuo Ishiguro', genre: 'Literary Fiction', description: 'A dignified English butler reflects on his life of service and the sacrifices made in pursuit of professional ideals during a road trip through the countryside.' },
  '3': { title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', description: "Set on the desert planet Arrakis, Dune is the story of Paul Atreides and of a great family's ambition to rule the most important and dangerous planet in the universe." },
  '4': { title: 'Kindred', author: 'Octavia Butler', genre: 'Historical Fiction', description: 'A modern Black woman is repeatedly transported back in time to a pre-Civil War plantation, where she must survive and witness the brutal realities of American slavery.' },
  '5': { title: 'Convenience Store Woman', author: 'Sayaka Murata', genre: 'Literary Fiction', description: 'A 36-year-old woman finds her identity in the precise rhythms and rituals of a convenience store, resisting societal pressure to conform to conventional life.' },
  '6': { title: "Giovanni's Room", author: 'James Baldwin', genre: 'Literary Fiction', description: 'An American in Paris struggles with his identity and his love for an Italian bartender named Giovanni, torn between desire and the life expected of him.' },
  '7': { title: 'Normal People', author: 'Sally Rooney', genre: 'Literary Fiction', description: "A nuanced account of the complex relationship between Connell and Marianne, two young people from different backgrounds navigating love, friendship, and identity." },
  '8': { title: 'The Midnight Library', author: 'Matt Haig', genre: 'Fiction', description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived." },
  // Home feed browse books (prefixed with 'f' to avoid collisions with library IDs)
  'f1': { title: 'Life of Pi', author: 'Yann Martel', genre: 'Literary Fiction', description: 'A young Indian man survives 227 days on a lifeboat in the Pacific Ocean with a Bengal tiger named Richard Parker, in a story about faith, will, and the nature of reality.' },
  'f2': { title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', description: "Set on the desert planet Arrakis, Dune is the story of Paul Atreides and of a great family's ambition to rule the most important and dangerous planet in the universe." },
  'f3': { title: 'Macbeth', author: 'William Shakespeare', genre: 'Fantasy', description: "Shakespeare's dark Scottish play follows the ruthless rise and bloody fall of Macbeth, a brave Scottish general whose ambition is ignited by a prophecy from three witches." },
  'f4': { title: 'Lord of the Flies', author: 'William Golding', genre: 'Literary Fiction', description: 'A group of British boys stranded on an uninhabited island attempt to govern themselves, with disastrous results, exploring the dark side of human nature.' },
  'f5': { title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Literary Fiction', description: 'Holden Caulfield, a disaffected teenager, narrates his experiences in New York City after being expelled from prep school, searching for meaning in a world of phonies.' },
  'f6': { title: 'Fahrenheit 451', author: 'Ray Bradbury', genre: 'Sci-Fi', description: 'In a dystopian future, books are outlawed and firemen burn any they find. Fireman Guy Montag begins to question his society after meeting a free-spirited young woman.' },
  'f7': { title: 'The Stand', author: 'Stephen King', genre: 'Horror', description: "A flu-like plague decimates most of humanity. The survivors — good and evil — are drawn toward an inevitable confrontation. King's epic tale of apocalypse and aftermath." },
  'f8': { title: 'Jane Eyre', author: 'Charlotte Bronte', genre: 'Romance', description: 'An orphaned governess navigates moral and spiritual growth as she falls in love with her brooding employer, Mr. Rochester, at Thornfield Hall.' },
};

// ── Static Google Books stats (avoids rate limiting during dev) ────────────────
const BOOK_GB: Record<string, { rating: number; pages: number; year: string; ratingsCount: number }> = {
  '1': { rating: 4.3, pages: 272, year: '2020', ratingsCount: 84521 },
  '2': { rating: 4.1, pages: 245, year: '1989', ratingsCount: 62834 },
  '3': { rating: 4.2, pages: 412, year: '1965', ratingsCount: 234872 },
  '4': { rating: 4.4, pages: 287, year: '1979', ratingsCount: 109234 },
  '5': { rating: 3.9, pages: 163, year: '2016', ratingsCount: 45123 },
  '6': { rating: 4.1, pages: 159, year: '1956', ratingsCount: 78234 },
  '7': { rating: 3.8, pages: 273, year: '2018', ratingsCount: 287654 },
  '8': { rating: 3.9, pages: 304, year: '2020', ratingsCount: 892341 },
  // Home feed books
  'f1': { rating: 3.9, pages: 319, year: '2001', ratingsCount: 1247832 },
  'f2': { rating: 4.2, pages: 412, year: '1965', ratingsCount: 892341 },
  'f3': { rating: 3.9, pages: 83,  year: '1606', ratingsCount: 342891 },
  'f4': { rating: 3.7, pages: 224, year: '1954', ratingsCount: 678234 },
  'f5': { rating: 3.8, pages: 277, year: '1951', ratingsCount: 2341087 },
  'f6': { rating: 3.9, pages: 158, year: '1953', ratingsCount: 1087234 },
  'f7': { rating: 4.3, pages: 1153, year: '1978', ratingsCount: 567891 },
  'f8': { rating: 4.2, pages: 507, year: '1847', ratingsCount: 1892341 },
};

// ── Star rating component ──────────────────────────────────────────────────────
function StarRating({ rating, size = 11 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <MaterialIcons
          key={i}
          name={i <= full ? 'star' : (i === full + 1 && half) ? 'star-half' : 'star-outline'}
          size={size}
          color="#F5A623"
        />
      ))}
    </View>
  );
}

const EXTEND_OPTIONS = [
  { key: '+1w', label: '+1 week' },
  { key: '+2w', label: '+2 weeks' },
  { key: '+1m', label: '+1 month' },
] as const;
type ExtendKey = typeof EXTEND_OPTIONS[number]['key'];

// ── Main screen ────────────────────────────────────────────────────────────────
export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const myBook = useBook(id);
  // Home feed books use 'f1'-'f8' prefix; library books use '1'-'8'
  const bookData = BOOKS[id] ?? BOOKS['1'];
  const saved = useIsWishlisted(id);
  const gbInfo = BOOK_GB[id] ?? {};

  const [confirmAction, setConfirmAction] = useState<'return' | 'received' | null>(null);
  const [showExtend, setShowExtend] = useState(false);
  const [extendOption, setExtendOption] = useState<ExtendKey>('+2w');

  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

  const displayTitle = myBook?.title ?? bookData.title;
  const displayAuthor = myBook?.author ?? bookData.author;

  const lenderThread = myBook?.threadId ? getThread(myBook.threadId) : undefined;
  const neighborName = lenderThread?.neighborName;

  const isLending = myBook?.status === 'lending' || myBook?.status === 'overdue';
  const isBorrowing = myBook?.status === 'borrowing';
  const statusColor = myBook?.status === 'overdue' ? '#C0392B' : isLending ? C.teal : isBorrowing ? C.purple : C.gray;
  const statusLabel = myBook?.status === 'overdue' ? 'Overdue' : isLending ? 'Lending' : isBorrowing ? 'Borrowing' : 'In Library';
  const history = myBook ? (BOOK_HISTORY[id] ?? []) : [];

  const handleExtendConfirm = () => {
    const label = EXTEND_OPTIONS.find(o => o.key === extendOption)?.label ?? '+2 weeks';
    setShowExtend(false);
    if (myBook?.threadId) {
      router.push({
        pathname: `/thread/${myBook.threadId}` as any,
        params: { draft: `📅 Hey! Would it be okay to extend my borrow of "${displayTitle}" by ${label}? Thanks!` },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={20} color={C.black} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* ── Book header ── */}
        <View style={styles.bookHeader}>
          <BookCover title={displayTitle} author={displayAuthor} width={110} height={150} borderRadius={Radius.card} />
          <View style={styles.bookMeta}>

            <View style={styles.genrePill}>
              <Text style={styles.genreText}>{bookData.genre || 'Fiction'}</Text>
            </View>
            <Text style={styles.bookTitle}>{displayTitle}</Text>

            {/* Author on its own line */}
            <Text style={styles.inlineAuthor}>{displayAuthor}</Text>

            {/* Stats: year · pages · stars on a second line */}
            {(gbInfo.year || gbInfo.pages || gbInfo.rating) && (
              <View style={styles.inlineStats}>
                {gbInfo.year && <Text style={styles.inlineStat}>{gbInfo.year}</Text>}
                {gbInfo.year && gbInfo.pages && <Text style={styles.inlineDot}> · </Text>}
                {gbInfo.pages && <Text style={styles.inlineStat}>{gbInfo.pages} pages</Text>}
                {gbInfo.rating && (gbInfo.year || gbInfo.pages) && <Text style={styles.inlineDot}> · </Text>}
                {gbInfo.rating && <StarRating rating={gbInfo.rating} size={10} />}
                {gbInfo.rating && <Text style={styles.inlineStat}> {gbInfo.rating.toFixed(1)}</Text>}
              </View>
            )}

            {/* Status row (library books with active transaction) */}
            {myBook && (isLending || isBorrowing || myBook.status === 'overdue') && (
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {statusLabel}{myBook.dueDate ? ` · Due ${myBook.dueDate}` : ''}
                </Text>
              </View>
            )}

            {/* Neighbor link */}
            {(isLending || isBorrowing) && neighborName && (
              <TouchableOpacity
                style={styles.neighborLink}
                onPress={() => router.push(`/thread/${myBook!.threadId}`)}
              >
                <Text style={styles.neighborLinkLabel}>
                  {isLending ? 'Lent to' : 'Borrowed from'}{' '}
                </Text>
                <Text style={styles.neighborLinkName}>{neighborName}</Text>
                <MaterialIcons name="chevron-right" size={13} color={C.gray} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── About ── */}
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{bookData.description}</Text>

        {/* ── Action area (library books with active transaction) ── */}
        {myBook && (isLending || isBorrowing) && (
          <View style={styles.actionArea}>
            <AnimatedButton
              style={[styles.mainActionBtn, { backgroundColor: isLending ? C.teal : C.purple }, getShadow(isDark)]}
              onPress={() => setConfirmAction(isLending ? 'received' : 'return')}
            >
              <MaterialIcons name={isLending ? 'check' : 'undo'} size={16} color={C.white} />
              <Text style={styles.mainActionBtnText}>
                {isLending ? 'Mark Received' : 'Arrange Return'}
              </Text>
            </AnimatedButton>
            {isBorrowing && (
              <AnimatedButton
                style={[styles.extendBtn, getShadow(isDark)]}
                onPress={() => setShowExtend(true)}
              >
                <MaterialIcons name="event" size={14} color={C.black} />
                <Text style={styles.extendBtnText}>Extend Borrow</Text>
              </AnimatedButton>
            )}
          </View>
        )}

        {/* ── History timeline ── */}
        {myBook && (
          <>
            <Text style={styles.sectionTitle}>History</Text>
            {history.length > 0 ? (
              <View style={styles.timeline}>
                {history.map((entry, i) => (
                  <View key={i} style={styles.timelineRow}>
                    <View style={styles.timelineLeft}>
                      <View style={[styles.timelineDot, { backgroundColor: entry.type === 'lent' ? C.teal : C.purple }]} />
                      {i < history.length - 1 && <View style={styles.timelineConnector} />}
                    </View>
                    <View style={styles.timelineBody}>
                      <Text style={styles.timelineEvent}>
                        {entry.event}{' '}
                        <Text style={styles.timelinePerson}>{entry.person}</Text>
                      </Text>
                      <Text style={styles.timelineDates}>{entry.dates}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={[styles.historyEmpty, { backgroundColor: C.white, borderColor: C.black }]}>
                <MaterialIcons name="history" size={22} color={C.lightGray} />
                <Text style={[styles.historyEmptyText, { color: C.gray }]}>
                  Once this book has been borrowed, the lending history will appear here.
                </Text>
              </View>
            )}
          </>
        )}

        {/* ── Lenders — only when not in user's library ── */}
        {!myBook && (
          <>
            <Text style={styles.lendersSectionTitle}>{LENDERS.length} neighbors have this book</Text>
            {LENDERS.map((lender) => (
              <View key={lender.id} style={[styles.lenderCard, getShadow(isDark)]}>
                <Avatar name={lender.name} size={44} />
                <View style={styles.lenderInfo}>
                  <Text style={styles.lenderName}>{lender.name}</Text>
                  <View style={styles.lenderMeta}>
                    <MaterialIcons name="place" size={11} color={C.gray} />
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
                  <AnimatedButton
                    style={[styles.requestButton, getShadow(isDark)]}
                    onPress={() => router.push(
                      `/borrow-request/${lender.id}?bookTitle=${encodeURIComponent(displayTitle)}&bookAuthor=${encodeURIComponent(displayAuthor)}`
                    )}
                  >
                    <Text style={styles.requestButtonText}>Request</Text>
                  </AnimatedButton>
                ) : (
                  <View style={styles.unavailableBtn}>
                    <Text style={styles.unavailableText}>On Loan</Text>
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        <View style={{ height: myBook ? 32 : 100 }} />
      </ScrollView>

      {/* ── Bottom bar — only when browsing (not in library) ── */}
      {!myBook && (
        <View style={styles.bottomBar}>
          <AnimatedButton
            style={[styles.bookmarkButton, saved && styles.bookmarkButtonSaved, getShadow(isDark)]}
            onPress={() => toggleWishlist({ id, title: displayTitle, author: displayAuthor })}
          >
            <MaterialIcons name={saved ? 'bookmark' : 'bookmark-outline'} size={22} color={saved ? C.white : C.black} />
          </AnimatedButton>
          <AnimatedButton
            style={[styles.borrowButton, getShadow(isDark)]}
            onPress={() => {
              const firstAvailable = LENDERS.find(l => l.available);
              if (firstAvailable) router.push(`/borrow-request/${firstAvailable.id}`);
            }}
          >
            <Text style={styles.borrowButtonText}>Request to Borrow</Text>
          </AnimatedButton>
        </View>
      )}

      {/* ── Return/Received confirm modal ── */}
      <Modal visible={!!confirmAction} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, getShadow(isDark)]}>
            <Text style={styles.modalTitle}>
              {confirmAction === 'received' ? 'Mark as Received?' : 'Arrange Return?'}
            </Text>
            <Text style={styles.modalSubtitle}>
              {confirmAction === 'received'
                ? `Confirm you've received "${displayTitle}" back from ${neighborName ?? 'the borrower'}.`
                : `Open chat with ${neighborName ?? 'the lender'} to coordinate returning "${displayTitle}". A draft message will be ready to send.`}
            </Text>
            <View style={styles.modalButtons}>
              <AnimatedButton style={[styles.modalCancel, getShadow(isDark)]} onPress={() => setConfirmAction(null)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </AnimatedButton>
              <AnimatedButton
                style={[styles.modalConfirm, { backgroundColor: confirmAction === 'received' ? C.teal : C.purple }, getShadow(isDark)]}
                onPress={() => {
                  if (confirmAction === 'received') {
                    markReceived(id);
                    setConfirmAction(null);
                    router.back();
                  } else {
                    setConfirmAction(null);
                    if (myBook?.threadId) {
                      router.push({
                        pathname: `/thread/${myBook.threadId}` as any,
                        params: { draft: `📦 Hey! I'm ready to return "${displayTitle}" — when can we meet up?` },
                      });
                    } else {
                      router.back();
                    }
                  }
                }}
              >
                <Text style={styles.modalConfirmText}>
                  {confirmAction === 'received' ? 'Mark Received' : 'Open Chat'}
                </Text>
              </AnimatedButton>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Extend borrow modal ── */}
      <Modal visible={showExtend} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, getShadow(isDark)]}>
            <Text style={styles.modalTitle}>Extend Borrow</Text>
            <Text style={styles.modalSubtitle}>
              How much longer would you like to borrow "{displayTitle}"?
              {myBook?.dueDate ? ` Currently due ${myBook.dueDate}.` : ''}
            </Text>
            <View style={styles.extendOptions}>
              {EXTEND_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.key}
                  style={[styles.extendChip, extendOption === opt.key && styles.extendChipActive, getShadow(isDark)]}
                  onPress={() => setExtendOption(opt.key)}
                >
                  <Text style={[styles.extendChipText, extendOption === opt.key && styles.extendChipTextActive]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtons}>
              <AnimatedButton style={[styles.modalCancel, getShadow(isDark)]} onPress={() => setShowExtend(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </AnimatedButton>
              <AnimatedButton style={[styles.modalConfirm, { backgroundColor: C.purple }, getShadow(isDark)]} onPress={handleExtendConfirm}>
                <Text style={styles.modalConfirmText}>Send Request</Text>
              </AnimatedButton>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
function makeStyles(C: ReturnType<typeof getColors>) { return StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: C.background },
  content: { padding: 16, paddingBottom: 32 },

  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  backText: { fontSize: 14, fontWeight: '600', fontFamily: Font.bold, color: C.black },

  // Book header
  bookHeader: { flexDirection: 'row', gap: 14, marginBottom: 20 },
  bookMeta: { flex: 1, gap: 6 },
  genrePill: {
    alignSelf: 'flex-start', borderWidth: 1, borderColor: C.black,
    borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 3,
    backgroundColor: C.white,
  },
  genreText: { fontSize: 11, fontWeight: '700', fontFamily: Font.bold, color: C.black },
  bookTitle: { fontSize: 20, fontWeight: '800', fontFamily: Font.extraBold, color: C.black, lineHeight: 24 },

  // Inline stats row
  inlineAuthor: { fontSize: 13, fontFamily: Font.regular, color: C.gray },
  inlineStats: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  inlineStat: { fontSize: 11, fontFamily: Font.regular, color: C.gray },
  inlineDot: { fontSize: 13, fontWeight: '700', color: C.gray },

  // Status
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '700', fontFamily: Font.bold },

  // Neighbor link
  neighborLink: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingVertical: 2 },
  neighborLinkLabel: { fontSize: 11, fontFamily: Font.regular, color: C.gray },
  neighborLinkName: { fontSize: 11, fontFamily: Font.bold, fontWeight: '700', color: C.gray },

  // About
  sectionTitle: {
    fontSize: 13, fontWeight: '800', fontFamily: Font.extraBold,
    color: C.gray, textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: 8,
  },
  description: { fontSize: 14, fontFamily: Font.regular, color: C.black, lineHeight: 21, marginBottom: 20 },

  // Action area
  actionArea: { alignItems: 'center', gap: 10, marginBottom: 24 },
  mainActionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: C.black,
    borderRadius: Radius.card, paddingVertical: 14, paddingHorizontal: 28,
    alignSelf: 'stretch',
  },
  mainActionBtnText: { fontSize: 15, fontWeight: '800', fontFamily: Font.extraBold, color: C.white },
  extendBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: C.black,
    borderRadius: Radius.card, paddingVertical: 10, paddingHorizontal: 20,
    backgroundColor: C.white,
  },
  extendBtnText: { fontSize: 13, fontWeight: '700', fontFamily: Font.bold, color: C.black },

  // History timeline
  timeline: { marginBottom: 24 },
  timelineRow: { flexDirection: 'row', gap: 12 },
  timelineLeft: { alignItems: 'center', width: 14 },
  timelineDot: { width: 10, height: 10, borderRadius: 5, marginTop: 3, borderWidth: 1, borderColor: C.black },
  timelineConnector: { flex: 1, width: 2, backgroundColor: C.lightGray, marginVertical: 3 },
  timelineBody: { flex: 1, paddingBottom: 16 },
  timelineEvent: { fontSize: 13, fontFamily: Font.regular, color: C.gray },
  timelinePerson: { fontFamily: Font.bold, fontWeight: '700', color: C.black },
  timelineDates: { fontSize: 11, fontFamily: Font.regular, color: C.gray, marginTop: 2 },
  historyEmpty: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderRadius: Radius.card,
    padding: 14, marginBottom: 24,
  },
  historyEmptyText: { flex: 1, fontSize: 13, fontFamily: Font.regular, lineHeight: 19 },

  // Lenders
  lendersSectionTitle: {
    fontSize: 16, fontWeight: '800', fontFamily: Font.extraBold,
    color: C.black, marginBottom: 12,
  },
  lenderCard: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: C.black,
    borderRadius: Radius.card, backgroundColor: C.white,
    padding: 12, marginBottom: 10, gap: 12,
  },
  lenderInfo: { flex: 1, gap: 3 },
  lenderName: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold, color: C.black },
  lenderMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  lenderDistance: { fontSize: 12, fontFamily: Font.regular, color: C.gray },
  lenderStats: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  lenderStat: { fontSize: 11, fontFamily: Font.regular, color: C.gray },
  lenderStatDot: { fontSize: 11, color: C.gray },
  requestButton: {
    backgroundColor: C.purple, borderWidth: 1, borderColor: C.black,
    borderRadius: Radius.card, paddingHorizontal: 14, paddingVertical: 8,
  },
  requestButtonText: { color: C.white, fontWeight: '700', fontFamily: Font.bold, fontSize: 13 },
  unavailableBtn: {
    borderWidth: 1, borderColor: C.black,
    borderRadius: Radius.card, paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: C.lightGray,
  },
  unavailableText: { fontSize: 13, fontFamily: Font.regular, color: C.gray },

  // Bottom bar (browse mode)
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: 10,
    padding: 16, backgroundColor: C.white,
    borderTopWidth: 1, borderTopColor: C.black,
  },
  bookmarkButton: {
    width: 50, height: 50,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.black,
    borderRadius: Radius.card, backgroundColor: C.white,
  },
  bookmarkButtonSaved: { backgroundColor: C.teal },
  borrowButton: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: C.purple, borderWidth: 1, borderColor: C.black,
    borderRadius: Radius.card, paddingVertical: 14,
  },
  borrowButtonText: { fontSize: 15, fontWeight: '800', fontFamily: Font.extraBold, color: C.white },

  // Confirm / Extend modals
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  modalBox: {
    width: '100%', backgroundColor: C.white,
    borderWidth: 1, borderColor: C.black,
    borderRadius: Radius.card, padding: 20, gap: 12,
  },
  modalTitle: { fontSize: 16, fontWeight: '800', fontFamily: Font.extraBold, color: C.black },
  modalSubtitle: { fontSize: 13, fontFamily: Font.regular, color: C.gray, lineHeight: 19 },
  modalButtons: { flexDirection: 'row', gap: 10, marginTop: 4 },
  modalCancel: {
    flex: 1, alignItems: 'center', paddingVertical: 12,
    borderWidth: 1, borderColor: C.black,
    borderRadius: Radius.card, backgroundColor: C.white,
  },
  modalCancelText: { fontSize: 13, fontWeight: '700', fontFamily: Font.bold, color: C.black },
  modalConfirm: {
    flex: 1, alignItems: 'center', paddingVertical: 12,
    borderWidth: 1, borderColor: C.black,
    borderRadius: Radius.card,
  },
  modalConfirmText: { fontSize: 13, fontWeight: '700', fontFamily: Font.bold, color: C.white },

  // Extend options
  extendOptions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  extendChip: {
    borderWidth: 1, borderColor: C.black,
    borderRadius: Radius.pill, backgroundColor: C.white,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  extendChipActive: { backgroundColor: '#555' },
  extendChipText: { fontSize: 13, fontFamily: Font.bold, fontWeight: '600', color: C.black },
  extendChipTextActive: { color: C.white },
}); }
