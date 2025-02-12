import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal, Image } from 'react-native';
import { useUserData } from '../authentication/UserData';
import { deleteOffer } from '../BooksService';
import LoadingSpinner from './LoadingSpinner';
import CloseButton from './CloseButton';
import { featureFlippersMessages } from './Constatns';

const BookDetails = ({ route, navigation }) => {
  const { book, owner } = route.params;
  const { userName, token, setIsDeleteOfferInProgress, isDeleteOfferInProgress } = useUserData();

  const images = [
    ...(book.smallfrontImage || book.frontImage
      ? [{
          id: '2',
          small: book.smallfrontImage ? book.smallfrontImage.replace("http", "https") : book.frontImage.replace("http", "https"),
          large: book.frontImage ? book.frontImage.replace("http", "https") : null,
        }]
      : []),
    ...(book.smallbackImage || book.backImage
      ? [{
          id: '3',
          small: book.smallbackImage ? book.smallbackImage.replace("http", "https") : book.backImage.replace("http", "https"),
          large: book.backImage ? book.backImage.replace("http", "https") : null,
        }]
      : []),
  ];
  

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImagePress = (image) => {
    setSelectedImage({ uri: image.large });
    setModalVisible(true);
  };

  const handleDeleteOffer = async () => {
    Alert.alert(
      "Potwierdź usuwanie.",
      "Jesteś pewny, że chcesz usunąć ofertę?",
      [
        { text: "Anuluj", style: "cancel" },
        { text: "Usuń", style: "destructive", onPress: async () => {
            try {
              setIsDeleteOfferInProgress(true);
              await deleteOffer(token, book.offer_id);
              setIsDeleteOfferInProgress(false);
              Alert.alert("Sukces", "Książka została usunięta poprawnie.");
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "Failed to delete the offer.");
              console.error(error);
            }
          }
        }
      ]
    );
  };

  const handleViewProfile = () => {
    navigation.navigate('Profile', { owner });
  };

  return (
    <>
      <LoadingSpinner visible={isDeleteOfferInProgress} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerContainer}>
          <CloseButton onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Oferta</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.card}>
          <View style={styles.imagesContainer}>
            {images.map((img) => img.small && img.large && (
              <TouchableOpacity key={img.id} onPress={() => handleImagePress(img)}>
                <Image source={{ uri: img.small }} style={styles.image} />
              </TouchableOpacity>
            ))}
          </View>

            <Text style={styles.bookTitle}>{book.title}</Text>

            <View style={styles.detailsContainer}>
              <Text style={styles.bookDetail}>
                <Text style={styles.label}>Użytkownik: </Text>
                {userName !== owner ? (
                  <Text
                    style={{ color: '#007bff', textDecorationLine: 'underline' }}
                    onPress={handleViewProfile}
                  >
                    {owner}
                  </Text>
                ) : (
                  <Text>
                    {owner}
                  </Text>
                )}
              </Text>
              <Text style={styles.bookDetail}>
                <Text style={styles.label}>Cena: </Text>{book.price + ",00 zł"}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {userName !== owner ? (
              featureFlippersMessages ? (
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chat', { recipient: owner })}>
                  <Text style={styles.buttonText}>Napisz wiadomość do właściciela</Text>
                </TouchableOpacity>
              ) : null
            ) : (
              <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteOffer}>
                <Text style={styles.buttonText}>Usuń ofertę</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalCloseButtonText}>X</Text>
          </TouchableOpacity>
          <Image
            source={selectedImage}
            style={styles.modalImage}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  headerContainer: {
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 20,
    width: '100%',
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 150,
    height: 200,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  detailsContainer: {
    alignItems: 'flex-start',
    width: '100%',
    marginTop: 10,
  },
  bookDetail: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 10,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
});

export default BookDetails;
