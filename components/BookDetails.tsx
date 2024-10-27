import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import { useUserData } from '../authentication/UserData';
import BookSlider from './BookSlider';
import { deleteOffer } from '../BooksService';

const BookDetails = ({ route, navigation }) => {
  const { book, owner } = route.params;
  const { userName, token } = useUserData();
  const images = [
    { id: '1', image: { uri: book.cover_book.replace("/media/", "/media/cover_images/") } },
    ...(book.frontImage ? [{ id: '2', image: { uri: book.frontImage } }] : []),
    ...(book.backImage ? [{ id: '3', image: { uri: book.backImage } }] : []),
  ];

  const handleDeleteOffer = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this offer?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: async () => {
            try {
              console.log("TOKEN: " + token)
              await deleteOffer(token, book.offer_id);
              Alert.alert("Offer deleted successfully.");
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

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <BookSlider books={images} />

        <Text style={styles.bookTitle}>{book.title}</Text>

        <Text style={styles.bookDescription}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada.
        </Text>

        <View style={styles.detailsContainer}>
          <Text style={styles.bookDetail}><Text style={styles.label}>Author: </Text>{book.author}</Text>
          <Text style={styles.bookDetail}><Text style={styles.label}>Condition: </Text>{book.condition}</Text>
          <Text style={styles.bookDetail}><Text style={styles.label}>ISBN: </Text>{book.isbn}</Text>
          <Text style={styles.bookDetail}><Text style={styles.label}>For Sale: </Text>{book.is_for_sale ? 'Yes' : 'No'}</Text>
          <Text style={styles.bookDetail}><Text style={styles.label}>Owner: </Text>{owner}</Text>
        </View>
        
        {userName !== owner ? (
          <Button title="Send a message to the owner" onPress={() => {}} />
        ) : (
          <Button title="Delete Offer" color="red" onPress={handleDeleteOffer} />
        )}
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
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: -150,
    textAlign: 'center',
    color: '#333',
  },
  bookDescription: {
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 10,
    textAlign: 'center',
    color: '#666',
  },
  detailsContainer: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
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
});

export default BookDetails;
