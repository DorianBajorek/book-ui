import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CloseButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.closeIcon}>
      <Text style={styles.closeIconText}>X</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closeIcon: {
    position: 'absolute',
    right: 20,
    top: 10,
    zIndex: 1,
    backgroundColor: '#e74c3c',
    padding: 5,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 10,
  },
  closeIconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default CloseButton;
