import React from 'react';
import AppNavigation from './src/navigation/AppNavigation';
import { StyleSheet, View } from 'react-native';
import { ToastProvider } from './src/component/toast/ToastProvider';
import NetworkListener from './src/component/network/NetworkListener';
import { Colors } from './src/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <ToastProvider>
        <NetworkListener />
        <AppNavigation />
      </ToastProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
})