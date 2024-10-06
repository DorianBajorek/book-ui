import React from 'react';
import { View, Image, StyleSheet, FlatList, Dimensions } from 'react-native';
import atomoweNawyki from '../img/atomowe-nawyki.jpg';
import jobs from '../img/jobs.png';
import teoriaLiczb from '../img/teoria-liczb.png';
import goggins from '../img/goggins.png'
import korwin from '../img/korwin.jpg'
import pulapka from '../img/pulapka.jpg'
import wedrowka from  '../img/wedrowka.png'

const books = [
  { id: '1', image: atomoweNawyki },
  { id: '2', image: jobs },
  { id: '3', image: teoriaLiczb },
  { id: '4', image: goggins },
  { id: '5', image: korwin },
  { id: '6', image: pulapka },
  { id: '7', image: wedrowka },
];

const { width: screenWidth } = Dimensions.get('window');

const BookSlider = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.bookContainer}>
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
