import { Stack } from 'expo-router';
import { useEffect } from 'react';
import {
  useFonts,
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold,
  JetBrainsMono_800ExtraBold,
} from '@expo-google-fonts/jetbrains-mono';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
    JetBrainsMono_800ExtraBold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="book/[id]" />
      <Stack.Screen name="thread/[id]" />
      <Stack.Screen name="add-book" options={{ presentation: 'modal' }} />
      <Stack.Screen name="scan-barcode" options={{ presentation: 'modal' }} />
      <Stack.Screen name="add-book-manual" options={{ presentation: 'modal' }} />
      <Stack.Screen name="borrow-request/[lenderId]" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
