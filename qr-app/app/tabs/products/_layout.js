import { Stack } from 'expo-router';

export default function ProductsLayout() {
  return (
    <Stack initialRouteName="scanner">
      <Stack.Screen name="scanner" options={{ title: 'Scan QR Code' }} />
      <Stack.Screen name="product" options={{ title: 'Product Details' }} />
    </Stack>
  );
}