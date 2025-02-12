import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

type Book = {
  title: string;
  author?: string;
  username: string;
  price: number;
  frontImage?: string;
  smallfrontImage?: string;
};

type OffersListProps = {
  books: Book[];
  onBookPress: (book: Book) => void;
};

const OffersList = ({ books, onBookPress }: OffersListProps) => {
  return (
    <View>
      {books.map((item, index) => {
        const imageUri = item.smallfrontImage 
          ? item.smallfrontImage.replace('http', 'https')
          : item.frontImage
          ? item.frontImage.replace('http', 'https')
          : null;

        return (
          <TouchableOpacity
            key={index}
            style={styles.resultContainer}
            onPress={() => onBookPress(item)}
          >
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.bookImage} />
            )}
            <View style={styles.textContainer}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookDescription}>
                Autor: {item.author ? item.author : 'Brak'}
              </Text>
              <Text style={styles.bookDescription}>Użytkownik: {item.username}</Text>
              <Text style={styles.bookDescription}>Cena: {item.price},00 zł</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  resultContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  bookImage: {
    width: 90,
    height: 130,
    borderRadius: 10,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  bookDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default OffersList;
