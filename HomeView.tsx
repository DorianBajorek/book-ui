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
        title="Go to Register"
        onPress={() => navigation.navigate('Register')}
      />
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate('Login')}
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
