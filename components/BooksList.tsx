import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getUserOffers } from '../BooksService';
import { useUserData } from '../authentication/UserData';
import { useNavigation } from '@react-navigation/native';

const BooksList = () => {
  const { token, userName, isCreateOfferInProgress, isDeleteOfferInProgress } = useUserData();
  const [books, setBooks] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getUserOffers(token);
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [token, navigation, isCreateOfferInProgress, isDeleteOfferInProgress]);

  const handleBookPress = (book: any) => {
    navigation.navigate('BookDetails', { book, owner: userName });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {books.map((item) => (
        <TouchableOpacity key={item.offer_id} onPress={() => handleBookPress(item)} style={styles.bookContainer}>
          <Image 
            source={{ uri: item.cover_book.replace("/media/", "/media/cover_images/") }}
            style={styles.bookImage} 
          />
          <View style={styles.textContainer}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookDescription}>Author: {item.author}</Text>
            <Text style={styles.bookDescription}>Condition: {item.condition}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  bookContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  bookImage: {
    width: 100,
    height: 150,
    borderRadius: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bookDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default BooksList;
