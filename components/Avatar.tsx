import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Font } from '../constants/theme';
import { getGradient, noiseStyle } from '../utils/gradient';

interface Props {
  name: string;
  size?: number;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();
}

export function Avatar({ name, size = 44 }: Props) {
  const [colorTop, colorBottom] = getGradient(name);
  const initials = getInitials(name);
  const fontSize = Math.round(size * 0.32);

  return (
    <View style={[styles.wrapper, { width: size, height: size, borderRadius: size / 2 }]}>
      <LinearGradient
        colors={[colorTop, colorBottom]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.gradient}
      >
        <View style={[StyleSheet.absoluteFillObject, noiseStyle as any]} />
        <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#000',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: 'rgba(255,255,255,0.95)',
    fontFamily: Font.extraBold,
  },
});
