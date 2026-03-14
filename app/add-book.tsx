import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useMemo } from 'react';
import { Radius, Font, getColors, getShadow } from '../constants/theme';
import { BookCover } from '../components/BookCover';
import { AnimatedButton } from '../components/AnimatedButton';
import { useIsDark } from '../store/theme';

const MOCK_RESULTS = [
  {
    id: 'b1', title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin',
    genre: 'Literary Fiction', year: 2022, pages: 480,
    description: 'Two friends collaborate as video game designers across decades, exploring identity, loss, and love.',
  },
  {
    id: 'b2', title: 'The Covenant of Water', author: 'Abraham Verghese',
    genre: 'Historical Fiction', year: 2023, pages: 736,
    description: 'A multigenerational saga set in South India, spanning a century of faith, medicine, and water.',
  },
  {
    id: 'b3', title: 'Intermezzo', author: 'Sally Rooney',
    genre: 'Literary Fiction', year: 2024, pages: 464,
    description: "Two brothers navigate grief and love after their father's death, each pursuing connection in different ways.",
  },
  {
    id: 'b4', title: 'James', author: 'Percival Everett',
    genre: 'Literary Fiction', year: 2024, pages: 320,
    description: "A reimagining of Huckleberry Finn from Jim's perspective, exploring race and freedom in antebellum America.",
  },
  {
    id: 'b5', title: 'The Women', author: 'Kristin Hannah',
    genre: 'Historical Fiction', year: 2024, pages: 480,
    description: "A young woman serves as an Army nurse in Vietnam and returns home to a country that doesn't recognize her sacrifice.",
  },
  {
    id: 'b6', title: 'Orbital', author: 'Samantha Harvey',
    genre: 'Literary Fiction', year: 2023, pages: 224,
    description: 'Six astronauts orbit Earth over a single day, contemplating the planet below and what it means to be human.',
  },
  {
    id: 'b7', title: 'All Fours', author: 'Miranda July',
    genre: 'Literary Fiction', year: 2024, pages: 368,
    description: 'A woman in her forties abandons a cross-country trip and stays in a motel room, undergoing a radical transformation.',
  },
  {
    id: 'b8', title: 'The God of the Woods', author: 'Lauren Fox',
    genre: 'Mystery', year: 2024, pages: 400,
    description: 'When a girl vanishes from an Adirondacks summer camp, decades of hidden family secrets begin to surface.',
  },
];

type Book = typeof MOCK_RESULTS[number];

export default function AddBookScreen() {
  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Book | null>(null);
  const [added, setAdded] = useState(false);
  const [condition, setCondition] = useState('');

  const results = query.length > 1
    ? MOCK_RESULTS.filter(b =>
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.author.toLowerCase().includes(query.toLowerCase()))
    : MOCK_RESULTS;

  // ── Success state ───────────────────────────────────────────────────────────
  if (added && selected) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successScreen}>
          <View style={[styles.successIcon, getShadow(isDark)]}>
            <MaterialIcons name="check" size={36} color={C.white} />
          </View>
          <Text style={styles.successTitle}>Added to Library!</Text>
          <Text style={styles.successSubtitle}>
            <Text style={{ fontFamily: Font.extraBold }}>{selected.title}</Text> is now visible to neighbors.
          </Text>
          <AnimatedButton style={[styles.doneButton, getShadow(isDark)]} onPress={() => router.back()}>
            <Text style={styles.doneButtonText}>Done</Text>
          </AnimatedButton>
          <TouchableOpacity onPress={() => { setAdded(false); setSelected(null); setQuery(''); }}>
            <Text style={styles.addAnotherText}>+ Add another book</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Confirm state ───────────────────────────────────────────────────────────
  if (selected) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backRow} onPress={() => setSelected(null)}>
            <MaterialIcons name="arrow-back" size={20} color={C.black} />
            <Text style={styles.backText}>Search results</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Confirm Book</Text>

          <View style={[styles.confirmCard, getShadow(isDark)]}>
            <BookCover title={selected.title} author={selected.author} width={80} height={110} borderRadius={8} />
            <View style={styles.confirmInfo}>
              <View style={styles.genrePill}>
                <Text style={styles.genreText}>{selected.genre}</Text>
              </View>
              <Text style={styles.confirmTitle}>{selected.title}</Text>
              <Text style={styles.confirmAuthor}>{selected.author}</Text>
              <Text style={styles.confirmMeta}>{selected.year} · {selected.pages} pages</Text>
              <Text style={styles.confirmDescription} numberOfLines={3}>{selected.description}</Text>
            </View>
          </View>

          <View style={[styles.infoBox, getShadow(isDark)]}>
            <MaterialIcons name="info-outline" size={16} color={C.teal} />
            <Text style={styles.infoText}>
              Adding this book makes it visible to neighbors who can request to borrow it.
            </Text>
          </View>

          <View style={styles.conditionSection}>
            <Text style={styles.conditionLabel}>Condition</Text>
            <View style={styles.conditionRow}>
              {['Like New', 'Good', 'Worn'].map((c) => (
                <AnimatedButton
                  key={c}
                  style={[styles.conditionPill, condition === c && styles.conditionPillSelected, getShadow(isDark)]}
                  onPress={() => setCondition(condition === c ? '' : c)}
                >
                  <Text style={[styles.conditionText, condition === c && styles.conditionTextSelected]}>{c}</Text>
                </AnimatedButton>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.bottomBar}>
          <AnimatedButton style={[styles.addButton, getShadow(isDark)]} onPress={() => setAdded(true)}>
            <MaterialIcons name="add" size={20} color={C.white} />
            <Text style={styles.addButtonText}>Add to Library</Text>
          </AnimatedButton>
        </View>
      </SafeAreaView>
    );
  }

  // ── Search state ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text style={styles.heading}>Add a Book</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={C.black} />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchBar, getShadow(isDark)]}>
          <MaterialIcons name="search" size={18} color={C.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title or author"
            placeholderTextColor={C.gray}
            value={query}
            onChangeText={setQuery}
            autoFocus
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <MaterialIcons name="close" size={18} color={C.gray} />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.resultsLabel}>
          {query.length > 1 ? `${results.length} results` : 'Popular right now'}
        </Text>

        {/* Results list — leaves room for the bottom bar */}
        <ScrollView contentContainerStyle={styles.resultsList}>
          {results.map((book) => (
            <AnimatedButton
              key={book.id}
              style={[styles.resultRow, getShadow(isDark)]}
              onPress={() => setSelected(book)}
            >
              <BookCover title={book.title} author={book.author} width={48} height={64} />
              <View style={styles.resultInfo}>
                <Text style={styles.resultTitle}>{book.title}</Text>
                <Text style={styles.resultAuthor}>{book.author}</Text>
                <View style={styles.genrePillSmall}>
                  <Text style={styles.genreTextSmall}>{book.genre}</Text>
                </View>
              </View>
              <View style={[styles.addCardButton]}>
                <MaterialIcons name="add" size={16} color={C.white} />
              </View>
            </AnimatedButton>
          ))}
        </ScrollView>
      </View>

      {/* Sticky bottom bar: manual + scan */}
      <View style={styles.bottomBar}>
        <AnimatedButton
          style={[styles.bottomAction, getShadow(isDark)]}
          onPress={() => router.push('/add-book-manual')}
        >
          <MaterialIcons name="edit" size={18} color={C.black} />
          <Text style={styles.bottomActionText}>Manual</Text>
        </AnimatedButton>
        <AnimatedButton
          style={[styles.bottomActionPrimary, getShadow(isDark)]}
          onPress={() => router.push('/scan-barcode')}
        >
          <MaterialCommunityIcons name="barcode" size={22} color={C.white} />
          <Text style={styles.bottomActionPrimaryText}>Scan Barcode</Text>
        </AnimatedButton>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: C.background },
    container: { flex: 1, padding: 16 },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    heading: { fontSize: 24, fontWeight: '800', fontFamily: Font.extraBold, color: C.black },
    searchBar: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      borderWidth: 1, borderColor: C.black, borderRadius: Radius.card,
      backgroundColor: C.white, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12,
    },
    searchInput: { flex: 1, fontSize: 14, fontFamily: Font.regular, color: C.black },
    resultsLabel: {
      fontSize: 12, fontWeight: '700', fontFamily: Font.bold,
      color: C.gray, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10,
    },
    resultsList: { gap: 10, paddingBottom: 16, paddingRight: 4 },
    resultRow: {
      flexDirection: 'row', alignItems: 'center',
      borderWidth: 1, borderColor: C.black, borderRadius: Radius.card,
      backgroundColor: C.white, padding: 10, gap: 12,
    },
    resultInfo: { flex: 1, gap: 3 },
    resultTitle: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold, color: C.black },
    resultAuthor: { fontSize: 12, fontFamily: Font.regular, color: C.gray },
    genrePillSmall: {
      alignSelf: 'flex-start', backgroundColor: C.lightGray,
      borderRadius: Radius.pill, paddingHorizontal: 8, paddingVertical: 2, marginTop: 2,
    },
    genreTextSmall: { fontSize: 10, fontWeight: '600', fontFamily: Font.bold, color: C.gray },

    // Add button inside each result card
    addCardButton: {
      width: 36, height: 36,
      borderRadius: Radius.card,
      backgroundColor: C.teal,
      borderWidth: 1, borderColor: C.black,
      alignItems: 'center', justifyContent: 'center',
    },

    // Confirm view
    backRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
    backText: { fontSize: 14, fontWeight: '600', fontFamily: Font.bold, color: C.black },
    confirmCard: {
      flexDirection: 'row',
      borderWidth: 1, borderColor: C.black, borderRadius: Radius.card,
      backgroundColor: C.white, padding: 14, gap: 14, marginBottom: 14, alignItems: 'flex-start',
    },
    confirmInfo: { flex: 1, gap: 8 },
    genrePill: {
      alignSelf: 'flex-start', borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.pill, paddingHorizontal: 10, paddingVertical: 3, backgroundColor: C.white,
    },
    genreText: { fontSize: 11, fontWeight: '700', fontFamily: Font.bold, color: C.black },
    confirmTitle: { fontSize: 18, fontWeight: '800', fontFamily: Font.extraBold, color: C.black },
    confirmAuthor: { fontSize: 13, fontFamily: Font.regular, color: C.gray },
    confirmMeta: { fontSize: 11, fontFamily: Font.regular, color: C.gray },
    confirmDescription: { fontSize: 12, fontFamily: Font.regular, color: C.gray, lineHeight: 17 },
    infoBox: {
      flexDirection: 'row', gap: 10,
      borderWidth: 1, borderColor: C.black, borderRadius: Radius.card,
      backgroundColor: C.white, padding: 12, marginBottom: 20, alignItems: 'flex-start',
    },
    infoText: { flex: 1, fontSize: 13, fontFamily: Font.regular, color: C.black, lineHeight: 19 },
    conditionSection: { gap: 10 },
    conditionLabel: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold, color: C.black },
    conditionRow: { flexDirection: 'row', gap: 10, paddingBottom: 4 },
    conditionPill: {
      borderWidth: 1, borderColor: C.black, borderRadius: Radius.pill,
      paddingHorizontal: 16, paddingVertical: 8, backgroundColor: C.white,
    },
    conditionPillSelected: { backgroundColor: C.pillActive, borderColor: C.pillActive },
    conditionText: { fontSize: 13, fontWeight: '600', fontFamily: Font.bold, color: C.black },
    conditionTextSelected: { color: C.white },

    // Shared bottom bar
    bottomBar: {
      flexDirection: 'row', gap: 10,
      padding: 16, borderTopWidth: 1, borderTopColor: C.black, backgroundColor: C.white,
    },
    bottomAction: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      borderWidth: 1, borderColor: C.black, borderRadius: Radius.card,
      backgroundColor: C.white, paddingVertical: 12, paddingHorizontal: 16,
    },
    bottomActionText: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold, color: C.black },
    bottomActionPrimary: {
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
      borderWidth: 1, borderColor: C.black, borderRadius: Radius.card,
      backgroundColor: C.teal, paddingVertical: 12,
    },
    bottomActionPrimaryText: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold, color: C.white },

    // Add-to-library bottom bar (confirm state) — full width stretch
    addButton: {
      flex: 1,
      flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
      backgroundColor: C.teal, borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card, paddingVertical: 14,
    },
    addButtonText: { fontSize: 15, fontWeight: '800', fontFamily: Font.extraBold, color: C.white },

    // Success state
    successScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
    successIcon: {
      width: 72, height: 72, borderRadius: 36, backgroundColor: C.teal,
      borderWidth: 1, borderColor: C.black, justifyContent: 'center', alignItems: 'center',
    },
    successTitle: { fontSize: 24, fontWeight: '800', fontFamily: Font.extraBold, color: C.black },
    successSubtitle: { fontSize: 14, fontFamily: Font.regular, color: C.gray, textAlign: 'center', lineHeight: 21 },
    doneButton: {
      backgroundColor: C.pillActive, borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card, paddingHorizontal: 40, paddingVertical: 14, marginTop: 8,
    },
    doneButtonText: { fontSize: 15, fontWeight: '800', fontFamily: Font.extraBold, color: C.white },
    addAnotherText: { fontSize: 13, fontWeight: '600', fontFamily: Font.bold, color: C.teal },
  });
}
