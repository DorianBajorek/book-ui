import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useUserData } from '../authentication/UserData';
import BookSlider from './BookSlider';
import { deleteOffer } from '../BooksService';
import LoadingSpinner from './LoadingSpinner';

const BookDetails = ({ route, navigation }) => {
  const { book, owner } = route.params;
  const { userName, token, setIsDeleteOfferInProgress, isDeleteOfferInProgress } = useUserData();
  
  const images = [
    { id: '1', image: { uri: book.cover_book.replace("/media/", "/media/cover_images/").replace("http", "https") } },
    ...(book.frontImage ? [{ id: '2', image: { uri: book.frontImage.replace("http", "https") } }] : []),
    ...(book.backImage ? [{ id: '3', image: { uri: book.backImage.replace("http", "https") } }] : []),
  ];

  const handleDeleteOffer = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this offer?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
            try {
              setIsDeleteOfferInProgress(true);
              await deleteOffer(token, book.offer_id);
              setIsDeleteOfferInProgress(false);
              Alert.alert("Success", "Offer deleted successfully.");
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

  const handleSendMessageToOwner = () => {
    navigation.navigate('Chat', { recipient: owner });
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.card}>
          <BookSlider books={images} />
          <Text style={styles.bookTitle}>{book.title}</Text>

          <Text style={styles.bookDescription}>
            {book.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum."}
          </Text>

          <View style={styles.detailsContainer}>
            <Text style={styles.bookDetail}>
              <Text style={styles.label}>Autor: </Text>{book.author || "Brak"}
            </Text>
            <Text style={styles.bookDetail}>
              <Text style={styles.label}>Użytkownik: </Text>{owner}
            </Text>
            <Text style={styles.bookDetail}>
              <Text style={styles.label}>Cena: </Text>{book.price + ",00 zł"}
            </Text>
            <Text style={styles.bookDetail}>
              <Text style={styles.label}>ISBN: </Text>{book.isbn}
            </Text>
          </View>
        </View>

        <LoadingSpinner visible={isDeleteOfferInProgress} />

        <View style={styles.buttonContainer}>
          {userName !== owner ? (
            <TouchableOpacity style={styles.button} onPress={handleSendMessageToOwner}>
              <Text style={styles.buttonText}>Napisz wiadomość do właściciela</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteOffer}>
              <Text style={styles.buttonText}>Usuń ofertę</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
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
    backgroundColor: 'red', // Red for delete button
  },
});

export default BookDetails;
