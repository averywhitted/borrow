import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Shadow, Radius } from '../../constants/theme';

const LENDERS = [
  { id: '1', name: 'Jaydon Workman', books: 12, borrows: 8, lends: 14, distance: '0.3 mi' },
  { id: '2', name: 'Mira Siphron', books: 24, borrows: 19, lends: 22, distance: '0.6 mi' },
  { id: '3', name: 'Carlos Reyes', books: 7, borrows: 3, lends: 5, distance: '1.1 mi' },
];

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.black} />
        </TouchableOpacity>

        <View style={styles.bookHeader}>
          <View style={[styles.coverLarge, Shadow]} />
          <View style={styles.bookMeta}>
            <Text style={styles.bookTitle}>Dune</Text>
            <Text style={styles.bookAuthor}>Frank Herbert</Text>
            <View style={styles.seriesBadge}>
              <Text style={styles.seriesBadgeText}>#1 In Series</Text>
            </View>
            <Text style={styles.bookGenre}>Sci-Fi · 412 pages</Text>
          </View>
        </View>

        <Text style={styles.bookDescription}>
          Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides — who would become known as Muad'Dib — and of a great family's ambition to rule the most important and dangerous planet in the universe.
        </Text>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {LENDERS.length} neighbors have this book
          </Text>
        </View>

        {LENDERS.map((lender) => (
          <View key={lender.id} style={[styles.lenderCard, Shadow]}>
            <View style={styles.lenderAvatar} />
            <View style={styles.lenderInfo}>
              <Text style={styles.lenderName}>{lender.name}</Text>
              <Text style={styles.lenderDistance}>
                <MaterialIcons name="place" size={11} color={Colors.gray} /> {lender.distance} away
              </Text>
              <View style={styles.lenderStats}>
                <Text style={styles.lenderStat}>{lender.books} books</Text>
                <Text style={styles.lenderStatDivider}>·</Text>
                <Text style={styles.lenderStat}>{lender.borrows} borrows</Text>
                <Text style={styles.lenderStatDivider}>·</Text>
                <Text style={styles.lenderStat}>{lender.lends} lends</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.requestButton, Shadow]}
              onPress={() => router.push(`/borrow-request/${lender.id}`)}
            >
              <Text style={styles.requestButtonText}>Request</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={[styles.viewLibraryButton, Shadow]}>
          <Text style={styles.viewLibraryText}>View Library</Text>
          <MaterialIcons name="arrow-forward" size={16} color={Colors.black} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  backButton: {
    marginBottom: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  bookHeader: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  coverLarge: {
    width: 110,
    height: 150,
    borderRadius: Radius.card,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.lightGray,
  },
  bookMeta: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.black,
  },
  bookAuthor: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '600',
  },
  seriesBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.lightGray,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  seriesBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gray,
  },
  bookGenre: {
    fontSize: 12,
    color: Colors.gray,
  },
  bookDescription: {
    fontSize: 14,
    color: Colors.black,
    lineHeight: 22,
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.black,
  },
  lenderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.white,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  lenderAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.lightGray,
  },
  lenderInfo: {
    flex: 1,
    gap: 3,
  },
  lenderName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
  },
  lenderDistance: {
    fontSize: 11,
    color: Colors.gray,
  },
  lenderStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lenderStat: {
    fontSize: 11,
    color: Colors.gray,
    fontWeight: '600',
  },
  lenderStatDivider: {
    fontSize: 11,
    color: Colors.lightGray,
  },
  requestButton: {
    backgroundColor: Colors.purple,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  requestButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  viewLibraryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    padding: 14,
    marginTop: 8,
    backgroundColor: Colors.white,
  },
  viewLibraryText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
  },
});
