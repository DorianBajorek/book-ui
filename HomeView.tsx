import React from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = {
  navigate: (screen: string) => void;
};

const HomeView = ({ navigation }: { navigation: NavigationProp }) => {
  return (
    <View style={styles.container}>
      <Button
        title="Go to Screen 1"
        onPress={() => navigation.navigate('Screen1')}
      />
      <Button
        title="Go to Screen 2"
        onPress={() => navigation.navigate('Screen2')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeView;
