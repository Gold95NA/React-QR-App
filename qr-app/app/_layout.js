import { Drawer } from 'expo-router/drawer';

export default function RootLayout() {
  return (
    <Drawer screenOptions={{ drawerPosition: 'right' }}>
      {}
      <Drawer.Screen name="index" options={{ title: 'Home' }} />
      {}
      <Drawer.Screen
        name="(products)"
        options={{ title: 'Products (QR Scanner)' }}
      />
    </Drawer>
  );
}