import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { getAllConversations, sendMessage } from '../BooksService';
import { useUserData } from '../authentication/UserData';

const initialMessages = [
  { sender: 'DORIAN', message: 'Hello!', isRead: true },
  { sender: 'user', message: 'Hi, how are you?', isRead: true },
  { sender: 'DORIAN', message: 'I’m doing well, thanks!', isRead: true },
  { sender: 'user', message: 'Glad to hear!', isRead: false },
  { sender: 'DORIAN', message: 'Are we still on for later?', isRead: false },
];

const ChatScreen = ({ route }) => {
  const { userName } = route.params;
  const {token} = useUserData()
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef();

  const handleSendMessage = async() => {
    if (newMessage.trim() === '') return;
    const data = await getAllConversations(token);
    console.log('API Response2:', JSON.stringify(data, null, 2));
    const message = {
      sender: 'DORIAN',
      message: newMessage,
      isRead: true,
    };
    //sendMessage(token, 'Dorian1', newMessage)
    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessageItem = ({ item }) => {
    const isSenderDorian = item.sender === 'DORIAN';

    return (
      <View
        style={[
          styles.messageContainer,
          isSenderDorian ? styles.messageRight : styles.messageLeft,
        ]}
      >
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <Text style={styles.header}>Chat with {userName}</Text>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messagesList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  messagesList: {
    paddingTop: 10,
    flexGrow: 1,
  },
  messageContainer: {
    maxWidth: '70%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  messageLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  messageRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#4f93e8',
    marginRight: 6
  },
  messageText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
    marginBottom: 25
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4f93e8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
