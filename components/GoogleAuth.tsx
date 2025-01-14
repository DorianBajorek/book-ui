import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { registerGoogle } from '../BooksService';
import simpleLogo from '../img/googleLogo.png';
import { useUserData } from './UserData';

type GoogleAuthProps = {
  onSuccess: () => void;
  buttonText: string;
};

const GoogleAuth: React.FC<GoogleAuthProps> = ({ onSuccess, buttonText }) => {
  const { updateToken, updateUserName, updateEmail } = useUserData();

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.idToken;

      if (idToken) {
        const data = await registerGoogle(idToken);
        if (data) {
          updateToken(data.token);
          updateUserName(data.username);
          updateEmail(data.email);
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('Nieprawidłowe logowanie, spróbuj ponownie.');
    }
  };

  return (
    <TouchableOpacity style={styles.googleButton} onPress={signInWithGoogle}>
      <Image source={simpleLogo} style={styles.googleIcon} />
      <Text style={styles.googleButtonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    height: 35,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default GoogleAuth;
