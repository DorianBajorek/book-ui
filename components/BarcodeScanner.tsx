import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BarcodeScanner() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [value, setValue] = useState('');
  const [cameraVisible, setCameraVisible] = useState(true); // Dodany stan do kontrolowania widoczności kamery

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }) => {
    console.log('DATA: ' + data);
    setValue(data); // Ustawienie zeskanowanego kodu
    setCameraVisible(false); // Ukrycie kamery po zeskanowaniu
  };

  return (
    <View style={styles.container}>
      {cameraVisible ? (
        <CameraView
          style={styles.camera}
          facing={facing}
          onBarcodeScanned={handleBarcodeScanned}
        />
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.scannedText}>Zeskanowany kod: {value}</Text>
          {/* Możesz dodać przycisk do ponownego skanowania */}
          <TouchableOpacity style={styles.button} onPress={() => setCameraVisible(true)}>
            <Text style={styles.buttonText}>Skanuj ponownie</Text>
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
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4682B4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
