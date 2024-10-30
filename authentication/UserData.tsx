import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllConversations } from '../BooksService';

type Message = {
  sender: string;
  message: string;
  isRead: boolean;
};

const UserContext = createContext({
  token: '',
  updateToken: (token: string) => {},
  userName: '',
  updateUserName: (userName: string) => {},
  email: '',
  updateEmail: (email: string) => {},
  password: '',
  updatePassword: (password: string) => {},
  logout: () => {},
  isCreateOfferInProgress: false,
  setIsCreateOfferInProgress: (inProgress: boolean) => {},
  isDeleteOfferInProgress: false,
  setIsDeleteOfferInProgress: (inProgress: boolean) => {},
});

export const UserData: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isCreateOfferInProgress, setIsCreateOfferInProgress] = useState(false);
  const [isDeleteOfferInProgress, setIsDeleteOfferInProgress] = useState(false);
  const [converstations, setConversations] = useState<Message[]>([])

  const loadData = async () => {
    const savedToken = await AsyncStorage.getItem('token');
    const savedUserName = await AsyncStorage.getItem('userName');
    const savedEmail = await AsyncStorage.getItem('email');
    const savedPassword = await AsyncStorage.getItem('password');

    if (savedToken) setToken(savedToken);
    if (savedUserName) setUserName(savedUserName);
    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
  };
  const startLogging = () => {
    setInterval(() => {
      console.log('Logging every 30 seconds');
      //const data = getAllConversations(token)
    }, 30000);
  };

  useEffect(() => {
    loadData();
  }, []);


  useEffect(() => {
    if (token) {
      const loggingInterval = setInterval(startLogging, 30000);
      return () => clearInterval(loggingInterval);
    }
  }, [token]);

  const updateToken = async (newToken: string) => {
    setToken(newToken);
    await AsyncStorage.setItem('token', newToken);
  };

  const updateUserName = async (newUserName: string) => {
    setUserName(newUserName);
    await AsyncStorage.setItem('userName', newUserName);
  };

  const updateEmail = async (newEmail: string) => {
    setEmail(newEmail);
    await AsyncStorage.setItem('email', newEmail);
  };

  const updatePassword = async (newPassword: string) => {
    setPassword(newPassword);
    await AsyncStorage.setItem('password', newPassword);
  };

  const logout = async () => {
    setToken('');
    setUserName('');
    setEmail('');
    setPassword('');
    await AsyncStorage.multiRemove(['token', 'userName', 'email', 'password']);
  };

  return (
    <UserContext.Provider
      value={{ token, updateToken, userName, updateUserName, email, updateEmail, password, updatePassword, logout, isCreateOfferInProgress, setIsCreateOfferInProgress, isDeleteOfferInProgress, setIsDeleteOfferInProgress }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserData = () => useContext(UserContext);
