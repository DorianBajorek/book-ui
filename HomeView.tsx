import React, { useEffect, useState } from 'react'; 
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Image } from 'react-native';
import { useUserData } from './authentication/UserData';
import BookSlider from './components/BookSlider';
import simpleLogo from './img/simpleLogo.png';
import { getUserOffers } from './BooksService';

export interface Book {
  offer_id: number;
  cover_book: string;
  title: string;
  author?: string;
  username?: string;
  frontImage: string;
  backImage: string;
  price?: string;
}


type NavigationProp = {
  navigate: (screen: string) => void;
};

const HomeView = ({ navigation }: { navigation: NavigationProp }) => {
  const { logout, token } = useUserData();
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getUserOffers(token, 'drugaksiazka');
        if (data) {
          setBooks(data);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [token]);

  return (
    <ScrollView style={styles.container}>
       <View style={styles.headerContainer}>
        <Image source={simpleLogo} style={styles.logo} />
        <Text style={styles.appTitle}>Druga Książka</Text>
      </View>
      
      <Text style={styles.description}>
        Druga Książka to platforma, gdzie możesz wymieniać książki i dawać im drugie życie. Dołącz do naszej społeczności, odkrywaj nowe tytuły lub dziel się swoją kolekcją z innymi!
      </Text>
      
      <View style={styles.imageContainer}>
        <BookSlider books={books} navigation={navigation} username={"drugaksiazka"}/>
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
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
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
    marginLeft: 0
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  description: {
    fontSize: 17,
    color: '#545F5F',
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
    backgroundColor: '#3C709A',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    width: 170,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginBottom: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
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
    fontSize: 17,
    color: '#545F5F',
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
