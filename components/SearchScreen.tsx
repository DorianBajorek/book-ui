import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TextInput, Text, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useUserData } from '../authentication/UserData';
import { getLastAddedOffers, getOffersByQuery } from '../BooksService';
import OffersList from './OffersList';

type NavigationProp = {
  navigate: (screen: string) => void;
};

const SearchScreen = ({ navigation }: { navigation: NavigationProp }) => {
  const { token } = useUserData();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastAddedBooks, setLastAddedBooks] = useState([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchedBooks([]);
      return;
    }
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(async () => {
      try {
        const data = await getOffersByQuery(token, searchQuery);
        if (data) {
          setSearchedBooks(data);
        } else {
          setSearchedBooks([]);
        }
      } catch (error) {
      }
    }, 500);
    setDebounceTimeout(newTimeout);

    return () => {
      if (newTimeout) {
        clearTimeout(newTimeout);
      }
    };
  }, [searchQuery, token]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const data = await getLastAddedOffers(token);
          if (data) {
            setLastAddedBooks(data);
          }
        } catch (error) {
          console.error('Error fetching last added offers:', error);
        }
      };

      fetchData();
    }, [token])
  );

  const handleBookPress = (book) => {
    const owner = book.username;
    navigation.navigate('BookDetails', { book, owner });
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Wyszukiwarka</Text>
      </View>
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
          {searchedBooks.length > 0 && searchQuery.length > 0 ? (
            <OffersList books={searchedBooks} onBookPress={handleBookPress} />
          ) : searchedBooks.length == 0 && searchQuery.length > 0 ? (
            <Text style={styles.noResultsText}>Brak wyników</Text>
          ) : (
            <>
              <Text style={styles.titleText}>Ostatenio dodane książki</Text>
              <OffersList books={lastAddedBooks} onBookPress={handleBookPress} />
            </>
          )}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#f4f4f4',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
  },
  resultsContainer: {
    paddingTop: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 30,
  },
});

export default SearchScreen;
