import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAllConversations } from '../BooksService';
import { useUserData } from '../authentication/UserData';

const messages = [
  { id: '1', userName: 'User1', lastMessage: 'Hello there!', time: '10:00 AM' },
  { id: '2', userName: 'User2', lastMessage: 'How are you?', time: '11:30 AM' },
  { id: '3', userName: 'User3', lastMessage: 'Let’s catch up soon!', time: '12:15 PM' },
  { id: '4', userName: 'User4', lastMessage: 'Meeting at 3?', time: '1:45 PM' },
  { id: '5', userName: 'User5', lastMessage: 'Good morning!', time: '9:00 AM' },
];

const MessagesScreen = () => {
  const {token} = useUserData();
  const navigation = useNavigation();

  useEffect(() => {
    console.log("SIEMA");
    getAllConversations(token);
  })
  const renderMessageItem = ({ item }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => navigation.navigate('Chat', { userName: item.userName })}
    >
      <View style={styles.messageContent}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.messageTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  messageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  messageContent: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
});

export default MessagesScreen;
