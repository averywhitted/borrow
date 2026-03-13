import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Shadow, Radius } from '../../constants/theme';

const GENRES = ['Fantasy', 'Sci-Fi', 'Mystery', 'LGBTQ+', 'Horror', 'Romance'];

const BOOKS = [
  { id: '1', title: 'Life of Pi', author: 'Yann Martel', nearby: 16 },
  { id: '2', title: 'Dune', author: 'Frank Herbert', nearby: 26, badge: '#1 In Series' },
  { id: '3', title: 'Macbeth', author: 'William Shakespeare', nearby: 25 },
  { id: '4', title: 'Lord of the Flies', author: 'William Golding', nearby: 12 },
  { id: '5', title: 'Catcher in the Rye', author: 'J.D. Salinger', nearby: 20 },
  { id: '6', title: 'Fahrenheit 451', author: 'Ray Bradbury', nearby: 30 },
  { id: '7', title: 'The Stand', author: 'Stephen King', nearby: 8 },
  { id: '8', title: 'Jane Eyre', author: 'Charlotte Brontë', nearby: 9 },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Books in Brooklyn, NY</Text>

        <View style={[styles.searchBar, Shadow]}>
          <Text style={styles.searchPlaceholder}>Search books in your area</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.genreRow}>
          {GENRES.map((genre) => (
            <TouchableOpacity key={genre} style={[styles.genrePill, Shadow]}>
              <Text style={styles.genreText}>{genre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {BOOKS.map((book) => (
          <TouchableOpacity key={book.id} style={[styles.card, Shadow]} onPress={() => router.push(`/book/${book.id}`)}>
            <View style={styles.coverPlaceholder} />
            <View style={styles.cardInfo}>
              {book.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{book.badge}</Text>
                </View>
              )}
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookAuthor}>{book.author}</Text>
              <View style={styles.nearbyRow}>
                <MaterialIcons name="place" size={12} color={Colors.gray} />
                <Text style={styles.bookNearby}>{book.nearby} near you</Text>
              </View>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity style={[styles.borrowButton, Shadow]}>
                <MaterialIcons name="bookmark-add" size={18} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.moreButton, Shadow]}>
                <Text style={styles.moreButtonText}>···</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.black,
    marginBottom: 12,
  },
  searchBar: {
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  searchPlaceholder: {
    color: Colors.gray,
    fontSize: 14,
  },
  genreRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  genrePill: {
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: 8,
  },
  genreText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.black,
  },
  card: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    backgroundColor: Colors.white,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  coverPlaceholder: {
    width: 60,
    height: 80,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.lightGray,
    marginRight: 10,
  },
  cardInfo: {
    flex: 1,
  },
  badge: {
    backgroundColor: Colors.lightGray,
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.gray,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 2,
  },
  bookAuthor: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
  },
  nearbyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  bookNearby: {
    fontSize: 11,
    color: Colors.gray,
  },
  cardActions: {
    gap: 8,
    alignItems: 'center',
  },
  borrowButton: {
    backgroundColor: Colors.purple,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  borrowButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  moreButton: {
    backgroundColor: Colors.lightGray,
    borderWidth: 2,
    borderColor: Colors.black,
    borderRadius: Radius.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  moreButtonText: {
    color: Colors.black,
    fontWeight: '700',
    fontSize: 14,
  },
});
