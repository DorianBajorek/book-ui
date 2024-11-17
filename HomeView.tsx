import React, { useEffect, useState } from 'react'; 
import { StyleSheet, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useUserData } from './authentication/UserData';
import BookSlider from './components/BookSlider';
import atomoweNawyki from './img/atomowe-nawyki.jpg';
import jobs from './img/jobs.png';
import goggins from './img/goggins.png';
import korwin from './img/korwin.jpg';
import pulapka from './img/pulapka.jpg';
import wedrowka from './img/wedrowka.png';
import { testEndpointGet, testEndpointGet2 } from './BooksService';

const books = [
  { id: '1', image: atomoweNawyki },
  { id: '2', image: jobs },
  { id: '3', image: jobs },
  { id: '4', image: goggins },
  { id: '5', image: korwin },
  { id: '6', image: pulapka },
  { id: '7', image: wedrowka },
];

type NavigationProp = {
  navigate: (screen: string) => void;
};

const HomeView = ({ navigation }: { navigation: NavigationProp }) => {
  const { logout, token } = useUserData();
  const [userName, setUserName] = useState<string>('');
  const [userName2, setUserName2] = useState<string>('');

  // Function to fetch user data from endpoint
  const handleClick = () => {
    const fetchData = async () => {
      try {
        const response = await testEndpointGet();
        setUserName(response?.data[0].name)
        const response2 = await testEndpointGet2();
        setUserName2(response?.data[0].name)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.appTitle}>Druga Książka</Text>
      
      <Text style={styles.description}>
        LECE 
        Druga Książka to platforma, gdzie możesz wymieniać książki i dawać im drugie życie. Dołącz do naszej społeczności, odkrywaj nowe tytuły lub dziel się swoją kolekcją z innymi!
      </Text>
      
      <View style={styles.imageContainer}>
        <BookSlider books={books} />
      </View>

      <View style={styles.buttonContainer}>
        {token ? (
          <TouchableOpacity style={styles.button} onPress={() => logout()}>
            <Text style={styles.buttonText}>Wyloguj się</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.buttonText}>Zarejestruj się</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleClick}>
              <Text style={styles.buttonText}>Zaloguj się</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          W Drugiej Książce możesz wymieniać książki z innymi. Połącz się z innymi użytkownikami, dziel się swoimi opiniami, odkrywaj nowe perspektywy i wzbogacaj swoje doświadczenia czytelnicze!
        </Text>
      </View>

      <View style={styles.howItWorksContainer}>
        <Text style={styles.howItWorksTitle}>Jak to działa?</Text>
        <View style={styles.howItWorksStepsContainer}>
          <Text style={styles.howItWorksStep}>📖 Skanujesz kod kreskowy.</Text>
          <Text style={styles.howItWorksStep}>📷 Robisz zdjęcie przodu książki.</Text>
          <Text style={styles.howItWorksStep}>📷 Robisz zdjęcie tyłu książki.</Text>
          <Text style={styles.howItWorksStep}>💰 Ustawiasz cenę.</Text>
          <Text style={styles.howItWorksStep}>✅ I gotowe!</Text>
          <Text style={styles.userName}>User Name: {userName ? userName : 'Loading...'}</Text>
          <Text style={styles.userName}>User Name2: {userName2 ? userName2 : 'Loading...'}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2E86C1',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6E7C7C',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4682B4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    paddingHorizontal: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    lineHeight: 24,
  },
  howItWorksContainer: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#F5F8FA',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 30
  },
  howItWorksTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E86C1',
    textAlign: 'center',
    marginBottom: 10,
  },
  howItWorksStepsContainer: {
    marginTop: 10,
  },
  howItWorksStep: {
    fontSize: 16,
    color: '#6E7C7C',
    textAlign: 'left',
    marginVertical: 5,
    lineHeight: 22,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    color: '#2E86C1',
  },
});

export default HomeView;
