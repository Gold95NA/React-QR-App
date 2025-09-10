import React, { useMemo } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFavorites } from '../../../src/context/FavoritesContext';
import { router } from 'expo-router';

export default function FavoritesList() {
  const { favorites } = useFavorites();
  const data = useMemo(() => favorites, [favorites]);

  const openDetail = (item) => {
    router.push({ pathname: '/tabs/products/product', params: { url: item.url } });
  };

  if (data.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyTitle}>No favorites yet</Text>
        <Text style={styles.emptyHint}>Scan a product and tap the heart on its detail screen.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ padding: 12 }}
      data={data}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <Pressable onPress={() => openDetail(item)} style={styles.row}>
          <Image source={{ uri: item.image }} style={styles.thumb} />
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
          </View>
        </Pressable>
      )}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', padding: 12, borderRadius: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  thumb: { width: 64, height: 64, borderRadius: 8, marginRight: 12, backgroundColor: '#eee' },
  title: { fontSize: 16, fontWeight: '600' },
  price: { marginTop: 4, color: '#16a34a', fontWeight: '600' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptyHint: { color: '#6b7280', textAlign: 'center' },
});