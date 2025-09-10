import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../../src/context/FavoritesContext';

const parseIdFromProductUrl = (urlString) => {
  try {
    const u = new URL(urlString);
    const m = u.pathname.match(/^\/products\/(\d+)\/?$/);
    return m ? Number(m[1]) : null;
  } catch {
    return null;
  }
};

export default function ProductDetail() {
  const { url } = useLocalSearchParams();
  const navigation = useNavigation();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const productId = useMemo(() => parseIdFromProductUrl(String(url ?? '')), [url]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(productId));
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!productId) {
        setError('Invalid product URL. Expected https://dummyjson.com/products/:id');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`https://dummyjson.com/products/${productId}`);
        if (!res.ok) throw new Error(`Request failed ${res.status}`);
        const json = await res.json();
        if (active) setData(json);
      } catch (e) {
        if (active) setError(String(e));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [productId]);

  useLayoutEffect(() => {
    if (!data && !productId) return;
    const fav = isFavorite(productId ?? -1);
    navigation.setOptions({
      headerLeft: undefined, 
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            if (!data) return;
            toggleFavorite({
              id: data.id,
              title: data.title,
              price: data.price,
              image: data.images?.[0] ?? data.thumbnail,
              url: `https://dummyjson.com/products/${data.id}`,
            });
            const nowFav = !fav;
            Alert.alert(nowFav ? 'Added to Favorites' : 'Removed from Favorites', data.title);
          }}
          accessibilityLabel={fav ? 'Unfavorite' : 'Favorite'}
        >
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={26} color={fav ? '#e11d48' : '#222'} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, data, isFavorite, toggleFavorite, productId, favorites]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading product…</Text>
      </View>
    );
  }
  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || 'Product not found'}</Text>
      </View>
    );
  }

  const firstImage = data.images?.[0] ?? data.thumbnail;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: firstImage }} style={styles.image} resizeMode="cover" />
      <View style={styles.card}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.price}>${Number(data.price).toFixed(2)}</Text>
        <Text style={styles.desc}>{data.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  container: { paddingBottom: 24 },
  image: { width: '100%', height: 260 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  price: { fontSize: 20, fontWeight: '600', color: '#16a34a', marginBottom: 8 },
  desc: { color: '#4b5563', lineHeight: 20 },
  error: { color: '#b91c1c', textAlign: 'center' },
});