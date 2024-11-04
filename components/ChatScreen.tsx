import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useUserData } from '../authentication/UserData';
import { sendMessage } from '../BooksService';

const ChatScreen = ({ route }) => {
  const { token, conversations, userName } = useUserData();
  const flatListRef = useRef();
  const { recipient } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const conversation = conversations.find(conv => conv.recipient === recipient);
    if (conversation) {
      setMessages(conversation.messages);
    }
  }, [conversations, recipient]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const messageToSend = {
        sender: userName,
        message: newMessage,
      };

      setMessages(prevMessages => [...prevMessages, messageToSend]);

      setNewMessage('');

      flatListRef.current.scrollToEnd({ animated: true });

      try {
        await sendMessage(token, recipient, newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
      }
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const renderMessageItem = ({ item }) => {
    const isSender = item.sender === userName;

    return (
      <View
        style={[
          styles.messageContainer,
          isSender ? styles.messageRight : styles.messageLeft,
        ]}
      >
        <Text style={styles.messageText}>
          {item.message ? item.message : 'Brak wiadomości'}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <Text style={styles.header}>Wiadomości z {recipient}</Text>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessageItem}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Napisz wiadomość"
          onSubmitEditing={handleSendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Text style={styles.sendButtonText}>Wyślij</Text>
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
    marginRight: 6,
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
    marginBottom: 25,
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
