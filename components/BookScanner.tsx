import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, StyleSheet, TextInput, Image, Alert, ScrollView } from 'react-native';
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
  const [frontImage, setfrontImage] = useState<string | null>(null);
  const [backImage, setbackImage] = useState<string | null>(null);
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
    setfrontImage(null);
    setbackImage(null);
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
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {isManualAdd ? 'Add Book Manually' : 'Scan ISBN Code'}
          </Text>

          {isManualAdd ? (
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <View style={styles.scannerContainer}>
                <View style={styles.row}>
                  <Text style={styles.label}>ISBN:</Text>
                  <TextInput
                    style={styles.input}
                    value={isbnCode}
                    onChangeText={setIsbnCode}
                  />
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Title:</Text>
                  <TextInput
                    style={styles.input}
                    value={bookTitle}
                    onChangeText={setBookTitle}
                  />
                </View>
                <Button title="Back to Scanner" onPress={handleBackToScanner} />
              </View>
            </ScrollView>
          ) : scanned ? (
            <>
              <Button title={'Scan Again'} onPress={() => setScanned(false)} />
              <Button title={'Add Front of Book'} onPress={() => pickImage(setfrontImage)} />
              {frontImage && <Image source={{ uri: frontImage }} style={styles.image} />}
              <Button title={'Add Back of Book'} onPress={() => pickImage(setbackImage)} />
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

          {!isManualAdd && <Button title="Add Manually" onPress={handleAddManually} />}
          <Button title="Save" onPress={handleSaveButton} disabled={!isbnCode || !frontImage || !backImage} />
          <Button title="Close" onPress={onClose} />

          {/* Dodanie LoadingSpinner */}
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
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    color: '#333',
    width: 80,
  },
  input: {
    height: 40,
    width: 150,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 5,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BookScanner;
