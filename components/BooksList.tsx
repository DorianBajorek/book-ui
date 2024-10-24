import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getUserBooks } from '../BooksService';
import { useUserData } from '../authentication/UserData';
import { useNavigation } from '@react-navigation/native';

const BooksList = () => {
  const { token, userName } = useUserData();
  const [books, setBooks] = useState([]);
  const prefixUrl = "http://192.168.100.9:8000";
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getUserBooks(token);
        console.log(data)
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [token]);

  const handleBookPress = (book: any) => {
    navigation.navigate('BookDetails', { book, owner: userName });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {books.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => handleBookPress(item)} style={styles.bookContainer}>
          <Image 
            source={{ uri: prefixUrl + item.book.cover_image.replace("/media/", "/media/cover_images/") }} 
            style={styles.bookImage} 
          />
          <View style={styles.textContainer}>
            <Text style={styles.bookTitle}>{item.book.title}</Text>
            <Text style={styles.bookDescription}>Author: {item.book.author}</Text>
            <Text style={styles.bookDescription}>Condition: {item.condition}</Text>
            {/* <Text style={styles.bookDescription}>LOL: {item.front_image}</Text> */}
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
