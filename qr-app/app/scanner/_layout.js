import { Stack } from 'expo-router';

export default function ScannerLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Scan Product QR' }} />
      <Stack.Screen name="product" options={{ title: 'Product Details' }} />
    </Stack>
  );
}