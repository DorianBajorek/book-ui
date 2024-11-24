import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text, KeyboardAvoidingView, Platform, Modal, Pressable } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { registerUser } from '../BooksService';
import { useUserData } from './UserData';
import ErrorBanner from '../components/Banners/ErrorBanner';

type RootStackParamList = {
  Main: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const Register: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { updateToken, updateUserName, updateEmail, updatePhoneNumber } = useUserData();

  const showError = (message: string) => {
    setRegisterError(message);
    setTimeout(() => {
      setRegisterError(null);
    }, 3000);
  };

  const handleRegister = async () => {
    if (!email || !username || !password || !confirmPassword) {
      showError('Wszystkie pola są wymagane.');
      return;
    }

    if (password !== confirmPassword) {
      showError('Hasła nie są zgodne.');
      return;
    }

    try {
      const data = await registerUser(email, username, password, phoneNumber);
      if (data) {
        updateToken(data.token);
        updateUserName(data.username);
        updateEmail(data.email);
        updatePhoneNumber(data?.phoneNumber)
        navigation.replace('Main');
      } else {
        showError('Wystąpił błąd. Spróbuj ponownie.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Wystąpił błąd. Spróbuj ponownie.';
      showError(errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
      {registerError && <ErrorBanner message={registerError} />}

      <View style={styles.formContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Nazwa użytkownika:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nazwa użytkownika"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Hasło:</Text>
        <TextInput
          style={styles.input}
          placeholder="Hasło"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Text style={styles.label}>Powtórz hasło:</Text>
        <TextInput
          style={styles.input}
          placeholder="Powtórz hasło"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Text style={styles.label}>
          Numer telefonu (opcjonalne):{' '}
          <Text style={styles.infoIcon} onPress={() => setIsModalVisible(true)}>
            ℹ️
          </Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Numer telefonu"
          placeholderTextColor="#888"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Zarejestruj</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Podaj numer telefonu, aby klienci mogli się z Tobą skontaktować – zwiększa to szanse na sprzedaż i ułatwia nawiązanie relacji.
            </Text>
            <Pressable style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Zamknij</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f7',
  },
  formContainer: {
    width: '90%',
    padding: 25,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  button: {
    backgroundColor: '#4682B4',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoIcon: {
    fontSize: 18,
    color: '#4682B4',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#4682B4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Register;
