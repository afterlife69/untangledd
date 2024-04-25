import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function ChatMessage({ message, isUser }) {
  const messageStyle = isUser ? styles.userMessage : styles.botMessage;

  return (
    <View style={messageStyle}>
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{isUser ? "User" : "Bot"}</Text>
      <Text>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 10,
    margin: 25,
    maxWidth: '80%',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 10,
    margin: 25,
    maxWidth: '80%',
  },
});

export default ChatMessage;