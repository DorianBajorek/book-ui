import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { addBookToProfile, getUserBooks, securedEndpoint} from '../BooksService';
import { UserData, useUserData } from '../authentication/UserData';

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
    const { token } = useUserData();

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
        console.log(`Scanned ISBN: ${data}`);
    };

    const handleSaveButton = () => {
        console.log(`Saved ISBN: ${isbnCode}, Title: ${bookTitle}`);
        console.log("TOKEN: " + token)
        addBookToProfile(isbnCode, token)
        onClose();
    };

    const handleAddManually = () => {
        setIsManualAdd(true);
        setScanned(false);
    };

    const handleAddBook = () => {
        console.log(`Book added with ISBN: ${isbnCode}, Title: ${bookTitle}`);
        setIsManualAdd(false);
        setScanned(false);
        setIsbnCode('');
        setBookTitle('');
    };

    const handleBackToScanner = () => {
        setIsManualAdd(false);
        setScanned(false);
        setIsbnCode('');
        setBookTitle('');
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
                    <View style={styles.scannerContainer}>
                        {isManualAdd ? (
                            <View>
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
                        ) : scanned ? (
                            <>
                                <Text style={styles.label}>Scanned ISBN: {isbnCode}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Book Title"
                                    value={bookTitle}
                                    onChangeText={setBookTitle}
                                />
                                <Button title={'Scan Again'} onPress={() => setScanned(false)} />
                            </>
                        ) : (
                            <BarCodeScanner
                                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                                style={styles.barcodeScanner}
                            />
                        )}
                    </View>
                    {!isManualAdd && <Button title="Add Manually" onPress={handleAddManually} />}
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 18,
        color: '#333',
        width: 80, // Szerokość, aby kontrolować odstępy
    },
    input: {
        height: 40,
        width: 150,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 8,
        borderRadius: 5,
    },
});

export default BookScanner;
