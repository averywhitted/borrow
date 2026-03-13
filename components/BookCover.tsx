import { Image, View, StyleSheet } from 'react-native';
import { useGoogleBook } from '../hooks/useGoogleBook';
import { Colors } from '../constants/theme';

interface Props {
  title: string;
  author?: string;
  width: number;
  height: number;
  borderRadius?: number;
}

export function BookCover({ title, author, width, height, borderRadius = 6 }: Props) {
  const book = useGoogleBook(title, author);

  if (!book?.thumbnail) {
    return (
      <View
        style={[
          styles.placeholder,
          { width, height, borderRadius },
        ]}
      />
    );
  }

  return (
    <Image
      source={{ uri: book.thumbnail }}
      style={{ width, height, borderRadius }}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: Colors.lightGray,
    borderWidth: 1,
    borderColor: Colors.black,
  },
});
