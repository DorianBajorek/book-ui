import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, TextInput, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useUserData } from '../authentication/UserData';
import { getLastAddedOffers, getOffersByQuery } from '../BooksService';
import OffersList from './OffersList';
import { useFocusEffect } from '@react-navigation/native';

type NavigationProp = {
  navigate: (screen: string) => void;
};

const PAGE_SIZE = 10;

const SearchScreen = ({ navigation }: { navigation: NavigationProp }) => {
  const { token } = useUserData();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastAddedBooks, setLastAddedBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoResults, setHasNoResults] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const loadLastAddedOffers = async (pageNumber: number, isFirstLoading: boolean) => {
    setIsLoading(true);
    try {
      const data = await getLastAddedOffers(token, PAGE_SIZE.toString(), pageNumber.toString());
      if(isFirstLoading){
        setLastAddedBooks(data)
      } else {
        setLastAddedBooks((prevBooks) => [...prevBooks, ...data]);
      }
    } catch (error) {
      console.error('Error fetching last added offers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initialize = () => {
    setPage(0);
    loadLastAddedOffers(0, true);
    flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
  };

  useFocusEffect(
    React.useCallback(() => {
      initialize()
    }, [])
  );

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchedBooks([]);
      setHasNoResults(false);
      return;
    }

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(async () => {
      try {
        const data = await getOffersByQuery(token, searchQuery);
        if (data && data.length > 0) {
          setSearchedBooks(data);
          setHasNoResults(false);
        } else {
          setSearchedBooks([]);
          setHasNoResults(true);
        }
      } catch (error) {
        setSearchedBooks([]);
        setHasNoResults(true);
      }
    }, 500);
    setDebounceTimeout(newTimeout);

    return () => {
      if (newTimeout) {
        clearTimeout(newTimeout);
      }
    };
  }, [searchQuery, token]);

  const handleLoadMore = () => {
    if (!isLoading) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        loadLastAddedOffers(nextPage, false);
        return nextPage;
      });
    }
  };

  const handleBookPress = (book) => {
    const owner = book.username;
    navigation.navigate('BookDetails', { book, owner });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchedBooks([]);
    setHasNoResults(false);
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
          {searchQuery.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
              <Text style={styles.clearText}>X</Text>
            </TouchableOpacity>
          )}
        </View>
        {searchQuery.length > 0 && searchedBooks.length > 0 ? (
          <FlatList
          data={searchedBooks}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => <OffersList books={[item]} onBookPress={handleBookPress} />}
          ListFooterComponent={hasNoResults ? <Text style={styles.noResultsText}>Brak wyników</Text> : null}
        />
        ) : hasNoResults ? (
          <Text style={styles.noResultsText}>Brak wyników</Text>
        ) : (
          <FlatList
            ref={flatListRef}
            data={lastAddedBooks}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item }) => (
              <OffersList books={[item]} onBookPress={handleBookPress} />
            )}
            ListFooterComponent={
              isLoading ? (
                <ActivityIndicator size="large" color="#333" />
              ) : null
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
          />
        )}
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
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearText: {
    fontSize: 18,
    color: '#999',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 30,
  },
});

export default SearchScreen;
