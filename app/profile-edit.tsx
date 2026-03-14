import {
  ScrollView, View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useRef } from 'react';
import { Colors, Shadow, Radius, Font } from '../constants/theme';
import { Avatar } from '../components/Avatar';
import { AnimatedButton } from '../components/AnimatedButton';

const GENRE_OPTIONS = ['Literary Fiction', 'Sci-Fi', 'Fantasy', 'Mystery', 'Horror', 'Romance', 'LGBTQ+', 'Nonfiction', 'History', 'Biography'];
const WINDOW_OPTIONS = ['1 week', '2 weeks', '1 month'];
const BIO_SUGGESTIONS = [
  'Tell neighbors about your reading life…',
  "e.g. \"Big sci-fi fan. I lend happily — just return on time 😄\"",
];

// ── Animated sliding pill selector (same pattern as library tab) ───────────────
function SlidingSelector({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (opt: string) => void;
}) {
  const [barWidth, setBarWidth] = useState(0);
  const indicatorX = useRef(new Animated.Value(0)).current;
  const slotW = barWidth > 0 ? (barWidth - 8) / options.length : 0;

  const handleLayout = (e: { nativeEvent: { layout: { width: number } } }) => {
    const w = e.nativeEvent.layout.width;
    setBarWidth(w);
    const tw = (w - 8) / options.length;
    indicatorX.setValue(options.indexOf(selected) * tw);
  };

  const handleSelect = (opt: string, idx: number) => {
    if (slotW === 0) return;
    Animated.timing(indicatorX, {
      toValue: idx * slotW,
      duration: 160,
      useNativeDriver: true,
    }).start();
    onSelect(opt);
  };

  return (
    <View style={slStyles.container} onLayout={handleLayout}>
      {slotW > 0 && (
        <Animated.View
          style={[slStyles.indicator, { width: slotW, transform: [{ translateX: indicatorX }] }]}
        />
      )}
      {options.map((opt, idx) => (
        <TouchableOpacity
          key={opt}
          style={slStyles.tab}
          onPress={() => handleSelect(opt, idx)}
          activeOpacity={0.7}
        >
          <Text style={[slStyles.tabText, selected === opt && slStyles.tabTextActive]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const slStyles = StyleSheet.create({
  container: {
    flexDirection: 'row', position: 'relative',
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.pill, padding: 4,
    backgroundColor: Colors.white,
    ...Shadow,
  },
  indicator: {
    position: 'absolute', top: 4, bottom: 4, left: 4,
    backgroundColor: '#555',
    borderRadius: Radius.pill,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  tabText: { fontSize: 13, fontFamily: Font.bold, fontWeight: '600', color: Colors.gray },
  tabTextActive: { color: Colors.white },
});

// ── Screen ─────────────────────────────────────────────────────────────────────
export default function ProfileEditScreen() {
  const [name, setName] = useState('Avery Whitted');
  const [location, setLocation] = useState('Brooklyn, NY');
  const [bio, setBio] = useState('');
  const [genres, setGenres] = useState<string[]>(['Literary Fiction', 'Sci-Fi', 'Fantasy']);
  const [lendWindow, setLendWindow] = useState('2 weeks');

  const toggleGenre = (g: string) => {
    setGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const handleSave = () => {
    // TODO: persist to user store/API
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color={Colors.black} />
          </TouchableOpacity>
          <Text style={styles.heading}>Edit Profile</Text>
          <AnimatedButton style={[styles.saveBtn, Shadow]} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save</Text>
          </AnimatedButton>
        </View>

        <ScrollView contentContainerStyle={styles.content}>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              <Avatar name={name} size={72} />
              <View style={[styles.avatarEditBadge, Shadow]}>
                <MaterialIcons name="camera-alt" size={14} color={Colors.white} />
              </View>
            </View>
            <Text style={styles.avatarHint}>Tap to change photo</Text>
          </View>

          {/* Name */}
          <Text style={styles.fieldLabel}>Name</Text>
          <TextInput
            style={[styles.input, Shadow]}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={Colors.gray}
          />

          {/* Location */}
          <Text style={styles.fieldLabel}>Location</Text>
          <View style={[styles.inputWithIcon, Shadow]}>
            <MaterialIcons name="place" size={16} color={Colors.gray} style={styles.inputIcon} />
            <TextInput
              style={[styles.inputInner]}
              value={location}
              onChangeText={setLocation}
              placeholder="Neighborhood, City"
              placeholderTextColor={Colors.gray}
            />
          </View>

          {/* Bio */}
          <Text style={styles.fieldLabel}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput, Shadow]}
            value={bio}
            onChangeText={setBio}
            placeholder={BIO_SUGGESTIONS[0]}
            placeholderTextColor={Colors.lightGray}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
          <View style={styles.bioFooter}>
            {bio.length === 0 ? (
              <Text style={styles.bioHint}>{BIO_SUGGESTIONS[1]}</Text>
            ) : (
              <Text style={styles.charCount}>{bio.length}/160</Text>
            )}
          </View>

          {/* Reading preferences */}
          <Text style={styles.fieldLabel}>Reading Preferences</Text>
          <Text style={styles.fieldSubLabel}>Select genres you enjoy — helps neighbors find your wishlist</Text>
          <View style={styles.genreGrid}>
            {GENRE_OPTIONS.map(g => {
              const active = genres.includes(g);
              return (
                <TouchableOpacity
                  key={g}
                  style={[styles.genrePill, active && styles.genrePillActive, Shadow]}
                  onPress={() => toggleGenre(g)}
                >
                  {active && <MaterialIcons name="check" size={12} color={Colors.white} />}
                  <Text style={[styles.genreText, active && styles.genreTextActive]}>{g}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Default lending window */}
          <Text style={styles.fieldLabel}>Default Lending Window</Text>
          <SlidingSelector
            options={WINDOW_OPTIONS}
            selected={lendWindow}
            onSelect={setLendWindow}
          />

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.black,
    backgroundColor: Colors.white, gap: 12,
  },
  backBtn: { padding: 4 },
  heading: { flex: 1, fontSize: 17, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black },
  saveBtn: {
    backgroundColor: Colors.teal, borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, paddingHorizontal: 18, paddingVertical: 8,
  },
  saveBtnText: { fontSize: 13, fontWeight: '700', fontFamily: Font.bold, color: Colors.white },

  content: { padding: 16 },

  avatarSection: { alignItems: 'center', marginBottom: 28, gap: 8 },
  avatarWrap: { position: 'relative' },
  avatarEditBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.black,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.white,
  },
  avatarHint: { fontSize: 12, fontFamily: Font.regular, color: Colors.gray },

  fieldLabel: {
    fontSize: 12, fontWeight: '800', fontFamily: Font.extraBold,
    color: Colors.gray, textTransform: 'uppercase', letterSpacing: 0.7,
    marginBottom: 8, marginTop: 20,
  },
  fieldSubLabel: { fontSize: 12, fontFamily: Font.regular, color: Colors.gray, marginBottom: 10, marginTop: -4 },

  bioFooter: { marginTop: 4, minHeight: 16 },
  bioHint: { fontSize: 11, fontFamily: Font.regular, color: Colors.lightGray, fontStyle: 'italic' },
  charCount: { fontSize: 11, fontFamily: Font.regular, color: Colors.lightGray, textAlign: 'right' },

  input: {
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, fontFamily: Font.regular, color: Colors.black,
  },
  bioInput: { minHeight: 80, paddingTop: 12 },
  inputWithIcon: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 8 },
  inputInner: {
    flex: 1, paddingVertical: 12,
    fontSize: 14, fontFamily: Font.regular, color: Colors.black,
  },

  genreGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  genrePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.pill, backgroundColor: Colors.white,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  genrePillActive: { backgroundColor: '#555', borderColor: '#555' },
  genreText: { fontSize: 13, fontFamily: Font.bold, fontWeight: '600', color: Colors.black },
  genreTextActive: { color: Colors.white },
});
