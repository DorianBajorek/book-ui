import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Text, Image, ScrollView } from 'react-native';
import { useUserData } from '../authentication/UserData';
import { getOffersByQuery } from '../BooksService';

type NavigationProp = {
  navigate: (screen: string) => void;
};

const SearchScreen = ({ navigation }: { navigation: NavigationProp }) => {
  const { token } = useUserData();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setResults([]);
      return;
    }
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(async () => {
      try {
        const data = await getOffersByQuery(token, searchQuery);
        if (data) {
          setResults(data);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }, 500);
    setDebounceTimeout(newTimeout);

    return () => {
      if (newTimeout) {
        clearTimeout(newTimeout);
      }
    };
  }, [searchQuery, token]);

  const handleBookPress = (book) => {
    const owner = book.user;
    navigation.navigate('BookDetails', { book, owner });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Znajdź książkę po tytule</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Wyszukaj..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView contentContainerStyle={styles.resultsContainer}>
        {results.length > 0 ? (
          results.map((item, index) => (
            <TouchableOpacity key={index} style={styles.resultContainer} onPress={() => handleBookPress(item)}>
              <Image
                source={{
                  uri: item.cover_book.replace('/media/', '/media/cover_images/'),
                }}
                style={styles.bookImage}
              />
              <View style={styles.textContainer}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookDescription}>
                  Autor: {item.author ? item.author : 'Brak'}
                </Text>
                <Text style={styles.bookDescription}>Użytkownik: {item.user}</Text>
                <Text style={styles.bookDescription}>Cena: {item.price}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResultsText}>Brak wyników</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultsContainer: {
    paddingTop: 20,
  },
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
  noResultsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
  },
});

export default SearchScreen;
