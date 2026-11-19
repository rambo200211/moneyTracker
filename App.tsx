// NativeWind සඳහා
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { initDatabase } from './src/database/db';

import HomeScreen from './src/screens/HomeScreen';
import AddScreen from './src/screens/AddScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// පහළින් තියෙන Tabs
function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#2563eb' }}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color} /> }} 
      />
      <Tab.Screen 
        name="History" 
        component={HistoryScreen} 
        options={{ tabBarIcon: ({color}) => <Ionicons name="time" size={24} color={color} /> }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    initDatabase(); // Database එක මුලින්ම සකස් කරන්න
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="Add" component={AddScreen} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}