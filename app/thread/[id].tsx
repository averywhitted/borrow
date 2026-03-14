import {
  ScrollView, View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { Colors, Shadow, Radius, Font } from '../../constants/theme';
import { Avatar } from '../../components/Avatar';
import { BookCover } from '../../components/BookCover';
import { AnimatedButton } from '../../components/AnimatedButton';
import { useThread, updateRequestStatus, sendMessage } from '../../store/threads';

export default function ThreadScreen() {
  const { id, draft } = useLocalSearchParams<{ id: string; draft?: string }>();
  const thread = useThread(id);
  const [message, setMessage] = useState(typeof draft === 'string' ? draft : '');
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
          <TouchableOpacity
            style={styles.headerLeft}
            onPress={() => router.push(`/user/${thread.neighborId}`)}
          >
            <Avatar name={neighborName} size={36} />
            <View style={styles.headerInfo}>
              <Text style={styles.headerName}>{neighborName}</Text>
              <Text style={styles.headerSubtitle}>Borrowing 1 · Lending 1</Text>
            </View>
          </TouchableOpacity>
          <AnimatedButton style={[styles.gearButton, Shadow]}>
            <MaterialIcons name="settings" size={20} color={Colors.black} />
          </AnimatedButton>
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
                <View key={msg.id} style={[styles.requestCardWrap, msg.fromMe ? styles.requestCardWrapMe : styles.requestCardWrapThem]}>
                <View style={[styles.requestCard, msg.fromMe ? styles.requestCardMe : styles.requestCardThem]}>
                  {/* Compact header: avatar + "Name wants to borrow" */}
                  <View style={styles.requestCardHeader}>
                    <Avatar name={req.fromName} size={26} />
                    <Text style={styles.requestHeaderText} numberOfLines={1}>
                      <Text style={styles.requestName}>{req.fromName} </Text>
                      <Text style={styles.requestSubtitle}>wants to borrow</Text>
                    </Text>
                  </View>

                  {/* Book + dates in one block */}
                  <View style={styles.requestBook}>
                    <BookCover title={req.bookTitle} author={req.bookAuthor ?? ''} width={48} height={64} />
                    <View style={styles.requestBookInfo}>
                      <Text style={styles.requestBookTitle} numberOfLines={2}>{req.bookTitle}</Text>
                      {req.bookAuthor && (
                        <Text style={styles.requestBookAuthor}>{req.bookAuthor}</Text>
                      )}
                      <View style={styles.requestDateRow}>
                        <MaterialIcons name="calendar-today" size={11} color={Colors.teal} />
                        <Text style={styles.requestDateText}>{req.fromDate}</Text>
                        <Text style={styles.requestDateSep}>→</Text>
                        <Text style={styles.requestDateText}>{req.untilDate}</Text>
                      </View>
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
                      <AnimatedButton
                        style={[styles.acceptButton, Shadow]}
                        onPress={() => updateRequestStatus(thread.id, req.id, 'accepted')}
                      >
                        <MaterialIcons name="check" size={16} color={Colors.white} />
                        <Text style={styles.acceptButtonText}>Accept</Text>
                      </AnimatedButton>
                      <AnimatedButton
                        style={[styles.declineButton, Shadow]}
                        onPress={() => updateRequestStatus(thread.id, req.id, 'declined')}
                      >
                        <MaterialIcons name="close" size={16} color={Colors.black} />
                        <Text style={styles.declineButtonText}>Decline</Text>
                      </AnimatedButton>
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
          <AnimatedButton style={[styles.sendButton, Shadow]} onPress={handleSend}>
            <MaterialIcons name="arrow-upward" size={18} color={Colors.white} />
          </AnimatedButton>
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
  headerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 15, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black },
  headerSubtitle: { fontSize: 11, fontFamily: Font.regular, color: Colors.gray },
  messageList: { flex: 1 },
  messageContent: { padding: 16, gap: 10, paddingBottom: 8 },

  // Request card
  requestCardWrap: { flexDirection: 'row', marginBottom: 4 },
  requestCardWrapMe: { justifyContent: 'flex-end' },
  requestCardWrapThem: { justifyContent: 'flex-start' },
  requestCard: {
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, backgroundColor: Colors.white,
    padding: 14, gap: 10,
    maxWidth: '85%',
  },
  requestCardMe: { borderBottomRightRadius: 0 },
  requestCardThem: { borderBottomLeftRadius: 0 },
  requestCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  requestHeaderText: { flex: 1, fontSize: 13 },
  requestName: { fontWeight: '700', fontFamily: Font.bold, color: Colors.black },
  requestSubtitle: { fontFamily: Font.regular, color: Colors.gray },

  requestBook: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  requestBookInfo: { flex: 1, gap: 4, justifyContent: 'center' },
  requestBookTitle: { fontSize: 14, fontWeight: '700', fontFamily: Font.bold, color: Colors.black, lineHeight: 18 },
  requestBookAuthor: { fontSize: 12, fontFamily: Font.regular, color: Colors.gray },
  requestDateRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  requestDateText: { fontSize: 12, fontFamily: Font.bold, fontWeight: '600', color: Colors.black },
  requestDateSep: { fontSize: 12, color: Colors.gray },

  requestNote: {
    backgroundColor: Colors.background, borderRadius: Radius.card,
    borderWidth: 1, borderColor: Colors.lightGray, padding: 10,
  },
  requestNoteText: { fontSize: 13, fontFamily: Font.regular, color: Colors.gray, fontStyle: 'italic' },

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
    ...Shadow,
  },
  bubbleInnerMe: { backgroundColor: Colors.teal, borderBottomRightRadius: 0 },
  bubbleInnerThem: { backgroundColor: Colors.white, borderBottomLeftRadius: 0 },
  gearButton: {
    borderWidth: 1, borderColor: Colors.black,
    borderRadius: Radius.card, padding: 6, backgroundColor: Colors.white,
  },
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
    textAlignVertical: 'center',
    paddingTop: 8, paddingBottom: 0,
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
