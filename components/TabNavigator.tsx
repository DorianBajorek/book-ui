import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeView from '../HomeView';
import Profile from './Profile';
import SearchScreen from './SearchScreen';
import { useUserData } from '../authentication/UserData';

const Tab = createBottomTabNavigator();

const SettingsScreen = () => (
  <View style={styles.container}>
    <Text>Settings Screen</Text>
  </View>
);

const TabNavigator = () => {
  const { token } = useUserData();

  return (
    <Tab.Navigator>
      {token ? (
        <>
          <Tab.Screen 
            name="Home" 
            component={HomeView} 
            options={{ 
              tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
            }} 
          />
          <Tab.Screen 
            name="MarketPlace" 
            component={SearchScreen} 
            options={{ 
              tabBarIcon: ({ color }) => <Ionicons name="storefront-outline" size={24} color={color} />
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
        </>
      ) : (
        <Tab.Screen 
          name="Home" 
          component={HomeView} 
          options={{ 
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
          }} 
        />
      )}
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
