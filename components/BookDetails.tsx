import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useUserData } from '../authentication/UserData';
import BookSlider from './BookSlider';
import Profile from './Profile';
import { deleteOffer } from '../BooksService';
import LoadingSpinner from './LoadingSpinner';
import { featureFlippersMessages } from './Constatns';
import CloseButton from './CloseButton';

const BookDetails = ({ route, navigation }) => {
  const { book, owner } = route.params;
  const { userName, token, setIsDeleteOfferInProgress, isDeleteOfferInProgress } = useUserData();
  const [viewProfile, setViewProfile] = useState(false);

  const images = [
    { id: '1', image: { uri: book.cover_book.replace("/media/", "/media/cover_images/").replace("http", "https") } },
    ...(book.frontImage ? [{ id: '2', image: { uri: book.frontImage.replace("http", "https") } }] : []),
    ...(book.backImage ? [{ id: '3', image: { uri: book.backImage.replace("http", "https") } }] : []),
  ];

  const handleDeleteOffer = async () => {
    Alert.alert(
      "Potwierdź usuwanie.",
      "Jesteś pewny, że chcesz usunąć ofertę?",
      [
        { text: "Anuluj", style: "cancel" },
        { text: "Usuń", style: "destructive", onPress: async () => {
            try {
              setIsDeleteOfferInProgress(true);
              await deleteOffer(token, book.offer_id);
              setIsDeleteOfferInProgress(false);
              Alert.alert("Sukces", "Książka została usunięta poprawnie.");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "Failed to delete the offer.");
              console.error(error);
            }
          }
        }
      ]
    );
  };

  const handleViewProfile = () => {
    setViewProfile(true);
  };

  if (viewProfile) {
    return <Profile route={{ params: { owner } }} />;
  }

  return (
    <>
    <LoadingSpinner visible={isDeleteOfferInProgress} />
    <ScrollView style={styles.scrollView}>
      <View style={styles.headerContainer}>
        <CloseButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Oferta</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.card}>
          <BookSlider books={images} />
          <Text style={styles.bookTitle}>{book.title}</Text>

          <View style={styles.detailsContainer}>
            <Text style={styles.bookDetail}>
              <Text style={styles.label}>Użytkownik: </Text>
              <Text
                style={{ color: '#007bff', textDecorationLine: 'underline' }}
                onPress={handleViewProfile}
              >
                {owner}
              </Text>
            </Text>
            <Text style={styles.bookDetail}>
              <Text style={styles.label}>Cena: </Text>{book.price + ",00 zł"}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {userName !== owner ? (
            featureFlippersMessages ? (
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chat', { recipient: owner })}>
                <Text style={styles.buttonText}>Napisz wiadomość do właściciela</Text>
              </TouchableOpacity>
            ) : null
          ) : (
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteOffer}>
              <Text style={styles.buttonText}>Usuń ofertę</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  closeIcon: {
    position: 'absolute',
    right: 20,
    top: 10,
    zIndex: 1,
    backgroundColor: '#fff',
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
    color: '#333',
    textAlign: 'center',
  },
  headerContainer: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 20,
    width: '100%',
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  bookDescription: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    color: '#666',
  },
  detailsContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 10,
  },
  bookDetail: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
});

export default BookDetails;
