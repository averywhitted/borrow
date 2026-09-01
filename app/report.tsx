/**
 * Unified report screen — covers:
 *   - Bug reports       (?type=bug)
 *   - User reports      (?type=user&targetName=...&targetId=...)
 *   - Content reports   (?type=content&targetName=...&targetId=...)
 */
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useMemo } from 'react';
import { Radius, Font, getColors, getShadow } from '../constants/theme';
import { useIsDark } from '../store/theme';
import { AnimatedButton } from '../components/AnimatedButton';

// ── Category options per report type ─────────────────────────────────────────
const BUG_CATEGORIES = [
  { key: 'crash',    label: 'App crash', icon: 'warning' },
  { key: 'ui',       label: 'Display / UI issue', icon: 'broken-image' },
  { key: 'wrong',    label: 'Wrong information', icon: 'info' },
  { key: 'slow',     label: 'Performance / slowness', icon: 'speed' },
  { key: 'other',    label: 'Other', icon: 'more-horiz' },
];

const USER_CATEGORIES = [
  { key: 'spam',       label: 'Spam or fake account', icon: 'report-gmailerrorred' },
  { key: 'harass',     label: 'Harassment', icon: 'person-off' },
  { key: 'offensive',  label: 'Offensive content', icon: 'block' },
  { key: 'scam',       label: 'Attempted scam', icon: 'gpp-bad' },
  { key: 'other',      label: 'Other', icon: 'more-horiz' },
];

const CONTENT_CATEGORIES = [
  { key: 'inappropriate', label: 'Inappropriate listing', icon: 'report' },
  { key: 'misleading',    label: 'Misleading information', icon: 'info' },
  { key: 'spam',          label: 'Spam', icon: 'report-gmailerrorred' },
  { key: 'other',         label: 'Other', icon: 'more-horiz' },
];

// ── Screen ─────────────────────────────────────────────────────────────────────
export default function ReportScreen() {
  const { type = 'bug', targetName = '', targetId = '' } =
    useLocalSearchParams<{ type?: string; targetName?: string; targetId?: string }>();

  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isBug = type === 'bug';
  const categories = isBug ? BUG_CATEGORIES : type === 'user' ? USER_CATEGORIES : CONTENT_CATEGORIES;

  const title = isBug
    ? 'Report a Bug'
    : type === 'user'
      ? `Report ${targetName || 'User'}`
      : 'Report Content';

  const subtitle = isBug
    ? "Help us improve Borrow — describe what went wrong."
    : "Reports are reviewed by our team within 24 hours. Your report is anonymous.";

  const canSubmit = !!category && (isBug ? description.trim().length > 10 : true);

  const handleSubmit = () => {
    if (!canSubmit) return;
    // TODO: send to backend / support email
    // For now: show confirmation and go back
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: C.background }]}>
        <View style={[styles.header, { borderBottomColor: C.black, backgroundColor: C.white }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color={C.black} />
          </TouchableOpacity>
          <Text style={[styles.heading, { color: C.black }]}>{title}</Text>
        </View>
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: C.pillActive }]}>
            <MaterialIcons name="check" size={32} color={C.white} />
          </View>
          <Text style={[styles.successTitle, { color: C.black }]}>Thanks for letting us know</Text>
          <Text style={[styles.successSub, { color: C.gray }]}>
            {isBug
              ? "We'll look into it. If you'd like a follow-up, email us at support@borrow.app."
              : "Your report has been received. We review all reports within 24 hours."}
          </Text>
          <AnimatedButton
            style={[styles.doneBtn, { backgroundColor: C.pillActive, borderColor: C.pillActive }, getShadow(isDark)]}
            onPress={() => router.back()}
          >
            <Text style={[styles.doneBtnText, { color: C.white }]}>Done</Text>
          </AnimatedButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: C.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: C.black, backgroundColor: C.white }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={20} color={C.black} />
          </TouchableOpacity>
          <Text style={[styles.heading, { color: C.black }]}>{title}</Text>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

          <Text style={[styles.subtitle, { color: C.gray }]}>{subtitle}</Text>

          {/* Category */}
          <View style={styles.section}>
            <Text style={[styles.fieldLabel, { color: C.black }]}>
              {isBug ? 'What kind of bug?' : 'Reason for report'}
            </Text>
            <View style={styles.categoryGrid}>
              {categories.map(cat => {
                const active = category === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.key}
                    style={[
                      styles.categoryPill,
                      { borderColor: C.black, backgroundColor: C.white },
                      active && { backgroundColor: C.pillActive, borderColor: C.pillActive },
                      getShadow(isDark),
                    ]}
                    onPress={() => setCategory(cat.key)}
                    activeOpacity={0.75}
                  >
                    <MaterialIcons
                      name={cat.icon as any}
                      size={14}
                      color={active ? C.white : C.gray}
                    />
                    <Text style={[
                      styles.categoryLabel,
                      { color: active ? C.white : C.black },
                    ]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.fieldLabel, { color: C.black }]}>
              {isBug ? 'Describe what happened *' : 'Additional details (optional)'}
            </Text>
            {isBug && (
              <Text style={[styles.fieldHint, { color: C.gray }]}>
                What were you doing when the bug occurred? What did you expect to happen?
              </Text>
            )}
            <TextInput
              style={[
                styles.textArea,
                { backgroundColor: C.white, borderColor: C.black, color: C.black },
                getShadow(isDark),
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder={
                isBug
                  ? "e.g. \"I tapped 'Add to Library' and the app went blank…\""
                  : "Any additional context that might help our team…"
              }
              placeholderTextColor={C.lightGray}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
            {isBug && (
              <Text style={[styles.charCount, { color: description.length < 10 ? '#E53935' : C.gray }]}>
                {description.length < 10
                  ? `${10 - description.length} more characters needed`
                  : `${description.length} chars`}
              </Text>
            )}
          </View>

          {/* Submit */}
          <AnimatedButton
            style={[
              styles.submitBtn,
              { backgroundColor: canSubmit ? C.pillActive : C.lightGray,
                borderColor: canSubmit ? C.pillActive : C.lightGray },
              canSubmit && getShadow(isDark),
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit}
          >
            <Text style={[styles.submitBtnText, { color: C.white }]}>
              {isBug ? 'Submit Bug Report' : 'Submit Report'}
            </Text>
          </AnimatedButton>

          {!isBug && (
            <Text style={[styles.footerNote, { color: C.gray }]}>
              Submitting a false report may result in action against your account.
            </Text>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function makeStyles(C: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 16, paddingVertical: 14,
      borderBottomWidth: 1, gap: 12,
    },
    backBtn: { padding: 4 },
    heading: { fontSize: 17, fontWeight: '800', fontFamily: Font.extraBold },
    scroll: { flex: 1 },
    scrollContent: { padding: 16, gap: 4, paddingBottom: 40 },

    subtitle: { fontSize: 13, fontFamily: Font.regular, lineHeight: 20, marginBottom: 8 },

    section: { marginTop: 20, gap: 8 },
    fieldLabel: { fontSize: 13, fontWeight: '700', fontFamily: Font.bold },
    fieldHint: { fontSize: 12, fontFamily: Font.regular },

    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    categoryPill: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      paddingHorizontal: 12, paddingVertical: 8,
      borderWidth: 1, borderRadius: Radius.card,
    },
    categoryLabel: { fontSize: 13, fontFamily: Font.bold, fontWeight: '600' },

    textArea: {
      borderWidth: 1, borderRadius: Radius.card,
      paddingHorizontal: 12, paddingTop: 10, paddingBottom: 10,
      fontSize: 13, fontFamily: Font.regular,
      minHeight: 100,
    },
    charCount: { fontSize: 11, fontFamily: Font.regular, textAlign: 'right' },

    submitBtn: {
      marginTop: 24, borderRadius: Radius.card, borderWidth: 1,
      paddingVertical: 14, alignItems: 'center',
    },
    submitBtnText: { fontSize: 14, fontWeight: '800', fontFamily: Font.extraBold },

    footerNote: {
      fontSize: 11, fontFamily: Font.regular, textAlign: 'center', marginTop: 12,
    },

    // success state
    successContainer: {
      flex: 1, alignItems: 'center', justifyContent: 'center',
      paddingHorizontal: 32, gap: 16,
    },
    successIcon: {
      width: 64, height: 64, borderRadius: 32,
      alignItems: 'center', justifyContent: 'center',
    },
    successTitle: { fontSize: 18, fontWeight: '800', fontFamily: Font.extraBold, textAlign: 'center' },
    successSub: { fontSize: 14, fontFamily: Font.regular, textAlign: 'center', lineHeight: 21 },
    doneBtn: {
      marginTop: 8, borderRadius: Radius.card, borderWidth: 1,
      paddingHorizontal: 40, paddingVertical: 14,
    },
    doneBtnText: { fontSize: 14, fontWeight: '800', fontFamily: Font.extraBold },
  });
}
