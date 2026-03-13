import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Colors, Shadow, Radius } from '../constants/theme';

const MOCK_RESULTS = [
  { id: 'b1', title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', genre: 'Literary Fiction' },
  { id: 'b2', title: 'The Covenant of Water', author: 'Abraham Verghese', genre: 'Historical Fiction' },
  { id: 'b3', title: 'Intermezzo', author: 'Sally Rooney', genre: 'Literary Fiction' },
  { id: 'b4', title: 'James', author: 'Percival Everett', genre: 'Literary Fiction' },
  { id: 'b5', title: 'The Women', author: 'Kristin Hannah', genre: 'Historical Fiction' },
  { id: 'b6', title: 'Orbital', author: 'Samantha Harvey', genre: 'Literary Fiction' },
  { id: 'b7', title: 'All Fours', author: 'Miranda July', genre: 'Literary Fiction' },
  { id: 'b8', title: 'The God of the Woods', author: 'Lauren Fox', genre: 'Mystery' },
];

type Book = typeof MOCK_RESULTS[number];

export default function AddBookScreen() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Book | null>(null);
  const [added, setAdded] = useState(false);

  const results = query.length > 1
    ? MOCK_RESULTS.filter(
        (b) =>
          b.title.toLowerCase().includes(query.toLowerCase()) ||
          b.author.toLowerCase().includes(query.toLowerCase())
      )
    : MOCK_RESULTS;

  if (added && selected) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successScreen}>
          <View style={[styles.successIcon, Shadow]}>
            <MaterialIcons name="check" size={36} color={Colors.white} />
          </View>
          <Text style={styles.successTitle}>Added to Library!</Text>
          <Text style={styles.successSubtitle}>
            <Text style={{ fontWeight: '800' }}>{selected.title}</Text> is now in your library and visible to neighbors.
          </Text>
          <TouchableOpacity
            style={[styles.doneButton, Shadow]}
            onPress={() => router.back()}
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setAdded(false); setSelected(null); setQuery(''); }}>
            <Text style={styles.addAnotherText}>+ Add another book</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (selected) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backRow} onPress={() => setSelected(null)}>
            <MaterialIcons name="arrow-back" size={20} color={Colors.black} />
            <Text style={styles.backText}>Search results</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Confirm Book</Text>

          <View style={[styles.confirmCard, Shadow]}>
            <View style={styles.confirmCover} />
            <View style={styles.confirmInfo}>
              <View style={[styles.genrePill, Shadow]}>
                <Text style={styles.genreText}>{selected.genre}</Text>
              </View>
              <Text style={styles.confirmTitle}>{selected.title}</Text>
              <Text style={styles.confirmAuthor}>{selected.author}</Text>
            </View>
          </View>

          <View style={[styles.infoBox, Shadow]}>
            <MaterialIcons name="info-outline" size={16} color={Colors.teal} />
            <Text style={styles.infoText}>
              Adding this book makes it visible to neighbors who can request to borrow it.
            </Text>
          </View>

          <View style={styles.conditionSection}>
            <Text style={styles.conditionLabel}>Condition</Text>
            <View style={styles.conditionRow}>
              {['Like New', 'Good', 'Worn'].map((c) => (
                <TouchableOpacity key={c} style={[styles.conditionPill, Shadow]}>
                  <Text style={styles.conditionText}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.addButton, Shadow]}
            onPress={() => setAdded(true)}
          >
            <MaterialIcons name="add" size={20} color={Colors.white} />
            <Text style={styles.addButtonText}>Add to Library</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text style={styles.heading}>Add a Book</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={Colors.black} />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchBar, Shadow]}>
          <MaterialIcons name="search" size={18} color={Colors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title or author"
            placeholderTextColor={Colors.gray}
            value={query}
            onChangeText={setQuery}
            autoFocus
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <MaterialIcons name="close" size={18} color={Colors.gray} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.resultsLabel}>
          {query.length > 1 ? `${results.length} results` : 'Popular right now'}
        </Text>

        <ScrollView contentContainerStyle={styles.resultsList}>
          {results.map((book) => (
            <TouchableOpacity
              key={book.id}
              style={[styles.resultRow, Shadow]}
              onPress={() => setSelected(book)}
            >
              <View style={styles.resultCover} />
              <View style={styles.resultInfo}>
                <Text style={styles.resultTitle}>{book.title}</Text>
                <Text style={styles.resultAuthor}>{book.author}</Text>
                <View style={[styles.genrePillSmall]}>
                  <Text style={styles.genreTextSmall}>{book.genre}</Text>
                </View>
              </View>
              <MaterialIcons name="add-circle-outline" size={24} color={Colors.teal} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: 16 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: { fontSize: 24, fontWeight: '800', color: Colors.black },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.black },
  resultsLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  resultsList: { gap: 10, paddingBottom: 32 },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.white,
    padding: 10,
    gap: 12,
  },
  resultCover: {
    width: 48,
    height: 64,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.lightGray,
  },
  resultInfo: { flex: 1, gap: 3 },
  resultTitle: { fontSize: 14, fontWeight: '700', color: Colors.black },
  resultAuthor: { fontSize: 12, color: Colors.gray },
  genrePillSmall: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.lightGray,
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
  },
  genreTextSmall: { fontSize: 10, fontWeight: '600', color: Colors.gray },

  // Confirm screen
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  backText: { fontSize: 14, fontWeight: '600', color: Colors.black },
  confirmCard: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.white,
    padding: 14,
    gap: 14,
    marginBottom: 14,
    alignItems: 'flex-start',
  },
  confirmCover: {
    width: 80,
    height: 110,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.teal,
  },
  confirmInfo: { flex: 1, gap: 8 },
  genrePill: {
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: Colors.white,
  },
  genreText: { fontSize: 11, fontWeight: '700', color: Colors.black },
  confirmTitle: { fontSize: 18, fontWeight: '800', color: Colors.black },
  confirmAuthor: { fontSize: 13, color: Colors.gray },
  infoBox: {
    flexDirection: 'row',
    gap: 10,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.white,
    padding: 12,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  infoText: { flex: 1, fontSize: 13, color: Colors.black, lineHeight: 19 },
  conditionSection: { gap: 10 },
  conditionLabel: { fontSize: 14, fontWeight: '700', color: Colors.black },
  conditionRow: { flexDirection: 'row', gap: 10 },
  conditionPill: {
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.white,
  },
  conditionText: { fontSize: 13, fontWeight: '600', color: Colors.black },
  bottomBar: {
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: Colors.black,
    backgroundColor: Colors.white,
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.teal,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    paddingVertical: 14,
  },
  addButtonText: { fontSize: 15, fontWeight: '800', color: Colors.white },

  // Success screen
  successScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.teal,
    borderWidth: 2,
    borderColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: { fontSize: 24, fontWeight: '800', color: Colors.black },
  successSubtitle: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 21,
  },
  doneButton: {
    backgroundColor: Colors.black,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    paddingHorizontal: 40,
    paddingVertical: 14,
    marginTop: 8,
  },
  doneButtonText: { fontSize: 15, fontWeight: '800', color: Colors.white },
  addAnotherText: { fontSize: 13, fontWeight: '600', color: Colors.teal },
});
