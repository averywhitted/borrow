import {
  ScrollView, View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { Colors, Shadow, Radius, Font } from '../../constants/theme';
import { Avatar } from '../../components/Avatar';
import { useThread, updateRequestStatus, sendMessage } from '../../store/threads';

export default function ThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const thread = useThread(id);
  const [message, setMessage] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  }, [thread?.messages.length]);

  if (!thread) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundHeader}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.black} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <MaterialIcons name="chat-bubble-outline" size={40} color={Colors.lightGray} />
          <Text style={{ fontFamily: Font.bold, color: Colors.gray, fontSize: 14 }}>No messages yet</Text>
          <Text style={{ fontFamily: Font.regular, color: Colors.gray, fontSize: 12 }}>This conversation hasn't started.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const neighborName = thread.neighborName;

  const handleSend = () => {
    const text = message.trim();
    if (!text) return;
    sendMessage(thread.id, text);
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.black} />
          </TouchableOpacity>
          <Avatar name={neighborName} size={36} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{neighborName}</Text>
            <Text style={styles.headerSubtitle}>Borrowing 1 · Lending 1</Text>
          </View>
          <TouchableOpacity>
            <MaterialIcons name="settings" size={22} color={Colors.black} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageContent}
        >
          {thread.messages.map((msg) => {
            // ── Request card ──────────────────────────────────────────────
            if (msg.isRequestCard && msg.requestData) {
              const req = msg.requestData;
              return (
                <View key={msg.id} style={styles.requestCard}>
                  <View style={styles.requestCardHeader}>
                    <Avatar name={req.fromName} size={32} />
                    <View>
                      <Text style={styles.requestName}>{req.fromName}</Text>
                      <Text style={styles.requestSubtitle}>would like to borrow</Text>
                    </View>
                  </View>

                  <View style={styles.requestBook}>
                    <View style={styles.requestCover} />
                    <View style={{ gap: 2 }}>
                      <Text style={styles.requestBookTitle}>{req.bookTitle}</Text>
                      {req.bookAuthor && (
                        <Text style={styles.requestBookAuthor}>by {req.bookAuthor}</Text>
                      )}
                    </View>
                  </View>

                  <View style={styles.requestDates}>
                    <View style={styles.dateBox}>
                      <Text style={styles.dateLabel}>{req.fromDate.split(' ')[0]}</Text>
                      <Text style={styles.dateNumber}>{req.fromDate.split(' ')[1]}</Text>
                    </View>
                    <MaterialIcons name="arrow-forward" size={20} color={Colors.white} />
                    <View style={styles.dateBox}>
                      <Text style={styles.dateLabel}>{req.untilDate.split(' ')[0]}</Text>
                      <Text style={styles.dateNumber}>{req.untilDate.split(' ')[1]}</Text>
                    </View>
                  </View>

                  {req.note ? (
                    <View style={styles.requestNote}>
                      <Text style={styles.requestNoteText}>"{req.note}"</Text>
                    </View>
                  ) : null}

                  {/* Actions */}
                  {req.status === 'pending' && (
                    <View style={styles.requestActions}>
                      <TouchableOpacity
                        style={[styles.acceptButton, Shadow]}
                        onPress={() => updateRequestStatus(thread.id, req.id, 'accepted')}
                      >
                        <MaterialIcons name="check" size={16} color={Colors.white} />
                        <Text style={styles.acceptButtonText}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.declineButton, Shadow]}
                        onPress={() => updateRequestStatus(thread.id, req.id, 'declined')}
                      >
                        <MaterialIcons name="close" size={16} color={Colors.black} />
                        <Text style={styles.declineButtonText}>Decline</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  {req.status === 'accepted' && (
                    <View style={styles.statusRow}>
                      <MaterialIcons name="check-circle" size={14} color={Colors.teal} />
                      <Text style={[styles.statusRowText, { color: Colors.teal }]}>Accepted</Text>
                    </View>
                  )}
                  {req.status === 'declined' && (
                    <View style={styles.statusRow}>
                      <MaterialIcons name="cancel" size={14} color={Colors.gray} />
                      <Text style={[styles.statusRowText, { color: Colors.gray }]}>Declined</Text>
                    </View>
                  )}
                </View>
              );
            }

            // ── Status line ───────────────────────────────────────────────
            if (msg.isStatus) {
              return <Text key={msg.id} style={styles.statusMessage}>{msg.text}</Text>;
            }

            // ── Chat bubble ───────────────────────────────────────────────
            return (
              <View key={msg.id} style={[styles.bubble, msg.fromMe ? styles.bubbleMe : styles.bubbleThem]}>
                {!msg.fromMe && <Avatar name={neighborName} size={28} />}
                <View style={[styles.bubbleInner, msg.fromMe ? styles.bubbleInnerMe : styles.bubbleInnerThem]}>
                  <Text style={[styles.bubbleText, msg.fromMe && styles.bubbleTextMe]}>{msg.text}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Message..."
            placeholderTextColor={Colors.gray}
            value={message}
            onChangeText={setMessage}
            multiline
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.attachButton}>
            <MaterialIcons name="add" size={22} color={Colors.gray} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sendButton, Shadow]} onPress={handleSend}>
            <MaterialIcons name="arrow-upward" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const SEND_BTN = 36;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  notFoundHeader: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.black,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.black,
  },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 15, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black },
  headerSubtitle: { fontSize: 11, fontFamily: Font.regular, color: Colors.gray },
  messageList: { flex: 1 },
  messageContent: { padding: 16, gap: 10, paddingBottom: 8 },

  // Request card
  requestCard: {
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    padding: 14, gap: 12, marginBottom: 4,
  },
  requestCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  requestName: { fontSize: 13, fontWeight: '700', fontFamily: Font.bold, color: Colors.black },
  requestSubtitle: { fontSize: 11, fontFamily: Font.regular, color: Colors.gray },
  requestBook: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  requestCover: {
    width: 36, height: 50, borderRadius: 4,
    borderWidth: 1, borderColor: Colors.black, backgroundColor: Colors.lightGray,
  },
  requestBookTitle: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold, color: Colors.black },
  requestBookAuthor: { fontSize: 12, fontFamily: Font.regular, color: Colors.gray },
  requestNote: {
    backgroundColor: Colors.background, borderRadius: Radius.card,
    borderWidth: 1, borderColor: Colors.lightGray, padding: 10,
  },
  requestNoteText: { fontSize: 13, fontFamily: Font.regular, color: Colors.gray, fontStyle: 'italic' },
  requestDates: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  dateBox: {
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.black,
    paddingHorizontal: 18, paddingVertical: 8, alignItems: 'center',
  },
  dateLabel: { fontSize: 11, fontFamily: Font.regular, color: Colors.gray },
  dateNumber: { fontSize: 20, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.white },

  // Accept / decline
  requestActions: { flexDirection: 'row', gap: 10 },
  acceptButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: Colors.teal, borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, paddingVertical: 10,
  },
  acceptButtonText: { fontSize: 13, fontWeight: '700', fontFamily: Font.bold, color: Colors.white },
  declineButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, paddingVertical: 10,
  },
  declineButtonText: { fontSize: 13, fontWeight: '700', fontFamily: Font.bold, color: Colors.black },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusRowText: { fontSize: 12, fontFamily: Font.bold, fontWeight: '600' },

  statusMessage: {
    fontSize: 12, fontFamily: Font.regular,
    color: Colors.gray, textAlign: 'center', marginVertical: 4,
  },

  // Chat bubbles
  bubble: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  bubbleMe: { justifyContent: 'flex-end' },
  bubbleThem: { justifyContent: 'flex-start' },
  bubbleInner: {
    maxWidth: '75%', borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, paddingHorizontal: 12, paddingVertical: 8,
  },
  bubbleInnerMe: { backgroundColor: Colors.teal },
  bubbleInnerThem: { backgroundColor: Colors.white },
  bubbleText: { fontSize: 14, fontFamily: Font.regular, color: Colors.black, lineHeight: 20 },
  bubbleTextMe: { color: Colors.white },

  // Input bar
  inputBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderTopWidth: 1, borderTopColor: Colors.black,
    backgroundColor: Colors.white, padding: 12,
  },
  input: {
    flex: 1, height: SEND_BTN,
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card,
    paddingHorizontal: 12,
    fontSize: 14, fontFamily: Font.regular, color: Colors.black,
  },
  attachButton: {
    width: SEND_BTN, height: SEND_BTN,
    justifyContent: 'center', alignItems: 'center',
  },
  sendButton: {
    width: SEND_BTN, height: SEND_BTN,
    borderRadius: Radius.card,
    backgroundColor: Colors.teal,
    borderWidth: 1, borderColor: Colors.black,
    justifyContent: 'center', alignItems: 'center',
  },
});
