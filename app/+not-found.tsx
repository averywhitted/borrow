import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { useMemo } from 'react';
import { Font, Radius, Shadow, getColors } from '../constants/theme';
import { useIsDark } from '../store/theme';
import { AnimatedButton } from '../components/AnimatedButton';

export default function NotFoundScreen() {
  const isDark = useIsDark();
  const C = getColors(isDark);
  const styles = useMemo(() => makeStyles(C), [isDark]);

  return (
    <>
      <Stack.Screen options={{ title: 'Not Found', headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={[styles.card, Shadow]}>
            <MaterialIcons name="search-off" size={40} color={C.lightGray} />
            <Text style={styles.code}>404</Text>
            <Text style={styles.title}>Page Not Found</Text>
            <Text style={styles.body}>
              This page doesn't exist or may have moved.
            </Text>
          </View>
          <Link href="/" asChild>
            <AnimatedButton style={[styles.homeBtn, Shadow]}>
              <MaterialIcons name="home" size={18} color={C.white} />
              <Text style={styles.homeBtnText}>Back to Home</Text>
            </AnimatedButton>
          </Link>
        </View>
      </SafeAreaView>
    </>
  );
}

function makeStyles(C: ReturnType<typeof getColors>) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: C.background },
    container: {
      flex: 1, alignItems: 'center', justifyContent: 'center',
      padding: 32, gap: 20,
    },
    card: {
      width: '100%', alignItems: 'center', gap: 10,
      borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card, backgroundColor: C.white,
      padding: 32,
    },
    code: {
      fontSize: 48, fontWeight: '800', fontFamily: Font.extraBold,
      color: C.lightGray,
    },
    title: {
      fontSize: 18, fontWeight: '800', fontFamily: Font.extraBold,
      color: C.black,
    },
    body: {
      fontSize: 13, fontFamily: Font.regular,
      color: C.gray, textAlign: 'center',
    },
    homeBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 8,
      backgroundColor: C.teal, borderWidth: 1, borderColor: C.black,
      borderRadius: Radius.card, paddingHorizontal: 24, paddingVertical: 13,
    },
    homeBtnText: {
      fontSize: 14, fontWeight: '700', fontFamily: Font.bold,
      color: C.white,
    },
  });
}
