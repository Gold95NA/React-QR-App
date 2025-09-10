import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => { if (!permission) requestPermission(); }, [permission]);

  if (!permission) {
    return <View style={styles.center}><Text>Requesting camera permission…</Text></View>;
  }
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.err}>Camera permission is required.</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  const onBarcodeScanned = ({ data, type }) => {
    if (scanned) return;
    if (type !== 'qr') return; 
    setScanned(true);

    router.push({ pathname: '/(scanner)/product', params: { url: data } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.scannerBox}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={scanned ? undefined : onBarcodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
      </View>
      <View style={styles.footer}>
        {scanned ? (
          <Button title="Scan Again" onPress={() => setScanned(false)} />
        ) : (
          <Text style={styles.hint}>Point at e.g. https://dummyjson.com/products/1</Text>
        )}
        {Platform.OS === 'android' && <Text style={styles.small}>Tip: increase brightness.</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  scannerBox: { flex: 1, overflow: 'hidden', borderRadius: 16, margin: 16 },
  footer: { padding: 16, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  hint: { color: '#666', marginTop: 8, textAlign: 'center' },
  err: { color: '#c00', fontWeight: '600', textAlign: 'center' },
  small: { color: '#999', marginTop: 8, fontSize: 12, textAlign: 'center' },
});