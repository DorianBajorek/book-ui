import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

const AddBookModal = ({ isVisible, onClose }) => {
    const [newTitle, setNewTitle] = useState("");

    const handleSaveButton = () => {
        console.log(newTitle);
        onClose();
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
                    <Text style={styles.modalTitle}>Add book</Text>
                    <Text style={styles.label}>Title</Text>

                    <TextInput 
                        style={styles.input} 
                        placeholder="Enter new title" 
                        value={newTitle}
                        onChangeText={setNewTitle}
                    />

                    <Button title="Save" onPress={handleSaveButton} />
                    <Button title="Cancel" onPress={onClose} color="red" />
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
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingLeft: 10,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
    },
});

export default AddBookModal;
