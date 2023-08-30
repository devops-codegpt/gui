import React, { useState, useRef, useEffect } from 'react';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
// 引入中文语言包
import 'dayjs/locale/zh-cn';
import { StyleSheet, Text, View, KeyboardAvoidingView, SafeAreaView} from 'react-native';

const WEBSOCKET_URL = 'ws://47.253.81.45:80/chat3';

export default function App() {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const [mId, setMId] = useState(55)
  const [disableSendButton, setDisableSendButton] = useState(false);
  var ID = 66;
  useEffect(() => {
    socketRef.current = new WebSocket(WEBSOCKET_URL);
    setMessages([
      {
          _id: 1,
          text: '你好，我是ChatGPT，我们开始聊天吧！',
          createdAt: new Date(),
          user: {
              _id: 2,
              name: 'ChatGPT',
              avatar: require('./chatbot.jpg'),
          },
      }
  ])
    socketRef.current.onopen = () => {
      console.log('WebSocket连接已打开');
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.sender === 'bot' && data.type === 'stream') {
            setMessages(messages => {
              const latestMessage = messages[0]
              if(data.message ===''&& latestMessage.text ==='思考中...'){
                latestMessage.text = data.message
              }else{
                latestMessage.text += data.message
              }
              const temp = messages.slice(1, messages.length)
              return GiftedChat.append(temp, latestMessage)
            });
      } else if (data.sender === 'bot' && data.type === 'end') {
        setDisableSendButton(false); // 启用发送按钮
      } else if (data.sender === 'bot' && data.type === 'start') {
        
       ID += 1;
          setMessages(messages => {
            console.log('id 1  ',ID)
            const newMessage = {
                _id: ID,
                text: '思考中...',
                createdAt: new Date(),
                user: {
                  _id: 2,
                  name: 'ChatBot',
                  avatar: require('./chatbot.jpg'),
                },
              }
              console.log('一次    一次')
            return GiftedChat.append(messages, newMessage)
          });
        
        console.log('id 2',ID)
        
      }
      else if (data.sender === 'you') {
      }
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket出现错误', error);
      console.log('WebSocket出现错误信息', error.message);
    };

    socketRef.current.onclose = (event) => {
      console.log('WebSocket连接已关闭', event);
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const onSend = (newMessages = []) => {
    if (disableSendButton) {
      return;
    }
    setMessages(GiftedChat.append(messages, newMessages));
    const latestMessage = newMessages[0];
    const message = latestMessage.text;

    socketRef.current.send(message);
    setDisableSendButton(true); // 禁用发送按钮
  };
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: 'black',
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: '#fff',
          },
          right: {
            backgroundColor: '#76B6FF',
          },
        }}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send
        {...props}
        alwaysShowSend={true}
        disabled={disableSendButton} // 添加disabled属性
      >
        <View style={[styles.sendBtn, {opacity: disableSendButton ? 0.5 : 1}]}>
          <Text style={{ color: '#ffffff', fontSize: 17 }}>发送</Text>
        </View>
      </Send>
    );
  };

  return (
    <SafeAreaView style={styles.mainContent}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        showUserAvatar={true}
        locale={'zh-cn'}
        showAvatarForEveryMessage={true}
        renderBubble={renderBubble}
        placeholder={'开始聊天吧'}
        textInputProps={{ style: { color: '#000101',flex: 1 } }}
        renderSend={renderSend}
        inverted={true}
        renderUsernameOnMessage={true}
        user={{
          _id: 50,
          name: '阳光',
          avatar: require('./chatgirl.jpg'),
        }}
        alignTop={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    backgroundColor: '#ededed',
  },
  sendBtn: {
    width: 63,
    height: 32,
    borderRadius: 3,
    backgroundColor: '#0077FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    marginRight: 5,
  }
});