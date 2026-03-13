import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Colors, Shadow, Radius, Font } from '../../constants/theme';

const INBOX = [
  { id: '1', name: 'Jaydon Workman', preview: "Speaking of… I'm like 3 chapters in and already emotionally unstable.", time: '2m ago', unread: true, borrowing: 1, lending: 1 },
  { id: '2', name: 'Priya Okonkwo', preview: 'Sounds good! I can leave it on my stoop tomorrow morning.', time: '1h ago', unread: false, borrowing: 0, lending: 1 },
  { id: '3', name: 'Marcus Lee', preview: 'No worries at all, take your time with it.', time: 'Yesterday', unread: false, borrowing: 1, lending: 0 },
];

const REQUESTS = [
  { id: '4', name: 'Sasha Volkov', book: 'Dune', requestedDate: 'Mar 12', duration: '3 weeks', incoming: true },
  { id: '5', name: 'Lily Chen', book: 'Kindred', requestedDate: 'Mar 10', duration: '4 weeks', incoming: false, status: 'pending' },
];

export default function MessagesScreen() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'requests'>('inbox');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.heading}>Messages</Text>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'inbox' && styles.tabActive]}
            onPress={() => setActiveTab('inbox')}
          >
            <Text style={[styles.tabText, activeTab === 'inbox' && styles.tabTextActive]}>Inbox</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'requests' && styles.tabActive]}
            onPress={() => setActiveTab('requests')}
          >
            <Text style={[styles.tabText, activeTab === 'requests' && styles.tabTextActive]}>Requests</Text>
            {REQUESTS.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{REQUESTS.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.list}>
          {activeTab === 'inbox'
            ? INBOX.map((convo) => (
                <TouchableOpacity
                  key={convo.id}
                  style={[styles.row, Shadow]}
                  onPress={() => router.push(`/thread/${convo.id}`)}
                >
                  <View style={styles.avatar} />
                  <View style={styles.rowInfo}>
                    <View style={styles.rowTop}>
                      <Text style={[styles.rowName, convo.unread && styles.rowNameUnread]}>{convo.name}</Text>
                      <Text style={styles.rowTime}>{convo.time}</Text>
                    </View>
                    <Text style={styles.rowSubtitle}>Borrowing {convo.borrowing} · Lending {convo.lending}</Text>
                    <Text style={styles.rowPreview} numberOfLines={1}>{convo.preview}</Text>
                  </View>
                  {convo.unread && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              ))
            : REQUESTS.map((req) => (
                <TouchableOpacity
                  key={req.id}
                  style={[styles.row, Shadow]}
                  onPress={() => router.push(`/thread/${req.id}`)}
                >
                  <View style={styles.avatar} />
                  <View style={styles.rowInfo}>
                    <View style={styles.rowTop}>
                      <Text style={styles.rowName}>{req.name}</Text>
                      <Text style={styles.rowTime}>{req.requestedDate}</Text>
                    </View>
                    <Text style={styles.rowPreview}>
                      {req.incoming ? 'Wants to borrow' : 'You requested'} · <Text style={{ fontFamily: Font.bold }}>{req.book}</Text>
                    </Text>
                    <Text style={styles.rowSubtitle}>Duration: {req.duration}</Text>
                  </View>
                  {req.incoming && (
                    <View style={styles.incomingBadge}>
                      <Text style={styles.incomingBadgeText}>New</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 24, fontWeight: '800', fontFamily: Font.extraBold, color: Colors.black, marginBottom: 16 },
  tabBar: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    backgroundColor: Colors.white,
    marginBottom: 16,
    padding: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },
  tabActive: { backgroundColor: Colors.black },
  tabText: { fontSize: 13, fontWeight: '700', fontFamily: Font.bold, color: Colors.gray },
  tabTextActive: { color: Colors.white },
  badge: {
    backgroundColor: Colors.purple,
    borderRadius: Radius.pill,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { fontSize: 10, fontWeight: '700', fontFamily: Font.bold, color: Colors.white },
  list: { gap: 10, paddingBottom: 32 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.white,
    padding: 12,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.black,
    backgroundColor: Colors.lightGray,
  },
  rowInfo: { flex: 1, gap: 3 },
  rowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowName: { fontSize: 14, fontWeight: '600', fontFamily: Font.bold, color: Colors.black },
  rowNameUnread: { fontFamily: Font.extraBold },
  rowTime: { fontSize: 11, fontFamily: Font.regular, color: Colors.gray },
  rowSubtitle: { fontSize: 11, fontFamily: Font.regular, color: Colors.gray },
  rowPreview: { fontSize: 13, fontFamily: Font.regular, color: Colors.gray },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.teal,
    borderWidth: 1,
    borderColor: Colors.black,
  },
  incomingBadge: {
    backgroundColor: Colors.purple,
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  incomingBadgeText: { fontSize: 11, fontWeight: '700', fontFamily: Font.bold, color: Colors.white },
});
