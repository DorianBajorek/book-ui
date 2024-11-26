import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, } from 'react-native';
import { createOffer } from '../BooksService';
import { useUserData } from '../authentication/UserData';
import Icon from 'react-native-vector-icons/Ionicons';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import Slider from '@react-native-community/slider';

type BarcodeScannerProps = {
  toggleModal: () => void;
};

export default function BarcodeScanner({ toggleModal }: BarcodeScannerProps) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isbnCode, setIsbnCode] = useState('');
  const [cameraVisible, setCameraVisible] = useState(true);
  const [frontPhoto, setFrontPhoto] = useState<string | null>(null);
  const [backPhoto, setBackPhoto] = useState<string | null>(null);
  const [photoMode, setPhotoMode] = useState<'none' | 'front' | 'back'>('none');
  const [amount, setAmount] = useState(10);
  const cameraRef = useRef<CameraView>(null);
  const { token, setIsCreateOfferInProgress } = useUserData();

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

  const handleBarcodeScanned = ({ type, data }) => {
    if (type === 'ean13') {
      setIsbnCode(data);
      setCameraVisible(false);
      setFacing('back');
      setPhotoMode('none');
    }
  };

  async function takePicture() {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
  
      const compressedPhoto = await manipulateAsync(
        photoData.uri,
        [
          { rotate: 0 },
        ],
        { compress: 0.7, format: SaveFormat.JPEG }
      );
  
      if (photoMode === 'front') {
        setFrontPhoto(compressedPhoto.uri);
      } else if (photoMode === 'back') {
        setBackPhoto(compressedPhoto.uri);
      }
  
      setPhotoMode('none');
      setCameraVisible(false);
    }
  }

  const saveBook = async () => {
    setIsCreateOfferInProgress(true);
    await createOffer(isbnCode, token, frontPhoto || "", backPhoto || "", amount.toString());
    setIsCreateOfferInProgress(false);
    toggleModal()
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
              barCodeScannerSettings={{
                barCodeTypes: ['ean13'],
              }}
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
              <Image source={{ uri: frontPhoto }} style={styles.smallPhoto} />
            </View>
          )}

          {!frontPhoto && backPhoto && (
            <View style={styles.photoSection}>
              <Image source={{ uri: backPhoto }} style={styles.smallPhoto} />
            </View>
          )}
        </View>
      )}

      {photoMode === 'none' && isbnCode && (
        <View style={styles.resultContainer}>
          {!frontPhoto && (
            <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setPhotoMode('front');
              setCameraVisible(true);
            }}
          >
            <Text style={styles.buttonText}>Dodaj zdjęcie przodu</Text>
          </TouchableOpacity>
          )}

         {!backPhoto && (
           <TouchableOpacity
           style={styles.button}
           onPress={() => {
             setPhotoMode('back');
             setCameraVisible(true);
           }}
         >
           <Text style={styles.buttonText}>Dodaj zdjęcie tyłu</Text>
         </TouchableOpacity>
         )}
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderText}>Kwota: {amount} PLN</Text>
            <Slider
              style={styles.slider}
              minimumValue={5}
              maximumValue={100}
              step={1}
              value={amount}
              onValueChange={(value) => setAmount(value)}
              minimumTrackTintColor="#2b92c2"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#2b92c2"
            />
          </View>

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
    margin: -5,
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
    width: 140,
    height: 170,
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
  sliderContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  sliderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slider: {
    width: 300,
    height: 40,
  },
});
