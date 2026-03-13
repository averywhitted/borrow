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
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Colors, Shadow, Radius } from '../../constants/theme';

const LENDERS: Record<string, { name: string; distance: string }> = {
  '1': { name: 'Jaydon Workman', distance: '0.3 mi' },
  '2': { name: 'Priya Okonkwo', distance: '0.6 mi' },
  '4': { name: 'Sasha Volkov', distance: '1.4 mi' },
};

const START_OPTIONS = ['Today', 'Tomorrow', 'This weekend'];
const DURATIONS = ['1 week', '2 weeks', '3 weeks', '4 weeks'];

function addDays(base: string, days: number): string {
  const d = new Date();
  if (base === 'Tomorrow') d.setDate(d.getDate() + 1);
  else if (base === 'This weekend') {
    const day = d.getDay();
    d.setDate(d.getDate() + ((6 - day + 7) % 7 || 7));
  }
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getStartDate(base: string): string {
  const d = new Date();
  if (base === 'Tomorrow') d.setDate(d.getDate() + 1);
  else if (base === 'This weekend') {
    const day = d.getDay();
    d.setDate(d.getDate() + ((6 - day + 7) % 7 || 7));
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function BorrowRequestScreen() {
  const { lenderId } = useLocalSearchParams<{ lenderId: string }>();
  const lender = LENDERS[lenderId] ?? { name: 'Neighbor', distance: '—' };

  const [startOption, setStartOption] = useState('Today');
  const [duration, setDuration] = useState('2 weeks');
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);

  const durationDays = parseInt(duration) * 7;
  const startLabel = getStartDate(startOption);
  const endLabel = addDays(startOption, durationDays);

  if (sent) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successScreen}>
          <View style={[styles.successIcon, Shadow]}>
            <MaterialIcons name="send" size={32} color={Colors.white} />
          </View>
          <Text style={styles.successTitle}>Request Sent!</Text>
          <Text style={styles.successSubtitle}>
            <Text style={{ fontWeight: '800' }}>{lender.name}</Text> will get back to you soon. You'll get a notification when they respond.
          </Text>
          <TouchableOpacity style={[styles.doneButton, Shadow]} onPress={() => router.back()}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.heading}>Request to Borrow</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="close" size={24} color={Colors.black} />
          </TouchableOpacity>
        </View>

        <View style={[styles.lenderCard, Shadow]}>
          <View style={styles.lenderAvatar} />
          <View style={styles.lenderInfo}>
            <Text style={styles.lenderName}>{lender.name}</Text>
            <View style={styles.lenderMeta}>
              <MaterialIcons name="place" size={12} color={Colors.gray} />
              <Text style={styles.lenderDistance}>{lender.distance} away</Text>
            </View>
          </View>
          <View style={[styles.bookCoverSmall, Shadow]} />
        </View>

        <View style={[styles.dateRangeCard, Shadow]}>
          <View style={styles.dateBox}>
            <Text style={styles.dateBoxLabel}>From</Text>
            <Text style={styles.dateBoxValue}>{startLabel}</Text>
          </View>
          <MaterialIcons name="arrow-forward" size={20} color={Colors.white} />
          <View style={styles.dateBox}>
            <Text style={styles.dateBoxLabel}>Until</Text>
            <Text style={styles.dateBoxValue}>{endLabel}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>When do you need it?</Text>
        <View style={styles.optionRow}>
          {START_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.optionPill, Shadow, startOption === opt && styles.optionPillActive]}
              onPress={() => setStartOption(opt)}
            >
              <Text style={[styles.optionText, startOption === opt && styles.optionTextActive]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>How long?</Text>
        <View style={styles.optionRow}>
          {DURATIONS.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.optionPill, Shadow, duration === d && styles.optionPillActive]}
              onPress={() => setDuration(d)}
            >
              <Text style={[styles.optionText, duration === d && styles.optionTextActive]}>
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Add a note (optional)</Text>
        <View style={[styles.noteInput, Shadow]}>
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
        <TouchableOpacity style={[styles.sendButton, Shadow]} onPress={() => setSent(true)}>
          <MaterialIcons name="send" size={20} color={Colors.white} />
          <Text style={styles.sendButtonText}>Send Request</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: { fontSize: 24, fontWeight: '800', color: Colors.black },
  lenderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.white,
    padding: 12,
    gap: 12,
    marginBottom: 16,
  },
  lenderAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.lightGray,
  },
  lenderInfo: { flex: 1, gap: 3 },
  lenderName: { fontSize: 15, fontWeight: '700', color: Colors.black },
  lenderMeta: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  lenderDistance: { fontSize: 12, color: Colors.gray },
  bookCoverSmall: {
    width: 40,
    height: 55,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.teal,
  },
  dateRangeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.black,
    padding: 16,
    marginBottom: 24,
  },
  dateBox: { alignItems: 'center', gap: 4 },
  dateBoxLabel: { fontSize: 11, fontWeight: '600', color: Colors.gray },
  dateBoxValue: { fontSize: 20, fontWeight: '800', color: Colors.white },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  optionPill: {
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.white,
  },
  optionPillActive: { backgroundColor: Colors.black },
  optionText: { fontSize: 13, fontWeight: '600', color: Colors.black },
  optionTextActive: { color: Colors.white },
  noteInput: {
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.white,
    padding: 12,
    marginBottom: 16,
  },
  noteTextInput: {
    fontSize: 14,
    color: Colors.black,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 2,
    borderTopColor: Colors.black,
  },
  sendButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.purple,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    paddingVertical: 14,
  },
  sendButtonText: { fontSize: 15, fontWeight: '800', color: Colors.white },
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
    backgroundColor: Colors.purple,
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
    borderRadius: Radius.pill,
    paddingHorizontal: 40,
    paddingVertical: 14,
    marginTop: 8,
  },
  doneButtonText: { fontSize: 15, fontWeight: '800', color: Colors.white },
});
