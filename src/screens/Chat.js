import React, { useEffect, useState } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { useMyContextController } from '../context';
import firestore from '@react-native-firebase/firestore';
import { Image, StyleSheet, View } from 'react-native';

const Chat = ({ route }) => {
  const { service } = route.params;
  const [messages, setMessages] = useState([]);
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('services')
      .doc(service.id)
      .collection('chatMessages')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const loadedMessages = [];
        let unreadCount = 0;
  
        querySnapshot.forEach((doc) => {
          loadedMessages.push(doc.data());
  
          // Check if the message is from the customer and hasn't been read by the admin
          if (doc.data().user._id === 2 && !doc.data().readByAdmin) {
            unreadCount += 1;
          }
        });
  
        // Update unreadMessages count in the service document only if it has changed
        const currentUnreadCount = service.unreadMessages || 0;
        if (unreadCount !== currentUnreadCount && userLogin.role === 'admin') {
          firestore().collection('services').doc(service.id).update({
            unreadMessages: unreadCount,
          });
        }
  
        setMessages(loadedMessages.reverse());
      });
  
    return () => unsubscribe();
  }, [service, userLogin]);
  
  const onSend = async (newMessages = []) => {
    if (newMessages.length === 0) {
      return;
    }
  
    const formattedMessages = newMessages.map((message) => ({
      ...message,
      createdAt: message.createdAt.toISOString(),
    }));
  
    try {
      if (formattedMessages[0].user._id === 1) {
        // Admin sent a message, update inquiry and reset unreadMessages
        await firestore().collection('services').doc(service.id).update({
          inquiry: formattedMessages[0].text,
          unreadMessages: 0,
        });
      } else {
        // Customer sent a message, increment unreadMessages count
        await firestore().collection('services').doc(service.id).update({
          unreadMessages: firestore.FieldValue.increment(1),
        });
      }
  
      // Log the current service data after updating
      const updatedService = await firestore().collection('services').doc(service.id).get();
      console.log('Updated Service Data:', updatedService.data());
  
      // Save the message in the chatMessages subcollection
      await firestore()
        .collection('services')
        .doc(service.id)
        .collection('chatMessages')
        .add({
          ...formattedMessages[0],
          serviceId: service.id,
          readByAdmin: true,
        });
  
      console.log('Message sent successfully.');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: 'lightgrey', // Pink color for customer's chat bubble
        },
        right: {
          backgroundColor: '#ff66b2', // Pink color for admin's chat bubble
        },
      }}
    />
  );

  return (
    <View style={styles.container}>
      <Image source={require('../images/dark1.jpg')} style={styles.backgroundImage} />
      <View style={styles.chatContainer}>
        <GiftedChat
          messages={messages.reverse()}
          onSend={onSend}
          user={{
            _id: userLogin.role === 'admin' ? 1 : 2,
            name: userLogin.name,
          }}
          renderBubble={renderBubble}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'stretch',
    width: '100%', // Ensure the image takes the full width of the screen
    height: '100%',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0)', // Adjust the alpha value as needed
  },
});

export default Chat;