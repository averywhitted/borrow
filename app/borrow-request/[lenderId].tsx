import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useMemo } from 'react';
import { Radius, Font, getColors, getShadow } from '../../constants/theme';
import { AnimatedButton } from '../../components/AnimatedButton';
import { Avatar } from '../../components/Avatar';
import { getOrCreateThread, addBorrowRequest } from '../../store/threads';
import { useIsDark } from '../../store/theme';

const LENDERS: Record<string, { name: string; distance: string }> = {
  '1': { name: 'Jaydon Workman', distance: '0.3 mi' },
  '2': { name: 'Priya Okonkwo', distance: '0.6 mi' },
  '3': { name: 'Carlos Reyes', distance: '1.1 mi' },
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
  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

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
    // Dismiss modal and navigate to the thread
    router.dismiss();
    router.navigate(`/thread/${thread.id}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.heading}>Request to Borrow</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={C.black} />
          </TouchableOpacity>
        </View>

        {/* Lender card */}
        <View style={[styles.lenderCard, getShadow(isDark)]}>
          <Avatar name={lender.name} size={44} />
          <View style={styles.lenderInfo}>
            <Text style={styles.lenderName}>{lender.name}</Text>
            <View style={styles.lenderMeta}>
              <MaterialIcons name="place" size={12} color={C.gray} />
              <Text style={styles.lenderDistance}>{lender.distance} away</Text>
            </View>
          </View>
          {bookTitle && (
            <View style={styles.bookCoverSmall}>
              <Text style={styles.bookCoverText} numberOfLines={3}>{bookTitle}</Text>
            </View>
          )}
        </View>

        {/* Date stepper */}
        <View style={[styles.datePickerCard, getShadow(isDark)]}>
          <View style={styles.datePickerColumn}>
            <Text style={styles.datePickerLabel}>From</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={[styles.stepperBtn, fromIndex === 0 && styles.stepperBtnDisabled]}
                onPress={() => fromIndex > 0 && handleFromChange(fromIndex - 1)}
                activeOpacity={0.6}
              >
                <MaterialIcons name="chevron-left" size={24} color={fromIndex === 0 ? C.lightGray : C.black} />
              </TouchableOpacity>
              <View style={styles.stepperDate}>
                <Text style={[styles.stepperMonth, { color: C.teal }]}>{dates[fromIndex].split(' ')[0]}</Text>
                <Text style={[styles.stepperDay, { color: C.black }]}>{dates[fromIndex].split(' ')[1]}</Text>
              </View>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => handleFromChange(Math.min(fromIndex + 1, dates.length - 15))}
                activeOpacity={0.6}
              >
                <MaterialIcons name="chevron-right" size={24} color={C.black} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.datePickerDivider} />
          <View style={styles.datePickerColumn}>
            <Text style={styles.datePickerLabel}>Until</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={[styles.stepperBtn, untilIndex <= fromIndex + 7 && styles.stepperBtnDisabled]}
                onPress={() => untilIndex > fromIndex + 7 && setUntilIndex(untilIndex - 1)}
                activeOpacity={0.6}
              >
                <MaterialIcons name="chevron-left" size={24} color={untilIndex <= fromIndex + 7 ? C.lightGray : C.black} />
              </TouchableOpacity>
              <View style={styles.stepperDate}>
                <Text style={[styles.stepperMonth, { color: C.teal }]}>{dates[untilIndex].split(' ')[0]}</Text>
                <Text style={[styles.stepperDay, { color: C.black }]}>{dates[untilIndex].split(' ')[1]}</Text>
              </View>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setUntilIndex(Math.min(untilIndex + 1, dates.length - 1))}
                activeOpacity={0.6}
              >
                <MaterialIcons name="chevron-right" size={24} color={C.black} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Optional note */}
        <Text style={styles.sectionLabel}>Add a note (optional)</Text>
        <View style={[styles.noteInput, getShadow(isDark)]}>
          <TextInput
            style={styles.noteTextInput}
            placeholder="Hey! I've been wanting to read this for ages..."
            placeholderTextColor={C.gray}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <AnimatedButton style={[styles.sendButton, getShadow(isDark)]} onPress={handleSend}>
          <MaterialIcons name="send" size={20} color={C.white} />
          <Text style={styles.sendButtonText}>Send Request</Text>
        </AnimatedButton>
      </View>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: C.background },
    content: { padding: 16 },
    topRow: {
      flexDirection: 'row', justifyContent: 'space-between',
      alignItems: 'center', marginBottom: 20,
    },
    heading: { fontSize: 24, fontWeight: '800', fontFamily: Font.extraBold, color: C.black },
    lenderCard: {
      flexDirection: 'row', alignItems: 'center',
      borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card, backgroundColor: C.white,
      padding: 12, gap: 12, marginBottom: 20,
    },
    lenderInfo: { flex: 1, gap: 3 },
    lenderName: { fontSize: 15, fontWeight: '700', fontFamily: Font.bold, color: C.black },
    lenderMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    lenderDistance: { fontSize: 12, fontFamily: Font.regular, color: C.gray },
    bookCoverSmall: {
      width: 40, height: 55, borderRadius: 6,
      borderWidth: 1, borderColor: C.black, backgroundColor: C.teal,
      justifyContent: 'flex-end', padding: 3,
    },
    bookCoverText: { fontSize: 7, color: 'rgba(255,255,255,0.9)', fontFamily: Font.bold },
    datePickerCard: {
      flexDirection: 'row',
      borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card, backgroundColor: C.white,
      marginBottom: 24, overflow: 'hidden',
    },
    datePickerColumn: { flex: 1, alignItems: 'center', paddingVertical: 16 },
    datePickerLabel: {
      fontSize: 11, fontWeight: '700', fontFamily: Font.bold,
      color: C.black, textTransform: 'uppercase', letterSpacing: 0.8,
      textAlign: 'center', marginBottom: 12,
    },
    datePickerDivider: { width: 1, backgroundColor: C.lightGray },
    stepper: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    stepperBtn: {
      width: 36, height: 36, borderRadius: 18,
      alignItems: 'center', justifyContent: 'center',
      backgroundColor: C.background,
    },
    stepperBtnDisabled: { opacity: 0.4 },
    stepperDate: { alignItems: 'center', minWidth: 56 },
    stepperMonth: { fontSize: 13, fontWeight: '700', fontFamily: Font.bold },
    stepperDay: { fontSize: 28, fontWeight: '800', fontFamily: Font.extraBold, lineHeight: 32 },
    sectionLabel: {
      fontSize: 13, fontWeight: '800', fontFamily: Font.extraBold,
      color: C.gray, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10,
    },
    noteInput: {
      borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card, backgroundColor: C.white,
      padding: 12, marginBottom: 16,
    },
    noteTextInput: {
      fontSize: 14, fontFamily: Font.regular,
      color: C.black, minHeight: 80, textAlignVertical: 'top',
    },
    bottomBar: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: 16, backgroundColor: C.white,
      borderTopWidth: 1, borderTopColor: C.black,
    },
    sendButton: {
      flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
      backgroundColor: C.purple, borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card, paddingVertical: 14,
    },
    sendButtonText: { fontSize: 15, fontWeight: '800', fontFamily: Font.extraBold, color: C.white },
  });
}
