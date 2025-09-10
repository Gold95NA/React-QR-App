import { Stack } from 'expo-router';

export default function FavoritesStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Favorites' }} />
    </Stack>
  );
}