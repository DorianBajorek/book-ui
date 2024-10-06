import React from 'react'; 
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useUserData } from './authentication/UserData';
import BookSlider from './components/BookSlider';

type NavigationProp = {
  navigate: (screen: string) => void;
};

const HomeView = ({ navigation }: { navigation: NavigationProp }) => {
  const { logout, token } = useUserData();

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>BookCycle</Text>

      <Text style={styles.description}>
        BookCycle is a platform where users can exchange books and give them a second life. Join our community to discover new reads or share your collection with others!
      </Text>

      <View style={styles.imageContainer}>
        <BookSlider />
      </View>

      {token ? (
        <>
          <Text style={styles.loggedInText}>You are logged in</Text>
          <TouchableOpacity style={styles.button} onPress={() => logout()}>
            <Text style={styles.buttonText}>Log out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          In BookCycle, you can exchange books with others. Feel free to connect with people to share your opinions, discover new perspectives, and enrich your reading experience!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    padding: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  image: {
    width: 80,
    height: 120,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  loggedInText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4682B4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HomeView;
