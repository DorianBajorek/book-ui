import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { createOffer } from '../BooksService';
import { useUserData } from '../authentication/UserData';
import Icon from 'react-native-vector-icons/Ionicons';

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isbnCode, setIsbnCode] = useState('');
  const [cameraVisible, setCameraVisible] = useState(true);
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
  const [backPhoto, setBackPhoto] = useState<string | null>(null);
  const [photoMode, setPhotoMode] = useState<'none' | 'front' | 'back'>('none');
  const cameraRef = useRef<CameraView>(null);
  const { token, setIsCreateOfferInProgress, isCreateOfferInProgress } = useUserData();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }) => {
    console.log('DATA: ' + data);
    setIsbnCode(data);
    setCameraVisible(false);
    setFacing('back');
    setPhotoMode('none');
  };

  async function takePicture() {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
      if (photoMode === 'front') {
        setFrontPhoto(photoData.uri);
      } else if (photoMode === 'back') {
        setBackPhoto(photoData.uri);
      }
      setPhotoMode('none');
      setCameraVisible(false);
    }
  }

  const saveBook = async () => {
    console.log(isbnCode + " " + token + " " + frontPhoto + "  " + backPhoto);
    await createOffer(isbnCode, token, frontPhoto || "", backPhoto || "", "10");
  };

  return (
    <View style={styles.container}>
      {cameraVisible ? (
        photoMode === 'none' ? (
          <View style={styles.cameraContainer}>
            <Text style={styles.scanningMessage}>Zeskanuj kod książki</Text>
            <CameraView
              style={styles.scanner}
              facing={facing}
              onBarcodeScanned={handleBarcodeScanned}
            />
          </View>
        ) : (
          <View style={styles.cameraContainer}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing={facing}
            >
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonPhoto} onPress={takePicture}>
                <Icon name="camera" size={40} color="#fff" />
                </TouchableOpacity>
              </View>
            </CameraView>
          </View>
        )
      ) : (
        <View style={styles.resultContainer}>
          {frontPhoto && backPhoto && (
          <View style={styles.photoSection}>
            <View style={styles.photosRow}>
                {frontPhoto && (
            <Image source={{ uri: frontPhoto }} style={styles.smallPhoto} />
          )}
          {backPhoto && (
            <Image source={{ uri: backPhoto }} style={styles.smallPhoto} />
          )}
            </View>
          </View>
        )}
        {frontPhoto && !backPhoto && (
            <View style={styles.photoSection}>
              <Text style={styles.message}>Front Photo:</Text>
              <Image source={{ uri: frontPhoto }} style={styles.smallPhoto} />
            </View>
          )}

          {!frontPhoto && backPhoto && (
            <View style={styles.photoSection}>
              <Text style={styles.message}>Back Photo:</Text>
              <Image source={{ uri: backPhoto }} style={styles.smallPhoto} />
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setCameraVisible(true);
              setPhotoMode('none');
            }}
          >
            <Text style={styles.buttonText}>Skanuj ponownie</Text>
          </TouchableOpacity>
        </View>
      )}

      {photoMode === 'none' && isbnCode && (
        <View style={styles.resultContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setPhotoMode('front');
              setCameraVisible(true);
            }}
          >
            <Text style={styles.buttonText}>Dodaj zdjęcie przodu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setPhotoMode('back');
              setCameraVisible(true);
            }}
          >
            <Text style={styles.buttonText}>Dodaj zdjęcie tyłu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={saveBook}
          >
            <Text style={styles.buttonText}>Zapisz</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  cameraContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  scanner: {
    height: '80%',
    width: '80%',
    aspectRatio: 3 / 4,
    borderRadius: 10,
    overflow: 'hidden',
    margin: 'auto',
    alignSelf: 'center',
  },
  camera: {
    height: '80%',
    width: '80%',
    aspectRatio: 3 / 4,
    borderRadius: 10,
    overflow: 'hidden',
    margin: 'auto',
    alignSelf: 'center',
  },
  resultContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#e0e0e0',
    padding: 5,
    borderRadius: 20,
    margin: 5,
    width: 200,
  },
  buttonPhoto: {
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 50,
    margin: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  photoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  photoSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  photosRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallPhoto: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 10,
  },
  buttonText: {
    color: '#2b92c2',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scanningMessage: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
});
