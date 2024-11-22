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
        const data = await getUserOffers(token, userName);
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
      {books?.map((item) => (
        <TouchableOpacity 
          key={item.offer_id} 
          onPress={() => handleBookPress(item)} 
          style={styles.bookContainer}
          activeOpacity={0.8}
        >
          <Image 
            source={{ uri: item.cover_book.replace("/media/", "/media/cover_images/").replace("http", "https")}}
            style={styles.bookImage} 
          />
          <View style={styles.textContainer}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookDescription}>Autor: {item.author || "Brak"}</Text>
            <Text style={styles.bookDescription}>Cena: {item.price + ",00 zł" || "Brak"}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'flex-start',
  },
  bookContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    width: '100%',
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 10,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  bookDescription: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
    lineHeight: 20,
  },
});

export default BooksList;
