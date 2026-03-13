import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors, Shadow, Radius, Font } from '../../constants/theme';
import { BookCover } from '../../components/BookCover';
import { AnimatedButton } from '../../components/AnimatedButton';

type BookStatus = 'in-library' | 'lending' | 'borrowing' | 'overdue';

const BOOKS: { id: string; title: string; author: string; status: BookStatus; dueDate?: string }[] = [
  { id: '1',  title: 'Piranesi',                  author: 'Susanna Clarke',     status: 'lending',    dueDate: 'Mar 24' },
  { id: '2',  title: 'The Remains of the Day',     author: 'Kazuo Ishiguro',     status: 'overdue',    dueDate: 'Mar 1'  },
  { id: '3',  title: 'Dune',                       author: 'Frank Herbert',       status: 'in-library'                    },
  { id: '4',  title: 'Kindred',                    author: 'Octavia Butler',      status: 'in-library'                    },
  { id: '5',  title: 'Convenience Store Woman',    author: 'Sayaka Murata',       status: 'in-library'                    },
  { id: '6',  title: "Giovanni's Room",            author: 'James Baldwin',       status: 'in-library'                    },
  { id: '7',  title: 'Normal People',              author: 'Sally Rooney',        status: 'borrowing',  dueDate: 'Apr 2'  },
  { id: '8',  title: 'The Midnight Library',       author: 'Matt Haig',           status: 'borrowing',  dueDate: 'Mar 30' },
];

const STATUS_CONFIG: Record<BookStatus, { label: string; color: string }> = {
  'in-library': { label: 'In Library', color: Colors.teal    },
  'lending':    { label: 'Lending',    color: Colors.purple  },
  'borrowing':  { label: 'Borrowing',  color: Colors.teal    },
  'overdue':    { label: 'Overdue',    color: '#C0392B'      },
};

// Chip accent color (border + text when inactive; fill when active)
const CHIP_COLORS: Record<string, string> = {
  all:       Colors.black,
  borrowing: Colors.teal,
  lending:   Colors.purple,
};

// Active background (Books uses dark grey, others use the accent color)
const CHIP_ACTIVE_BG: Record<string, string> = {
  all:       '#333',
  borrowing: Colors.teal,
  lending:   Colors.purple,
};

export default function LibraryScreen() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'borrowing' | 'lending'>('all');

  const lendingCount   = BOOKS.filter(b => b.status === 'lending' || b.status === 'overdue').length;
  const borrowingCount = BOOKS.filter(b => b.status === 'borrowing').length;

  const CHIPS = [
    { key: 'all'       as const, label: 'Books',     value: BOOKS.length  },
    { key: 'borrowing' as const, label: 'Borrowing', value: borrowingCount },
    { key: 'lending'   as const, label: 'Lending',   value: lendingCount   },
  ];

  const filtered = activeFilter === 'all'
    ? BOOKS
    : activeFilter === 'lending'
      ? BOOKS.filter(b => b.status === 'lending' || b.status === 'overdue')
      : BOOKS.filter(b => b.status === activeFilter);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.heading}>Your Library</Text>
          <AnimatedButton style={[styles.addButton, Shadow]} onPress={() => router.push('/add-book')}>
            <MaterialIcons name="add" size={18} color={Colors.white} />
            <Text style={styles.addButtonText}>Add Book</Text>
          </AnimatedButton>
        </View>

        {/* Semantic filter chips */}
        <View style={styles.chips}>
          {CHIPS.map((chip) => {
            const active = activeFilter === chip.key;
            const accent = CHIP_COLORS[chip.key];
            const activeBg = CHIP_ACTIVE_BG[chip.key];
            return (
              <TouchableOpacity
                key={chip.key}
                style={[styles.chip, { borderColor: accent, backgroundColor: active ? activeBg : Colors.white }, Shadow]}
                onPress={() => setActiveFilter(chip.key)}
              >
                <Text style={[styles.chipValue, { color: active ? Colors.white : accent }]}>
                  {chip.value}
                </Text>
                <Text style={[styles.chipLabel, { color: active ? Colors.white : accent }]}>
                  {chip.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons name="menu-book" size={32} color={Colors.lightGray} />
            <Text style={styles.emptyText}>Nothing here yet</Text>
          </View>
        ) : (
          filtered.map((book) => {
            const status = STATUS_CONFIG[book.status];
            return (
              <TouchableOpacity
                key={book.id}
                style={styles.card}
                onPress={() => router.push(`/book/${book.id}`)}
              >
                <BookCover title={book.title} author={book.author} width={60} height={80} />
                <View style={styles.cardInfo}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookAuthor}>{book.author}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
                    <Text style={styles.statusText}>{status.label}</Text>
                    {book.dueDate && (
                      <Text style={styles.dueDateText}> · {book.dueDate}</Text>
                    )}
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={Colors.gray} style={styles.chevron} />
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  content: { padding: 16, paddingRight: 20, paddingBottom: 32 },

  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 16,
  },
  heading: { fontSize: 24, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black },
  addButton: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.teal, borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, paddingHorizontal: 14, paddingVertical: 8,
  },
  addButtonText: { color: Colors.white, fontWeight: '700', fontFamily: Font.bold, fontSize: 13 },

  // Filter chips
  chips: { flexDirection: 'row', gap: 10, marginBottom: 20, paddingBottom: 4 },
  chip: {
    flex: 1, borderWidth: 1.5, borderRadius: Radius.card,
    padding: 12, alignItems: 'center',
  },
  chipValue: { fontSize: 22, fontWeight: '800', fontFamily: Font.extraBold },
  chipLabel: { fontSize: 11, fontFamily: Font.bold, fontWeight: '600', marginTop: 2 },

  // Book cards
  card: {
    flexDirection: 'row', borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    padding: 10, marginBottom: 12, alignItems: 'center', gap: 12,
  },
  cardInfo: { flex: 1, gap: 4 },
  bookTitle: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold, color: Colors.black },
  bookAuthor: { fontSize: 12, fontFamily: Font.regular, color: Colors.gray },
  statusBadge: {
    flexDirection: 'row', alignSelf: 'flex-start',
    borderRadius: Radius.pill, borderWidth: 1, borderColor: Colors.black,
    paddingHorizontal: 10, paddingVertical: 3, marginTop: 4,
  },
  statusText: { fontSize: 11, fontWeight: '700', fontFamily: Font.bold, color: Colors.white },
  dueDateText: { fontSize: 11, fontFamily: Font.regular, color: Colors.white, opacity: 0.85 },
  chevron: { marginRight: 4 },

  // Empty state
  empty: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: Colors.lightGray,
    borderRadius: Radius.card, padding: 16,
    backgroundColor: Colors.white,
  },
  emptyText: { fontSize: 13, fontFamily: Font.regular, color: Colors.gray },
});
