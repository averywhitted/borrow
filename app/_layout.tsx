import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="book/[id]" />
      <Stack.Screen name="thread/[id]" />
      <Stack.Screen name="add-book" options={{ presentation: 'modal' }} />
      <Stack.Screen name="borrow-request/[lenderId]" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
