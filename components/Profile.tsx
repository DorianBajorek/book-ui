import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView, Modal, Share, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserData } from '../authentication/UserData';
import BooksList from './BooksList';
import BarcodeScanner from './BarcodeScanner';
import LoadingSpinner from './LoadingSpinner';
import { getUserData } from '../BooksService';
import { useFocusEffect } from '@react-navigation/native';

const Profile = ({ route }) => {
  const navigation = useNavigation();
  const { userName, isCreateOfferInProgress, token } = useUserData();
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profileName, setProfileName] = useState('');
  const [isModalScanner, setIsModalScanner] = useState(false);
  const { owner } = route.params;

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        if (token && profileName) {
          const data = await getUserData(token, profileName);
          if (data) {
            setEmail(data.email || '');
            setPhoneNumber(data.phoneNumber || '');
          }
        }
      };
  
      fetchData();
    }, [token, profileName])
  );

  useEffect(() => {
    if (owner) {
      setProfileName(owner);
    } else {
      setProfileName(userName);
    }
  }, [owner, userName]);

  const toggleModal = () => {
    setIsModalScanner(!isModalScanner);
  };

  const shareProfile = async () => {
    try {
      const result = await Share.share({
        message: 'Odwiedź profil użytkownika: https://www.drugaksiazka.pl/profile/' + profileName,
        url: 'https://www.drugaksiazka.pl/profile/' + profileName,
        title: 'Profil użytkownika',
      });
    } catch (error) {
      Alert.alert('Error sharing', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        {owner !== userName && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeIcon}>
            <Text style={styles.closeIconText}>X</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Profil użytkownika</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileContainer}>
          <Image source={require('../img/avatar.png')} style={styles.avatar} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Nazwa użytkownika:</Text>
            <Text style={styles.infoValue}>{profileName}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.infoValue}>{email}</Text>
          </View>

          {phoneNumber && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Numer telefonu:</Text>
              <Text style={styles.infoValue}>{phoneNumber}</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {owner === userName && (
            <TouchableOpacity style={styles.button} onPress={toggleModal}>
              <Text style={styles.buttonText}>Dodaj książkę</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={shareProfile}>
            <Text style={styles.buttonText}>Udostępnij profil</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
        {profileName && <BooksList username={profileName} />}
      </ScrollView>

      <Modal
        visible={isModalScanner}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={toggleModal} style={styles.modalCloseIcon}>
              <Text style={styles.closeIconText}>X</Text>
            </TouchableOpacity>
            <LoadingSpinner visible={isCreateOfferInProgress} />
            <BarcodeScanner toggleModal={toggleModal} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f7f9fc',
  },
  modalCloseIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  closeIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  closeIcon: {
    position: 'absolute',
    right: 20,
    top: 10,
  },
  closeIconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 15,
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
    width: '90%',
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
