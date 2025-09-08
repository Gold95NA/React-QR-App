import { Stack } from 'expo-router';

export default function ProductsLayout() {
  return (
    <Stack>
      <Stack.Screen name="scanner" options={{ title: 'Scan Product QR' }} />
    </Stack>
  );
}