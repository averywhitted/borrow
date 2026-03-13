import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Colors, Shadow, Radius } from '../../constants/theme';

const MESSAGES = [
  { id: '1', fromMe: false, text: null, isRequestCard: true },
  { id: '2', fromMe: false, text: 'Jaydon Workman accepted your borrow request', isStatus: true },
  { id: '3', fromMe: false, text: 'Hey! Just saw the borrow request—of course you can take Piranesi! 😊' },
  { id: '4', fromMe: true, text: 'Ahh thanks!' },
  { id: '5', fromMe: false, text: 'So official lol' },
  { id: '6', fromMe: true, text: 'Honestly same when I got yours for Song of Achilles haha.' },
  { id: '7', fromMe: false, text: "Speaking of\u2026 I'm like 3 chapters in and already emotionally unstable." },
];

export default function ThreadScreen() {
  const [message, setMessage] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <View style={styles.headerAvatar} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>Jaydon Workman</Text>
            <Text style={styles.headerSubtitle}>Borrowing 1 · Lending 1</Text>
          </View>
          <TouchableOpacity>
            <MaterialIcons name="settings" size={22} color={Colors.black} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.messageList}
          contentContainerStyle={styles.messageContent}
        >
          {MESSAGES.map((msg) => {
            if (msg.isRequestCard) {
              return (
                <View key={msg.id} style={[styles.requestCard, Shadow]}>
                  <View style={styles.requestCardHeader}>
                    <View style={styles.requestAvatar} />
                    <View>
                      <Text style={styles.requestName}>Mira Siphron</Text>
                      <Text style={styles.requestSubtitle}>would like to borrow</Text>
                    </View>
                  </View>
                  <View style={styles.requestBook}>
                    <View style={styles.requestCover} />
                    <Text style={styles.requestBookTitle}>Piranesi</Text>
                    <Text style={styles.requestBookAuthor}>by Susanna Clarke</Text>
                  </View>
                  <View style={styles.requestDates}>
                    <View style={[styles.dateBox, Shadow]}>
                      <Text style={styles.dateLabel}>Mar</Text>
                      <Text style={styles.dateNumber}>10</Text>
                    </View>
                    <MaterialIcons name="arrow-forward" size={20} color={Colors.black} />
                    <View style={[styles.dateBox, Shadow]}>
                      <Text style={styles.dateLabel}>Mar</Text>
                      <Text style={styles.dateNumber}>24</Text>
                    </View>
                  </View>
                </View>
              );
            }

            if (msg.isStatus) {
              return (
                <Text key={msg.id} style={styles.statusMessage}>{msg.text}</Text>
              );
            }

            return (
              <View
                key={msg.id}
                style={[styles.bubble, msg.fromMe ? styles.bubbleMe : styles.bubbleThem]}
              >
                {!msg.fromMe && <View style={styles.bubbleAvatar} />}
                <View style={[
                  styles.bubbleInner,
                  msg.fromMe ? styles.bubbleInnerMe : styles.bubbleInnerThem,
                  Shadow,
                ]}>
                  <Text style={[styles.bubbleText, msg.fromMe && styles.bubbleTextMe]}>
                    {msg.text}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={[styles.inputBar, Shadow]}>
          <TextInput
            style={styles.input}
            placeholder="Message..."
            placeholderTextColor={Colors.gray}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.attachButton}>
            <MaterialIcons name="add" size={22} color={Colors.gray} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sendButton, Shadow]}>
            <MaterialIcons name="arrow-upward" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: Colors.black,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.lightGray,
  },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 15, fontWeight: '800', color: Colors.black },
  headerSubtitle: { fontSize: 11, color: Colors.gray },
  messageList: { flex: 1 },
  messageContent: { padding: 16, gap: 10, paddingBottom: 8 },
  requestCard: {
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.white,
    padding: 14,
    gap: 12,
    marginBottom: 4,
  },
  requestCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  requestAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.lightGray,
  },
  requestName: { fontSize: 13, fontWeight: '700', color: Colors.black },
  requestSubtitle: { fontSize: 11, color: Colors.gray },
  requestBook: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  requestCover: {
    width: 36,
    height: 50,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.lightGray,
  },
  requestBookTitle: { fontSize: 14, fontWeight: '700', color: Colors.black },
  requestBookAuthor: { fontSize: 12, color: Colors.gray },
  requestDates: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  dateBox: {
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.black,
    paddingHorizontal: 18,
    paddingVertical: 8,
    alignItems: 'center',
  },
  dateLabel: { fontSize: 11, fontWeight: '600', color: Colors.lightGray },
  dateNumber: { fontSize: 20, fontWeight: '800', color: Colors.white },
  statusMessage: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: 'center',
    marginVertical: 4,
  },
  bubble: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  bubbleMe: { justifyContent: 'flex-end' },
  bubbleThem: { justifyContent: 'flex-start' },
  bubbleAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.lightGray,
  },
  bubbleInner: {
    maxWidth: '75%',
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleInnerMe: { backgroundColor: Colors.teal },
  bubbleInnerThem: { backgroundColor: Colors.white },
  bubbleText: { fontSize: 14, color: Colors.black, lineHeight: 20 },
  bubbleTextMe: { color: Colors.white },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 2,
    borderTopColor: Colors.black,
    backgroundColor: Colors.white,
    padding: 12,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: Colors.black,
    maxHeight: 100,
  },
  attachButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.teal,
    borderWidth: 2,
    borderColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
