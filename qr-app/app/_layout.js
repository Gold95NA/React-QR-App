//Anthony Nalle

import { Slot } from 'expo-router';
import { FavoritesProvider } from '../src/context/FavoritesContext';

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Slot />
    </FavoritesProvider>
  );
}