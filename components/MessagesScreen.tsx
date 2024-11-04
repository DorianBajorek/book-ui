import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserData } from '../authentication/UserData';

const MessagesScreen = () => {
  const { conversations } = useUserData();
  const navigation = useNavigation();

  const renderMessageItem = ({ item }) => {
    const lastMessage = item.messages && item.messages.length > 0 ? item.messages[item.messages.length - 1] : null;

    return (
      <TouchableOpacity
        style={styles.messageItem}
        onPress={() => navigation.navigate('Chat', { recipient: item.recipient })}
      >
        <View style={styles.messageContent}>
          <Text style={styles.userName}>{item.recipient}</Text>
          <Text style={styles.lastMessage}>
            {lastMessage && typeof lastMessage.message === 'string'
              ? lastMessage.message
              : "No messages yet"}
          </Text>
        </View>
        <Text style={styles.messageTime}>{lastMessage ? lastMessage.time || "N/A" : "N/A"}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Wiadomości</Text>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.recipient}
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
