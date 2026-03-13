import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useMemo } from 'react';
import { Colors, Shadow, Radius, Font } from '../../constants/theme';
import { WheelPicker } from '../../components/WheelPicker';
import { AnimatedButton } from '../../components/AnimatedButton';
import { Avatar } from '../../components/Avatar';
import { getOrCreateThread, addBorrowRequest } from '../../store/threads';

const LENDERS: Record<string, { name: string; distance: string }> = {
  '1': { name: 'Jaydon Workman', distance: '0.3 mi' },
  '2': { name: 'Priya Okonkwo', distance: '0.6 mi' },
  '4': { name: 'Sasha Volkov', distance: '1.4 mi' },
};

function generateDates(count: number): string[] {
  const dates: string[] = [];
  const base = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    dates.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  return dates;
}

export default function BorrowRequestScreen() {
  const { lenderId, bookTitle, bookAuthor } = useLocalSearchParams<{
    lenderId: string;
    bookTitle?: string;
    bookAuthor?: string;
  }>();

  const lender = LENDERS[lenderId] ?? { name: 'Neighbor', distance: '—' };
  const dates = useMemo(() => generateDates(90), []);

  const [fromIndex, setFromIndex] = useState(0);
  const [untilIndex, setUntilIndex] = useState(14);
  const [note, setNote] = useState('');

  const handleFromChange = (i: number) => {
    setFromIndex(i);
    if (untilIndex <= i + 6) setUntilIndex(i + 14);
  };

  const handleSend = () => {
    const thread = getOrCreateThread(lenderId, lender.name);
    addBorrowRequest(thread, {
      id: `req_${Date.now()}`,
      fromName: 'Avery Whitted',
      bookTitle: bookTitle ?? 'Unknown Book',
      bookAuthor: bookAuthor,
      fromDate: dates[fromIndex],
      untilDate: dates[untilIndex],
      note: note.trim() || undefined,
      status: 'pending',
    });
    // Close modal and navigate to the thread
    router.back();
    router.push(`/thread/${thread.id}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.heading}>Request to Borrow</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={Colors.black} />
          </TouchableOpacity>
        </View>

        {/* Lender card */}
        <View style={styles.lenderCard}>
          <Avatar name={lender.name} size={44} />
          <View style={styles.lenderInfo}>
            <Text style={styles.lenderName}>{lender.name}</Text>
            <View style={styles.lenderMeta}>
              <MaterialIcons name="place" size={12} color={Colors.gray} />
              <Text style={styles.lenderDistance}>{lender.distance} away</Text>
            </View>
          </View>
          {bookTitle && (
            <View style={styles.bookCoverSmall}>
              <Text style={styles.bookCoverText} numberOfLines={3}>{bookTitle}</Text>
            </View>
          )}
        </View>

        {/* Wheel date picker */}
        <View style={styles.datePickerCard}>
          <View style={styles.datePickerColumn}>
            <Text style={styles.datePickerLabel}>From</Text>
            <WheelPicker
              items={dates}
              selectedIndex={fromIndex}
              onSelect={handleFromChange}
              monthColor={Colors.teal}
              dayColor={Colors.black}
              dimColor="rgba(0,0,0,0.25)"
              indicatorBorder="rgba(0,0,0,0.08)"
              indicatorBg="rgba(0,0,0,0.03)"
            />
          </View>
          <View style={styles.datePickerDivider} />
          <View style={styles.datePickerColumn}>
            <Text style={styles.datePickerLabel}>Until</Text>
            <WheelPicker
              items={dates}
              selectedIndex={untilIndex}
              onSelect={(i) => setUntilIndex(Math.max(fromIndex + 7, i))}
              monthColor={Colors.teal}
              dayColor={Colors.black}
              dimColor="rgba(0,0,0,0.25)"
              indicatorBorder="rgba(0,0,0,0.08)"
              indicatorBg="rgba(0,0,0,0.03)"
            />
          </View>
        </View>

        {/* Optional note */}
        <Text style={styles.sectionLabel}>Add a note (optional)</Text>
        <View style={styles.noteInput}>
          <TextInput
            style={styles.noteTextInput}
            placeholder="Hey! I've been wanting to read this for ages..."
            placeholderTextColor={Colors.gray}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <AnimatedButton style={[styles.sendButton, Shadow]} onPress={handleSend}>
          <MaterialIcons name="send" size={20} color={Colors.white} />
          <Text style={styles.sendButtonText}>Send Request</Text>
        </AnimatedButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16 },
  topRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  heading: { fontSize: 24, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black },
  lenderCard: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    padding: 12, gap: 12, marginBottom: 20,
  },
  lenderInfo: { flex: 1, gap: 3 },
  lenderName: { fontSize: 15, fontWeight: '700', fontFamily: Font.bold, color: Colors.black },
  lenderMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  lenderDistance: { fontSize: 12, fontFamily: Font.regular, color: Colors.gray },
  bookCoverSmall: {
    width: 40, height: 55, borderRadius: 6,
    borderWidth: 1, borderColor: Colors.black, backgroundColor: Colors.teal,
    justifyContent: 'flex-end', padding: 3,
  },
  bookCoverText: { fontSize: 7, color: 'rgba(255,255,255,0.9)', fontFamily: Font.bold },
  datePickerCard: {
    flexDirection: 'row',
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    marginBottom: 24, overflow: 'hidden',
  },
  datePickerColumn: { flex: 1 },
  datePickerLabel: {
    fontSize: 11, fontWeight: '700', fontFamily: Font.bold,
    color: Colors.black, textTransform: 'uppercase', letterSpacing: 0.8,
    textAlign: 'center', paddingTop: 14, paddingBottom: 4,
  },
  datePickerDivider: { width: 1, backgroundColor: 'rgba(0,0,0,0.1)' },
  sectionLabel: {
    fontSize: 13, fontWeight: '800', fontFamily: Font.extraBold,
    color: Colors.gray, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10,
  },
  noteInput: {
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    padding: 12, marginBottom: 16,
  },
  noteTextInput: {
    fontSize: 14, fontFamily: Font.regular,
    color: Colors.black, minHeight: 80, textAlignVertical: 'top',
  },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 16, backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.black,
  },
  sendButton: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    backgroundColor: Colors.purple, borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, paddingVertical: 14,
  },
  sendButtonText: { fontSize: 15, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.white },
});
