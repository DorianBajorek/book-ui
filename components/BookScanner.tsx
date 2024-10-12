import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

type BookScannerProps = {
    isVisible: boolean;
    onClose: () => void;
  };
  
const BookScanner: React.FC<BookScannerProps> = ({ isVisible, onClose }) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [isbnCode, setIsbnCode] = useState('');

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getBarCodeScannerPermissions();
    }, []);

    // const handleBarCodeScanned = ({ type, data: string }) => {
    const handleBarCodeScanned = (type: any, data: string) => {
        setScanned(true);
        setIsbnCode(data);
        console.log(`Scanned ISBN: ${data}`);
    };

    const handleSaveButton = () => {
        console.log(isbnCode);
        onClose();
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
                    <Text style={styles.modalTitle}>Scan ISBN Code</Text>
                    <View style={styles.scannerContainer}>
                        {scanned ? (
                            <>
                                <Text style={styles.label}>Scanned ISBN: {isbnCode}</Text>
                                <Button title={'Scan Again'} onPress={() => setScanned(false)} />
                            </>
                        ) : (
                            <BarCodeScanner
                                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                                style={styles.barcodeScanner}
                            />
                        )}
                    </View>
                    <Button title="Save" onPress={handleSaveButton} />
                    <Button title="Close" onPress={onClose} />
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
    label: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
        textAlign: 'center',
    },
});

export default BookScanner;
