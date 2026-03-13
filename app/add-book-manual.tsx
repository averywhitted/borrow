import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Colors, Shadow, Radius, Font } from '../constants/theme';
import { AnimatedButton } from '../components/AnimatedButton';

const GENRES = [
  'Literary Fiction', 'Historical Fiction', 'Mystery', 'Thriller',
  'Sci-Fi', 'Fantasy', 'Horror', 'Romance', 'LGBTQ+',
  'Non-Fiction', 'Biography', 'Memoir', 'Self-Help', 'Essay',
  'Graphic Novel', 'Poetry', 'Classics', 'Young Adult', 'Other',
];
const CONDITIONS = ['Like New', 'Good', 'Worn'];

export default function AddBookManualScreen() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const toggleGenre = (g: string) =>
    setGenres((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  const [year, setYear] = useState('');
  const [condition, setCondition] = useState('');
  const [notes, setNotes] = useState('');
  const [added, setAdded] = useState(false);

  const canSubmit = title.trim().length > 0 && author.trim().length > 0;

  // ── Success state ────────────────────────────────────────────────────────────
  if (added) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successScreen}>
          <View style={[styles.successIcon, Shadow]}>
            <MaterialIcons name="check" size={36} color={Colors.white} />
          </View>
          <Text style={styles.successTitle}>Added to Library!</Text>
          <Text style={styles.successSubtitle}>
            <Text style={{ fontFamily: Font.extraBold }}>{title}</Text> is now visible to neighbors.
          </Text>
          <AnimatedButton style={[styles.doneButton, Shadow]} onPress={() => router.back()}>
            <Text style={styles.doneButtonText}>Done</Text>
          </AnimatedButton>
          <TouchableOpacity onPress={() => {
            setTitle(''); setAuthor(''); setGenres([]);
            setYear(''); setCondition(''); setNotes('');
            setAdded(false);
          }}>
            <Text style={styles.addAnotherText}>+ Add another book</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Header */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.heading}>Add Manually</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">

          {/* Title */}
          <View style={styles.field}>
            <Text style={styles.label}>Title <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Piranesi"
              placeholderTextColor={Colors.gray}
              value={title}
              onChangeText={setTitle}
              autoFocus
              autoCorrect={false}
            />
          </View>

          {/* Author */}
          <View style={styles.field}>
            <Text style={styles.label}>Author <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Susanna Clarke"
              placeholderTextColor={Colors.gray}
              value={author}
              onChangeText={setAuthor}
              autoCorrect={false}
            />
          </View>

          {/* Genre */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Genre{genres.length > 0 && (
                <Text style={styles.genreCount}> · {genres.length} selected</Text>
              )}
            </Text>
            <View style={styles.genreGrid}>
              {GENRES.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.pill, genres.includes(g) && styles.pillSelected]}
                  onPress={() => toggleGenre(g)}
                >
                  <Text style={[styles.pillText, genres.includes(g) && styles.pillTextSelected]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Year */}
          <View style={styles.field}>
            <Text style={styles.label}>Year Published</Text>
            <TextInput
              style={[styles.input, styles.inputShort]}
              placeholder="e.g. 2020"
              placeholderTextColor={Colors.gray}
              value={year}
              onChangeText={setYear}
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>

          {/* Condition */}
          <View style={styles.field}>
            <Text style={styles.label}>Condition</Text>
            <View style={styles.conditionRow}>
              {CONDITIONS.map((c) => (
                <AnimatedButton
                  key={c}
                  style={[styles.conditionPill, condition === c && styles.conditionPillSelected, Shadow]}
                  onPress={() => setCondition(condition === c ? '' : c)}
                >
                  <Text style={[styles.conditionText, condition === c && styles.conditionTextSelected]}>{c}</Text>
                </AnimatedButton>
              ))}
            </View>
          </View>

          {/* Description */}
          <View style={styles.field}>
            <Text style={styles.label}>Description <Text style={styles.optional}>(optional)</Text></Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Any details about this copy…"
              placeholderTextColor={Colors.gray}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

        </ScrollView>

        {/* Bottom bar */}
        <View style={styles.bottomBar}>
          <AnimatedButton
            style={[styles.addButton, !canSubmit && styles.addButtonDisabled, Shadow]}
            onPress={() => canSubmit && setAdded(true)}
            disabled={!canSubmit}
          >
            <MaterialIcons name="add" size={20} color={Colors.white} />
            <Text style={styles.addButtonText}>Add to Library</Text>
          </AnimatedButton>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },

  topRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.black,
    backgroundColor: Colors.background,
  },
  heading: { fontSize: 18, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black },

  form: { padding: 16, gap: 20, paddingBottom: 8 },

  field: { gap: 8 },
  label: { fontSize: 12, fontWeight: '700', fontFamily: Font.bold, color: Colors.black, textTransform: 'uppercase', letterSpacing: 0.6 },
  required: { color: Colors.teal },
  optional: { color: Colors.gray, fontWeight: '400', fontFamily: Font.regular, textTransform: 'none', letterSpacing: 0 },

  input: {
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 14, fontFamily: Font.regular, color: Colors.black,
  },
  inputShort: { width: 120 },
  inputMultiline: {
    height: 88, paddingTop: 11,
  },

  // Genre grid
  genreGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
  },
  genreCount: {
    fontSize: 11, fontFamily: Font.regular, color: Colors.teal,
    fontWeight: '400', textTransform: 'none', letterSpacing: 0,
  },
  pill: {
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.pill, backgroundColor: Colors.white,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  pillSelected: { backgroundColor: '#333' },
  pillText: { fontSize: 13, fontWeight: '600', fontFamily: Font.bold, color: Colors.black },
  pillTextSelected: { color: Colors.white },

  // Condition pills
  conditionRow: { flexDirection: 'row', gap: 10 },
  conditionPill: {
    borderWidth: 1, borderColor: Colors.black, borderRadius: Radius.pill,
    paddingHorizontal: 16, paddingVertical: 8, backgroundColor: Colors.white,
  },
  conditionPillSelected: { backgroundColor: '#333' },
  conditionText: { fontSize: 13, fontWeight: '600', fontFamily: Font.bold, color: Colors.black },
  conditionTextSelected: { color: Colors.white },

  // Bottom bar
  bottomBar: {
    padding: 16, borderTopWidth: 1, borderTopColor: Colors.black,
    backgroundColor: Colors.white,
  },
  addButton: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    backgroundColor: Colors.teal, borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, paddingVertical: 14,
  },
  addButtonDisabled: { backgroundColor: Colors.lightGray, borderColor: Colors.lightGray },
  addButtonText: { fontSize: 15, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.white },

  // Success
  successScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
  successIcon: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.teal,
    borderWidth: 1, borderColor: Colors.black, justifyContent: 'center', alignItems: 'center',
  },
  successTitle: { fontSize: 24, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black },
  successSubtitle: { fontSize: 14, fontFamily: Font.regular, color: Colors.gray, textAlign: 'center', lineHeight: 21 },
  doneButton: {
    backgroundColor: Colors.black, borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, paddingHorizontal: 40, paddingVertical: 14, marginTop: 8,
  },
  doneButtonText: { fontSize: 15, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.white },
  addAnotherText: { fontSize: 13, fontWeight: '600', fontFamily: Font.bold, color: Colors.teal },
});
