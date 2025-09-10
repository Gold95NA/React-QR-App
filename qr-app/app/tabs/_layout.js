import { Tabs } from 'expo-router';
import { FavoritesProvider } from '../../src/context/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <FavoritesProvider>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="products"
          options={{
            title: 'Scanner',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="qr-code-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart-outline" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </FavoritesProvider>
  );
}