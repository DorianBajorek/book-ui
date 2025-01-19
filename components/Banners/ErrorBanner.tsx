import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type ErrorBannerProps = {
  message: string;
};

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF0F0',
    borderColor: '#BD1B0F',
    borderWidth: 2,
    padding: 10,
    marginBottom: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
    position: 'absolute',
    top: 0,
    zIndex: 1000,
  },
  text: {
    color: '#BD1B0F',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ErrorBanner;
