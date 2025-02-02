import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text, KeyboardAvoidingView, Platform, Modal, Pressable, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { registerGoogle, registerUser } from '../BooksService';
import { useUserData } from './UserData';
import ErrorBanner from '../components/Banners/ErrorBanner';
import simpleLogo from '../img/googleLogo.png';
import {
  GoogleSignin,
} from "@react-native-google-signin/google-signin"
import LoadingSpinner from '../components/LoadingSpinner';

type RootStackParamList = {
  Main: undefined;
  Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const Register: React.FC<Props> = ({ navigation }) => {

  GoogleSignin.configure({
    webClientId: '894874389822-vus90gg05gp7p6n8g5roor2nibcsli3b.apps.googleusercontent.com',
    scopes: [],
  });


  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRegisterInProgress, setIsRegisterInProgress] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [showPasswordDetailsModal, setShowPasswordDetailsModal] = useState(false);
  const { updateToken, updateUserName, updateEmail, updatePhoneNumber } = useUserData();

  useEffect(() => {
      navigation.setOptions({
        title: 'Rejestracja',
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#2773A5',
        },
      });
    }, [navigation]);

  const showError = (message: string) => {
    setRegisterError(message);
    setTimeout(() => {
      setRegisterError(null);
    }, 3000);
  };

  const handleRegister = async () => {
    if (!email || !username || !password || !confirmPassword) {
      showError('Uzupełnij obowiązkowe pola.');
      return;
    }

    if (password !== confirmPassword) {
      showError('Hasła nie są zgodne.');
      return;
    }

    try {
      setIsRegisterInProgress(true)
      const data = await registerUser(email, username, password, phoneNumber);
      setIsRegisterInProgress(false);
      if (data) {
        updateToken(data.token);
        updateUserName(data.username);
        updateEmail(data.email);
        updatePhoneNumber(data?.phoneNumber);
        navigation.replace('Main');
      }
    } catch (error: any) {
      showError(error.response.data.error[0] ?? "");
      setIsRegisterInProgress(false);
    }
  };

  const signIn = async () => {
    try {
      const isSignedIn = await GoogleSignin.signOut();
      if (isSignedIn) {
        await GoogleSignin.signOut();
      }
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken
      if(idToken) {
        setIsRegisterInProgress(true);
        await handleGoogleLogin(idToken)
      }
    } catch (error) {
      showError("Nieprawidłowe logowanie, spróbuj ponownie.")
      setIsRegisterInProgress(false);
    }
  }

  const handleGoogleLogin = async (code: string) => {
    try {
      const data = await registerGoogle(code);
      if (data) {
        updateToken(data.token);
        updateUserName(data.username);
        updateEmail(data.email);
        navigation.replace('Main');
      }
    } catch (error) {
      showError("Nieprawidłowe logowanie, spróbuj ponownie.")
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
      <LoadingSpinner visible={isRegisterInProgress} />
      {registerError && <ErrorBanner message={registerError} />}

      <View style={styles.formContainer}>
        <Text style={styles.label}>E-mail:</Text>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#333"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Nazwa użytkownika:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nazwa użytkownika"
          placeholderTextColor="#333"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Hasło:
        <Text style={styles.infoIcon} onPress={() => setShowPasswordDetailsModal(true)}>
            ℹ️
          </Text>
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Hasło"
            placeholderTextColor="#333"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.showPasswordButton}
          >
            <Text style={styles.showPasswordText}>{isPasswordVisible ? 'Ukryj' : 'Pokaż'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Powtórz hasło:</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Powtórz hasło"
            placeholderTextColor="#333"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!isConfirmPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
            style={styles.showPasswordButton}
          >
            <Text style={styles.showPasswordText}>{isConfirmPasswordVisible ? 'Ukryj' : 'Pokaż'}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>
          Numer telefonu (opcjonalne):{' '}
          <Text style={styles.infoIcon} onPress={() => setIsModalVisible(true)}>
            ℹ️
          </Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Numer telefonu"
          placeholderTextColor="#333"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Zarejestruj się</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton} onPress={signIn}>
          <Image
            source={simpleLogo}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Zarejestruj się przez Google</Text>
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
              Podaj numer telefonu, aby klienci mogli się z Tobą skontaktować – zwiększa to szanse na sprzedaż i ułatwia nawiązanie relacji. Numer telefonu będzie dostępny dla wszystkich klientów Druga Książka.</Text>
            <Pressable style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButtonText}>Zamknij</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
      transparent={true}
      visible={showPasswordDetailsModal}
      animationType="fade"
      onRequestClose={() => setShowPasswordDetailsModal(false)}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>
            Hasło powinno spełniać następujące wymagania:
            {'\n'}- Minimum 8 znaków.{"\n"}
            - Co najmniej 1 wielka litera.{"\n"}
            - Co najmniej 1 znak specjalny (np. !@#$%^&*()).{"\n"}
            - Co najmniej 1 cyfra.
          </Text>
          <Pressable
            style={styles.closeButton}
            onPress={() => setShowPasswordDetailsModal(false)}
          >
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
    height: 50,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: '#fafafa',
    color: '#333',
  },
  button: {
    backgroundColor: '#3C709A',
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
    fontSize: 17,
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
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  
  googleIcon: {
    position: 'absolute',
    left: 15,
    width: 35,
    height: 35
  },
  
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },  

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },

  showPasswordButton: {
    position: 'absolute',
    right: 12,
    top: 5,
    padding: 10,
  },
  showPasswordText: {
    fontSize: 14,
    color: '#4682B4',
    fontWeight: '600',
  },
});

export default Register;
