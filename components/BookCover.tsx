import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Font } from '../constants/theme';
import { getGradient, noiseStyle } from '../utils/gradient';

interface Props {
  title: string;
  author?: string;
  width: number;
  height: number;
  borderRadius?: number;
}

export function BookCover({ title, author, width, height, borderRadius = 6 }: Props) {
  const [colorTop, colorBottom] = getGradient(title);

  return (
    <View style={{ width, height, borderRadius, overflow: 'hidden', borderWidth: 1, borderColor: '#000' }}>
      <LinearGradient
        colors={[colorTop, colorBottom]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.gradient}
      >
        {/* Noise texture overlay (web only) */}
        <View style={[StyleSheet.absoluteFillObject, noiseStyle as any]} />

        {/* Title + author at bottom */}
        <View style={styles.textBlock}>
          <Text style={[styles.title, { fontSize: Math.max(7, Math.round(width * 0.12)) }]} numberOfLines={3}>
            {title}
          </Text>
          {author && (
            <Text style={[styles.author, { fontSize: Math.max(6, Math.round(width * 0.09)) }]} numberOfLines={1}>
              {author}
            </Text>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 6,
  },
  textBlock: {
    gap: 2,
  },
  title: {
    color: 'rgba(255,255,255,0.95)',
    fontFamily: Font.bold,
    lineHeight: undefined,
  },
  author: {
    color: 'rgba(255,255,255,0.6)',
    fontFamily: Font.regular,
  },
});
