import type {Node} from 'react';
import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/Screens/Home';
import LoginScreen from './src/Screens/Login';
import VerifyScreen from './src/Screens/Verify';
import {NavigationContainer} from '@react-navigation/native';
import {
  Context as AuthContext,
  Provider as AuthProvider,
} from './src/context/AuthContext';
import SplashScreen from './src/Screens/SplashScreen';

const Stack = createStackNavigator();

const App: () => Node = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Verify" component={VerifyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};
