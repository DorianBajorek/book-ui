import React from 'react';
import { View, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const BookSlider = ({ books, navigation, username }) => {
  
  const handleBookPress = (book) => {
    navigation.navigate('BookDetails', { book, owner: username });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.offer_id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleBookPress(item)}>
            <View style={styles.bookContainer}>
              <Image 
                source={{ uri: item.frontImage.replace('http', 'https') }} 
                style={styles.bookImage} 
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  bookContainer: {
    width: screenWidth * 0.4,
    height: screenWidth * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  bookImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});

export default BookSlider;
