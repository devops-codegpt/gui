import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
// 引入中文语言包
import 'dayjs/locale/zh-cn';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import EventSource from "react-native-sse";
// import th from 'th.png';
// import R from 'R.png';
GPTid = 2
export default function ChatRoomScreen() {


    const [messages, setMessages] = useState([]);
    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: '你好，我是ChatGPT,我们开始聊天吧!',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'ChatGPT',
                    avatar: require('./th.jpg'),
                },
            }
        ])
    }, []);
    const onSend = useCallback((msg = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, msg));

        getGPTMessage(msg)

    }, []);

    function getGPTMessage(usermessage) {
        console.log(usermessage)
        strUsemessage = JSON.stringify(usermessage)
        s1 = strUsemessage.substring(10)
        number = s1.indexOf('\"')
        s2 = s1.substring(0, number)

        GPTid = GPTid + 1
        console.log(s2)
        var GPTmessage = ''
        // if (window.EventSource) {
        const source = new EventSource('http://47.254.76.73:8088/chatStream?prompt='+s2+'&conversation_id=9c5da424-8d3d-4851-8464-1bdbd00e6aa8');

        source.addEventListener('message', (event) => {
            console.log(event.data);
            GPTid = GPTid + 1
            console.log(GPTid)
            GPTmessage = GPTmessage+event.data
            setMessages(previousMessages => GiftedChat.append(previousMessages, {
                _id: GPTid,
                text: GPTmessage,
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'ChatGPT',
                    avatar: require('./th.jpg'),
                },
            }))
        });

        source.addEventListener('open', (event) => {
            console.log('Connection opened.');
        });

        source.addEventListener('error', (event) => {
            console.error('Error occurred:', event);
            source.close()
        });
        // } else {
        //     console.log('你的浏览器不支持SSE')
        //   }

        source.addEventListener("close", (event) => {
            console.log("Close SSE connection.");
        });
        

        // const options = { methods: 'GET' };
        // fetch('http://47.254.76.73:8088/chatStream?prompt='+s2+'&conversation_id=9c5da424-8d3d-4851-8464-1bdbd00e6aa8', options)
        //     .then(response => response.json())

        //     .then(response => {

        //         setMessages(previousMessages => GiftedChat.append(previousMessages, {
        //             _id: GPTid,
        //             text: response,
        //             createdAt: new Date(),
        //             user: {
        //                 _id: 2,
        //                 name: 'ChatGPT',
        //                 avatar: require('./th.jpg'),
        //             },
        //         }))
        //     })
        //     .catch(error => {
        //         console.error(error);
        //     });

        // const request = new XMLHttpRequest();
        // request.onreadystatechange = (e) => {
        //     if (request.readyState !== 4) {
        //         return;
        //     }

        //     if (request.status === 200) {
        //         console.log('success', request.responseText);
        //     } else {
        //         console.warn('error');
        //     }
        // };

        // request.open('POST', 'http://47.254.76.73:8088/chat',true);
        // request.setRequestHeader("Content-Type", "application/json");

        // request.send("prompt=hello");
        // console.log(request.responseText);



    }

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
            >
                <View style={styles.sendBtn}>
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
                renderSend={renderSend}
                inverted={true}
                renderUsernameOnMessage={true}
                user={{
                    _id: 50,
                    name: '阳光',
                    avatar: require('./R.jpg'),
                }}
                alignTop={true}
            />
        </SafeAreaView>
    )
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

