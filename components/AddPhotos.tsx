import React, { useState } from 'react';
import { View, Modal, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const PhotoPickerModal: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [firstPhoto, setFirstPhoto] = useState<string | null>(null);
  const [secondPhoto, setSecondPhoto] = useState<string | null>(null);

  const pickImage = async (setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Uprawnienia wymagane', 'Potrzebujemy dostępu do aparatu, aby zrobić zdjęcie.');
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

  const resetPhotos = () => {
    setFirstPhoto(null);
    setSecondPhoto(null);
  };

  return (
    <View style={styles.container}>
      <Button title="Zrób zdjęcia" onPress={() => setModalVisible(true)} />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Button title="Zrób pierwsze zdjęcie" onPress={() => pickImage(setFirstPhoto)} />
          {firstPhoto && <Image source={{ uri: firstPhoto }} style={styles.image} />}

          <Button title="Zrób drugie zdjęcie" onPress={() => pickImage(setSecondPhoto)} />
          {secondPhoto && <Image source={{ uri: secondPhoto }} style={styles.image} />}

          <Button title="Zapisz i zamknij" onPress={() => setModalVisible(false)} />
          <Button title="Zresetuj zdjęcia" onPress={resetPhotos} color="red" />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
});

export default PhotoPickerModal;
