import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Shadow, Radius, Font } from '../../constants/theme';
import { BookCover } from '../../components/BookCover';

type BookStatus = 'in-library' | 'on-loan' | 'overdue';

const BOOKS: { id: string; title: string; author: string; status: BookStatus; dueDate?: string }[] = [
  { id: '1', title: 'Piranesi', author: 'Susanna Clarke', status: 'on-loan', dueDate: 'Mar 24' },
  { id: '2', title: 'The Remains of the Day', author: 'Kazuo Ishiguro', status: 'overdue', dueDate: 'Mar 1' },
  { id: '3', title: 'Dune', author: 'Frank Herbert', status: 'in-library' },
  { id: '4', title: 'Kindred', author: 'Octavia Butler', status: 'in-library' },
  { id: '5', title: 'Convenience Store Woman', author: 'Sayaka Murata', status: 'in-library' },
  { id: '6', title: "Giovanni's Room", author: 'James Baldwin', status: 'in-library' },
];

const STATUS_CONFIG = {
  'in-library': { label: 'In Library', color: Colors.teal },
  'on-loan': { label: 'On Loan', color: Colors.purple },
  'overdue': { label: 'Overdue', color: '#C0392B' },
};

export default function LibraryScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.heading}>Your Library</Text>
          <TouchableOpacity style={[styles.addButton, Shadow]} onPress={() => router.push('/add-book')}>
            <MaterialIcons name="add" size={18} color={Colors.white} />
            <Text style={styles.addButtonText}>Add Book</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{BOOKS.length}</Text>
            <Text style={styles.statLabel}>Books</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{BOOKS.filter(b => b.status === 'on-loan' || b.status === 'overdue').length}</Text>
            <Text style={styles.statLabel}>On Loan</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Lent Out</Text>
          </View>
        </View>

        {BOOKS.map((book) => {
          const status = STATUS_CONFIG[book.status];
          return (
            <TouchableOpacity
              key={book.id}
              style={[styles.card, Shadow]}
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
              <MaterialIcons name="chevron-right" size={24} color={Colors.gray} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  heading: { fontSize: 24, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.teal,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addButtonText: { color: Colors.white, fontWeight: '700', fontFamily: Font.bold, fontSize: 13 },
  stats: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.white,
    padding: 12,
    alignItems: 'center',
  },
  statNumber: { fontSize: 22, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black },
  statLabel: { fontSize: 11, fontFamily: Font.bold, color: Colors.gray, fontWeight: '600', marginTop: 2 },
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.white,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    gap: 12,
  },
  cardInfo: { flex: 1, gap: 4 },
  bookTitle: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold, color: Colors.black },
  bookAuthor: { fontSize: 12, fontFamily: Font.regular, color: Colors.gray },
  statusBadge: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: Colors.black,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 4,
  },
  statusText: { fontSize: 11, fontWeight: '700', fontFamily: Font.bold, color: Colors.white },
  dueDateText: { fontSize: 11, fontFamily: Font.regular, color: Colors.white, opacity: 0.85 },
});
