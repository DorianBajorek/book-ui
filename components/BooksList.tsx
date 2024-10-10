import React from 'react';
import { View, Image, ScrollView, StyleSheet, Text } from 'react-native';
import atomoweNawyki from '../img/atomowe-nawyki.jpg';
import jobs from '../img/jobs.png';
import teoriaLiczb from '../img/teoria-liczb.png';
import goggins from '../img/goggins.png';
import korwin from '../img/korwin.jpg';
import pulapka from '../img/pulapka.jpg';
import wedrowka from '../img/wedrowka.png';

const books = [
  { id: '1', image: atomoweNawyki, title: 'Atomowe Nawyki', description: 'Drobne zmiany, niezwykłe efekty' },
  { id: '2', image: jobs, title: 'Steve Jobs', description: 'Biografia współzałożyciela Apple' },
  { id: '3', image: teoriaLiczb, title: 'Teoria Liczb', description: 'Podstawy matematyki i teorii liczb' },
  { id: '4', image: goggins, title: 'David Goggins', description: 'Nie można mnie złamać' },
  { id: '5', image: korwin, title: 'Korwin-Mikke', description: 'Moje poglądy polityczne' },
  { id: '6', image: pulapka, title: 'Pułapka', description: 'Jak unikać życiowych pułapek' },
  { id: '7', image: wedrowka, title: 'Wędrówka', description: 'Wędrówka przez rozwiązywanie nierówności' },
];

const BooksList = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {books.map((book) => (
        <View key={book.id} style={styles.bookContainer}>
          <Image source={book.image} style={styles.bookImage} />
          <View style={styles.textContainer}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookDescription}>{book.description}</Text>
          </View>
        </View>
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
