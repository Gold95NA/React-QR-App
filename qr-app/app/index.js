import { View, Text, StyleSheet } from 'react-native';

export default function Home() {
  return (
    <View style={styles.c}>
      <Text style={styles.h1}>Welcome 👋</Text>
      <Text>Open the right drawer → “Products (QR Scanner)”.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  c: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  h1: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
});