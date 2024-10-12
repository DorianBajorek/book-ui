import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Image } from 'react-native';
import { useUserData } from '../authentication/UserData';
import BooksList from './BooksList';
import BookScanner from './BookScanner';

const Profile = () => {
  const { email, userName } = useUserData();
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require('../img/avatar.png')} style={styles.avatar} />
        
        <Text style={styles.title}>Profile Screen</Text>
        <Text style={styles.label}>Email: {email}</Text>
        <Text style={styles.label}>Username: {userName}</Text>
      </View>
        <View style={styles.buttonContainer}>
          <Button title="Add book to collection" onPress={toggleModal} />
        </View>

        {/* <AddBookModal isVisible={isModalVisible} onClose={toggleModal} /> */}
        <BookScanner  isVisible={isModalVisible} onClose={toggleModal} />
        <BooksList />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  buttonContainer: {
    marginVertical: 20,
    width: '50%',
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default Profile;
