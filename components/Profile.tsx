import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Modal, Share, Alert  } from 'react-native';
import { useUserData } from '../authentication/UserData';
import BooksList from './BooksList';
import BarcodeScanner from './BarcodeScanner';
import LoadingSpinner from './LoadingSpinner';

const Profile = () => {
  const { email, userName, isCreateOfferInProgress } = useUserData();
  const [isModalScanner, setIsModalScanner] = useState(false);

  const toggleModal = () => {
    setIsModalScanner(!isModalScanner);
  };

  const shareProfile = async () => {
    try {
      const result = await Share.share({
        message: 'Odwiedź profil użytkownika: https://www.drugaksiazka.pl/profile/' + userName ,
        url: 'https://www.drugaksiazka.pl/profile/' + userName,
        title: 'Profil użytkownika',
      });
    } catch (error) {
      Alert.alert('Error sharing', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Profil użytkownika</Text>
      </View>
        <View style={styles.profileContainer}>
          <Image source={require('../img/avatar.png')} style={styles.avatar} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Nazwa użytkownika:</Text>
            <Text style={styles.infoValue}>{userName}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.infoValue}>{email}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleModal}>
            <Text style={styles.buttonText}>Dodaj książkę</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={shareProfile}>
            <Text style={styles.buttonText}>Udostępnij profil</Text>
          </TouchableOpacity>
        </View>
        

        <View style={styles.separator} />

        <BooksList />
      </ScrollView>

      <Modal
        visible={isModalScanner}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <LoadingSpinner visible={isCreateOfferInProgress} />
            <BarcodeScanner toggleModal={toggleModal}/>
            <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
              <Text style={styles.closeButtonText}>Zamknij</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f7f9fc',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    backgroundColor: '#f7f9fc',
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4682B4',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 18,
    color: '#333',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4682B4',
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#4682B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    width: '45%',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    minHeight: '60%',
    justifyContent: 'flex-end',
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  closeButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignSelf: 'center',
    marginBottom: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;
