import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllConversations, getAllConversationsMock } from '../BooksService';

type Message = {
  sender: string;
  message: string;
  isRead: boolean;
};

type Conversation = {
  recipient: string;
  messages: Message[];
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
  updatePhoneNumber: (phoneNumber: string) => {},
  logout: () => {},
  isCreateOfferInProgress: false,
  setIsCreateOfferInProgress: (inProgress: boolean) => {},
  isDeleteOfferInProgress: false,
  setIsDeleteOfferInProgress: (inProgress: boolean) => {},
  conversations: [] as Conversation[]
});

export const UserData: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isCreateOfferInProgress, setIsCreateOfferInProgress] = useState(false);
  const [isDeleteOfferInProgress, setIsDeleteOfferInProgress] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const loadData = async () => {
    const savedToken = await AsyncStorage.getItem('token');
    const savedUserName = await AsyncStorage.getItem('userName');
    const savedEmail = await AsyncStorage.getItem('email');
    const savedPassword = await AsyncStorage.getItem('password');
    const savedPhoneNumber = await AsyncStorage.getItem('phoneNumber');

    if (savedToken) setToken(savedToken);
    if (savedUserName) setUserName(savedUserName);
    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
    if (savedPhoneNumber) setPhoneNumber(savedPhoneNumber);
  };

  const updateConversations = async () => {
    //const data = await getAllConversations(token);
    const data = ["xd"]
    if (data) {
      const mappedConversations: Conversation[] = data?.map((item: any) => ({
        recipient: item.recipient,
        messages: item.conversations,
      }));
      setConversations(mappedConversations);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let loggingInterval: NodeJS.Timeout;

    if (token) {
      updateConversations();

      // loggingInterval = setInterval(updateConversations, 10000);
    }

    return () => clearInterval(loggingInterval);
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

  const updatePhoneNumber = async (newPhoneNumber: string) => {
    setPhoneNumber(newPhoneNumber);
    if(newPhoneNumber) {
      await AsyncStorage.setItem('phoneNumber', newPhoneNumber);
    }
  };

  const logout = async () => {
    setToken('');
    setUserName('');
    setEmail('');
    setPassword('');
    setConversations([]);
    await AsyncStorage.multiRemove(['token', 'userName', 'email', 'password']);
  };

  return (
    <UserContext.Provider
      value={{
        token,
        updateToken,
        userName,
        updateUserName,
        email,
        updateEmail,
        password,
        updatePassword,
        updatePhoneNumber,
        logout,
        isCreateOfferInProgress,
        setIsCreateOfferInProgress,
        isDeleteOfferInProgress,
        setIsDeleteOfferInProgress,
        conversations
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserData = () => useContext(UserContext);
