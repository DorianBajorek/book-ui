// TabNavigator.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeView from '../HomeView';
import Profile from './Profile';

const Tab = createBottomTabNavigator(); 

const SearchScreen = () => (
  <View style={styles.container}>
    <Text>Search Screen</Text>
  </View>
);

const SettingsScreen = () => (
  <View style={styles.container}>
    <Text>Settings Screen</Text>
  </View>
);

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeView} 
        options={{ 
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{ 
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ 
          tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />
        }} 
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabNavigator;
