import React from 'react';
import { View, Image, StyleSheet, FlatList, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const BookSlider = ({ books }: { books: { id: string; image: any }[] }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.bookContainer}>
            {console.log(item.image)}
            <Image source={item.image} style={styles.bookImage} />
          </View>
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
