import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { useUserData } from '../authentication/UserData';
import { deleteUser, updateUserPhoneNumber } from '../BooksService';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CloseButton from './CloseButton';

type EditProfileModalProps = {
  visible: boolean;
  onClose: () => void;
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose }) => {
  const [newPhone, setNewPhone] = useState('');
  const { userName, email, token, updatePhoneNumber, setIsEditProfileInProgress, deleteUserStorageData } = useUserData();
  const [isDeleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  const handleSave = async () => {
    try {
      setIsEditProfileInProgress(true);
      await updateUserPhoneNumber(newPhone, token);
      setIsEditProfileInProgress(false);
      updatePhoneNumber(newPhone);
      onClose();
    } catch (error) {
      console.error(error); 
    }
  };

  const handleDeleteAccount = async () => {
    await deleteUser(token)
    deleteUserStorageData();
    setDeleteConfirmVisible(false);
  };

  const toggleDeleteConfirm = () => {
    console.log("XD")
    setDeleteConfirmVisible(!isDeleteConfirmVisible);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity
            style={styles.deleteProfileButton}
            onPress={toggleDeleteConfirm}
          >
            <Ionicons name="trash" size={24} color="#f44336" />
          </TouchableOpacity>

          <CloseButton onPress={onClose} />
          
          <Text style={styles.title}>Edycja profilu</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Nazwa użytkownika</Text>
            <TextInput
              style={styles.input}
              value={userName}
              editable={false}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              editable={false}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Numer telefonu</Text>
            <TextInput
              style={styles.input}
              value={newPhone}
              onChangeText={setNewPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.buttonText}>Zapisz</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {isDeleteConfirmVisible && (
        <Modal
          transparent
          animationType="fade"
          visible={isDeleteConfirmVisible}
          onRequestClose={() => setDeleteConfirmVisible(false)}
        >
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <Text style={styles.title}>Czy na pewno chcesz usunąć konto?</Text>
              <View style={styles.buttonGroup}>
                <TouchableOpacity onPress={handleDeleteAccount} style={styles.saveButton}>
                  <Text style={styles.buttonText}>Tak</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDeleteConfirmVisible(false)} style={styles.cancelButton}>
                  <Text style={styles.buttonText}>Nie</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    width: '100%',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteProfileButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex:2
  }
});

export default EditProfileModal;
