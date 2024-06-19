import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";

import Login from './Login';
import Signup from './Signup';
import Controller from './Controller';
import Screen1 from './Screen1';
import AutoControl from './AutoControl';

const Stack = createStackNavigator();

function StackScreen() {
  return (
      <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Controller" component={Controller} options={{ headerShown: false }} />
          <Stack.Screen name="Screen1" component={Screen1} options={{ headerShown: false }} />
          <Stack.Screen name="AutoControl" component={AutoControl} options={{ headerShown: false }} />
      </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StackScreen/>
    </NavigationContainer>
  );
}

