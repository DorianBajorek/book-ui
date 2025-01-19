import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { loginUser, registerGoogle } from '../BooksService';
import { useUserData } from './UserData';
import ErrorBanner from '../components/Banners/ErrorBanner';
import simpleLogo from '../img/googleLogo.png';
import {
  GoogleSignin,
} from "@react-native-google-signin/google-signin"
import LoadingSpinner from '../components/LoadingSpinner';

type RootStackParamList = {
  Main: undefined;
  Login: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const Login: React.FC<Props> = ({ navigation }) => {

    GoogleSignin.configure({
      webClientId: '894874389822-vus90gg05gp7p6n8g5roor2nibcsli3b.apps.googleusercontent.com',
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);
  const { updateToken, updateUserName, updateEmail, updatePhoneNumber } = useUserData();

  useEffect(() => {
    navigation.setOptions({
      title: 'Logowanie',
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2773A5',
      },
    });
  }, [navigation]);

  const handleLogin = async () => {
    if(username == '' || password == '') {
      showError('Uzupełnij obowiązkowe pola.');
      return;
    }
    try {
      setIsLoginInProgress(true)
      const data = await loginUser(username, password);
      if (data) {
        updateToken(data.token);
        updateUserName(data.username);
        updateEmail(data.email);
        updatePhoneNumber(data?.phoneNumber)
        navigation.replace('Main');
        setIsLoginInProgress(false)
      }
    } catch (error) {
      showError('Nieprawidłowa nazwa użytknika lub hasła');
      setIsLoginInProgress(false)
    }
  };

  const showError = (message: string) => {
    setLoginError(message);
    setTimeout(() => {
      setLoginError(null);
    }, 3000);
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
          setIsLoginInProgress(true)
          await handleGoogleLogin(idToken)
        }
      } catch (error) {
        showError("Nieprawidłowe logowanie, spróbuj ponownie.")
        setIsLoginInProgress(false)
      }
    }
  
    const handleGoogleLogin = async (code: string) => {
      try {
        const data = await registerGoogle(code);
        if (data) {
          updateToken(data.token);
          updateUserName(data.username);
          updateEmail(data.email);
          setIsLoginInProgress(false)
          navigation.replace('Main');
        }
      } catch (error) {
        showError("Nieprawidłowe logowanie, spróbuj ponownie.")
        setIsLoginInProgress(false)
      }
    };
  

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
      <LoadingSpinner visible={isLoginInProgress} />
      {loginError && <ErrorBanner message={loginError} />}
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Nazwa użytkownika:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nazwa użytkownika"
          placeholderTextColor="#333"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Hasło:</Text>
        <TextInput
          style={styles.input}
          placeholder="Hasło"
          placeholderTextColor="#333"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Zaloguj się</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton} onPress={signIn}>
          <Image
            source={simpleLogo}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Zaloguj się przez Google</Text>
        </TouchableOpacity>
      </View>
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
    left: 20,
    width: 35,
    height: 35
  },
  
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  }, 
});

export default Login;
