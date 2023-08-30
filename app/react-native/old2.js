import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView, TouchableOpacity } from 'react-native';

const WEBSOCKET_URL = 'ws://47.253.81.45:80/chat3';

export default function App() {
  const [inputMessage, setInputMessage] = useState('');
  const [outputMessages, setOutputMessages] = useState([]);
  const [chatGPTResponse, setChatGPTResponse] = useState('');

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(WEBSOCKET_URL);

    socketRef.current.onopen = () => {
      console.log('WebSocket连接已打开');
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.sender === 'bot' && data.type === 'stream') {
        setChatGPTResponse(chatGPTResponse => chatGPTResponse + data.message);
      } else if (data.sender === 'bot' && data.type === 'end') {
        setOutputMessages(outputMessages => [...outputMessages, chatGPTResponse]);
      } else if (data.sender === 'bot' && data.type === 'start') {
        setChatGPTResponse(chatGPTResponse => chatGPTResponse + '\nChatBot：')
      }
      else if (data.sender === 'you') {
        setChatGPTResponse(chatGPTResponse => chatGPTResponse + '\nYou：' + data.message)
      }
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket出现错误', error);
    };

    socketRef.current.onclose = (event) => {
      console.log('WebSocket连接已关闭', event);
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const handleSend = () => {
    if (inputMessage) {
      socketRef.current.send(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.outputContainer}>
        {outputMessages.map((message, index) => (
          <Text key={index} style={styles.output}>
            {message}
          </Text>
        ))}
        <Text style={styles.chatGPTResponse}>{chatGPTResponse}</Text>
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="请输入消息"
          value={inputMessage}
          onChangeText={setInputMessage}
          multiline={true}
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>发送</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: 'gray',
    padding: 8,
    width: '100%',
    backgroundColor: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 8,
    width: '80%',
    fontSize: 18,
    maxHeight: '50%', // 限制消息输入框最大高度为50%
    minHeight: 50, // 设置消息输入框最小高度为50
  },
  sendButton: {
    backgroundColor: 'blue',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginLeft: 10,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  outputContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f2f2f2',
    padding: 8,
  },
  output: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 4,
    fontSize: 18,
  },
  chatGPTResponse: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 4,
    fontSize: 18,
    fontStyle: 'italic',
  },
});
