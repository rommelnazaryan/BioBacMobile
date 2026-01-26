// src/navigation/Navigation.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet} from 'react-native';
import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';
import type {RootStackParamList} from './types';
import { OfflineBanner } from '@/component/OffliceBanner';
import Splash from '@/screen/Splash';
//-------------Auth----------------
import SignIn from '@/screen/Auth/SignIn';

import Tabs from '@/navigation/TabNavigation';
import { Colors } from '@/theme/Colors';
import useNetworkStore from '@/zustland/networkStore';


const Stack = createNativeStackNavigator<RootStackParamList>();



export default function AppNavigation() {
  const isConnected = useNetworkStore(s => s.isConnected);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={styles.container}
        >
          {isConnected === false && <OfflineBanner /> }
        <StatusBar barStyle="dark-content"/>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false ,gestureEnabled: false}}>
            <Stack.Screen name="Splash" component={Splash}/>
            <Stack.Screen name="SignIn" component={SignIn}/>
            <Stack.Screen name="Tabs" component={Tabs}/>
          </Stack.Navigator>
        </NavigationContainer>
        
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Colors.background
  },
});

