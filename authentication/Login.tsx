import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { loginUser } from '../BooksService';
import { useUserData } from './UserData';
import ErrorBanner from '../components/Banners/ErrorBanner';

type RootStackParamList = {
  Main: undefined;
  Login: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const Login: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const { updateToken, updateUserName, updateEmail } = useUserData();

  const handleLogin = async () => {
    try {
      const data = await loginUser(username, password);
      if (data) {
        updateToken(data.token);
        updateUserName(data.username);
        updateEmail(data.email);
        navigation.replace('Main');
        setLoginError(null);
      } else {
        showError('Invalid Username or Password');
      }
    } catch (error) {
      showError('Login failed. Please try again.');
    }
  };

  const showError = (message: string) => {
    setLoginError(message);
    setTimeout(() => {
      setLoginError(null);
    }, 3000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
      {loginError && <ErrorBanner message={loginError} />}
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Nazwa użytkownika:</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Hasło:</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
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
});

export default Login;
