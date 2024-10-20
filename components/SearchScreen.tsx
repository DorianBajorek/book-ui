import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Text, Image, ScrollView } from 'react-native';
import { useUserData } from '../authentication/UserData';
import { findBooks } from '../BooksService';

type NavigationProp = {
  navigate: (screen: string) => void;
};

const SearchScreen = ({ navigation }: { navigation: NavigationProp }) => {
  const { token } = useUserData();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const prefixUrl = "http://192.168.100.9:8000";

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
        const data = await findBooks(token, searchQuery);
        if (data) {
          setResults(data.results);
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

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Find book using name or ISBN code</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={() => {}}>
          <Image
            source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/search.png' }}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.resultsContainer}>
        {results.length > 0 ? (
          results.map((item, index) => (
            <View key={index} style={styles.resultContainer}>
              <Image
                source={{ 
                  uri: item.cover_image.replace("/media/", "/media/cover_images/") 
                }}
                style={styles.bookImage}
              />
              <View style={styles.textContainer}>
                <Text style={styles.bookTitle}>{item.book_title}</Text>
                <Text style={styles.bookDescription}>Condition: {item.condition}</Text>
                <Text style={styles.bookDescription}>User: {item.user}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noResultsText}>No results found</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  searchButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  resultsContainer: {
    paddingTop: 20,
  },
  resultContainer: {
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
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SearchScreen;