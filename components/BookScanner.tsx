import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert, ScrollView } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as ImagePicker from 'expo-image-picker';
import { createOffer } from '../BooksService';
import { useUserData } from '../authentication/UserData';
import LoadingSpinner from './LoadingSpinner';

type BookScannerProps = {
  isVisible: boolean;
  onClose: () => void;
};

const BookScanner: React.FC<BookScannerProps> = ({ isVisible, onClose }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isbnCode, setIsbnCode] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [isManualAdd, setIsManualAdd] = useState(false);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const { token, setIsCreateOfferInProgress, isCreateOfferInProgress } = useUserData();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };
    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setIsbnCode(data);
  };

  const handleSaveButton = async () => {
    setIsCreateOfferInProgress(true);
    await createOffer(isbnCode, token, frontImage, backImage);
    setIsCreateOfferInProgress(false);
    resetForm();
    onClose();
  };

  const handleAddManually = () => {
    setIsManualAdd(true);
    setScanned(false);
  };

  const handleBackToScanner = () => {
    resetForm();
  };

  const resetForm = () => {
    setIsManualAdd(false);
    setScanned(false);
    setIsbnCode('');
    setBookTitle('');
    setFrontImage(null);
    setBackImage(null);
  };

  const pickImage = async (setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissions required', 'We need access to your camera to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImage(result.assets[0].uri);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Modal transparent={true} visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {isManualAdd ? 'Dodaj manualnie' : 'Zeskanuj kod kreskowy'}
          </Text>

          {isManualAdd ? (
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.row}>
                <Text style={styles.label}>ISBN:</Text>
                <TextInput style={styles.input} value={isbnCode} onChangeText={setIsbnCode} placeholder="Wprowadź ISBN" />
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Title:</Text>
                <TextInput style={styles.input} value={bookTitle} onChangeText={setBookTitle} placeholder="Wprowadź tytuł" />
              </View>
              <TouchableOpacity style={styles.secondaryButton} onPress={handleBackToScanner}>
                <Text style={styles.secondaryButtonText}>Wróć do skanera</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : scanned ? (
            <>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => pickImage(setFrontImage)}>
                <Text style={styles.secondaryButtonText}>Dodaj przód książki</Text>
              </TouchableOpacity>
              {frontImage && <Image source={{ uri: frontImage }} style={styles.image} />}
              <TouchableOpacity style={styles.secondaryButton} onPress={() => pickImage(setBackImage)}>
                <Text style={styles.secondaryButtonText}>Dodaj tył książki</Text>
              </TouchableOpacity>
              {backImage && <Image source={{ uri: backImage }} style={styles.image} />}
            </>
          ) : (
            <View style={styles.scannerContainer}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={styles.barcodeScanner}
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.saveButton, (!isbnCode || !frontImage || !backImage) && styles.disabledButton]}
            onPress={handleSaveButton}
            disabled={!isbnCode || !frontImage || !backImage}
          >
            <Text style={styles.saveButtonText}>Zapisz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryButtonText}>Wyjdź</Text>
          </TouchableOpacity>

          <LoadingSpinner visible={isCreateOfferInProgress} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  scannerContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  barcodeScanner: {
    width: '100%',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: '#666',
    width: 90,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
    alignSelf: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4682B4',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 15,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  secondaryButton: {
    backgroundColor: '#f1f1f1',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#4682B4',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookScanner;
