import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeView from '../HomeView';
import Profile from './Profile';
import SearchScreen from './SearchScreen';
import { useUserData } from '../authentication/UserData';
import MessagesScreen from './MessagesScreen';
import { featureFlippersMessages, featureFlippersSettings } from './Constatns';

const Tab = createBottomTabNavigator();

const SettingsScreen = () => (
  <View style={styles.container}>
    <Text>Settings Screen</Text>
  </View>
);

const TabNavigator = () => {
  const { token } = useUserData();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Tab.Screen 
            name="Start" 
            component={HomeView} 
            options={{ 
              tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />
            }} 
          />
          <Tab.Screen 
            name="Ogłoszenia" 
            component={SearchScreen} 
            options={{ 
              tabBarIcon: ({ color }) => <Ionicons name="storefront-outline" size={24} color={color} />
            }} 
          />
          <Tab.Screen 
            name="Profil" 
            component={Profile}
            options={{ 
              tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />
            }} 
          />
          {featureFlippersMessages && (
            <Tab.Screen 
              name="Wiadomości" 
              component={MessagesScreen} 
              options={{ 
                tabBarIcon: ({ color }) => <Ionicons name="chatbubble-outline" size={24} color={color} />
              }} 
            />
          )}
          {featureFlippersSettings && (
            <Tab.Screen 
            name="Ustawienia" 
            component={SettingsScreen} 
            options={{ 
              tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />
            }} 
          />
          )}
        </>
      ) : (
        <Tab.Screen 
          name="Start" 
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
