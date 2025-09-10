import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@favorites'; 

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]); 

  
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setFavorites(JSON.parse(raw));
      } catch (e) {
        console.warn('Failed to load favorites', e);
      }
    })();
  }, []);

  
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(KEY, JSON.stringify(favorites));
      } catch (e) {
        console.warn('Failed to save favorites', e);
      }
    })();
  }, [favorites]);

  const isFavorite = useCallback((id) => favorites.some(p => p.id === id), [favorites]);

  const toggleFavorite = useCallback((product) => {
    setFavorites(prev => {
      const exists = prev.some(p => p.id === product.id);
      return exists ? prev.filter(p => p.id !== product.id) : [product, ...prev];
    });
  }, []);

  const value = useMemo(() => ({
    favorites, isFavorite, toggleFavorite
  }), [favorites, isFavorite, toggleFavorite]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}