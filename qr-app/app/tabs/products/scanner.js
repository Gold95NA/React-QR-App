import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();

  const [scanned, setScanned] = useState(false);

  const [scanningEnabled, setScanningEnabled] = useState(false);

  const navigatingRef = useRef(false);
  const lastScanTsRef = useRef(0);
  const focusTimerRef = useRef(null);

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  useFocusEffect(
    useCallback(() => {
      setScanned(false);
      setScanningEnabled(false);
      focusTimerRef.current = setTimeout(() => setScanningEnabled(true), 600); 
      return () => {
        if (focusTimerRef.current) clearTimeout(focusTimerRef.current);
        setScanningEnabled(false);
      };
    }, [])
  );

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Requesting camera permission…</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.err}>Camera permission is required to scan QR codes.</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  const onBarcodeScanned = ({ data, type }) => {
    if (!scanningEnabled) return;
    if (scanned) return;
    if (type !== 'qr') return;

    const now = Date.now();
    if (now - lastScanTsRef.current < 1200) return; 
    if (navigatingRef.current) return;

    lastScanTsRef.current = now;
    navigatingRef.current = true;
    setScanned(true);

    router.push({ pathname: '/tabs/products/product', params: { url: data } });

    setTimeout(() => { navigatingRef.current = false; }, 1000);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanningEnabled && !scanned ? onBarcodeScanned : undefined}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
      />
      <View style={styles.footer}>
        {scanned ? (
          <Button title="Scan Again" onPress={() => setScanned(false)} />
        ) : (
          <Text style={styles.hint}>
            Point at a product QR, e.g. https://dummyjson.com/products/1
          </Text>
        )}
        {Platform.OS === 'android' && (
          <Text style={styles.small}>Tip: increase brightness for faster scans.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  footer: { padding: 16, backgroundColor: '#fff' },
  hint: { color: '#666', marginTop: 8, textAlign: 'center' },
  err: { color: '#c00', fontWeight: '600', textAlign: 'center' },
  small: { color: '#999', marginTop: 8, fontSize: 12, textAlign: 'center' },
});