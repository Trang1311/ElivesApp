import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useMyContextController } from '../context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const Tracking = () => {
  const [orders, setOrders] = useState([]);
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const navigation = useNavigation();

  const navigateToUser = () => {
    navigation.navigate('User');
  };
  const navigateToCustomer = () => {
    navigation.navigate('Customer');
  };
  useEffect(() => {
    // Load user's orders from Firestore
    const unsubscribe = firestore()
      .collection('bookings')
      .where('userEmail', '==', userLogin.email)
      .orderBy('orderDate', 'desc')
      .onSnapshot((querySnapshot) => {
        if (querySnapshot) {
          const userOrders = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Check if the document has an "orderDate" field and it's not null
            if (data && data.orderDate) {
              userOrders.push({
                id: doc.id,
                ...data,
              });
            }
          });
          setOrders(userOrders);
        } else {
          console.log("querySnapshot is null");
        }
      });
  
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [userLogin]);
  

  return (  
  <ImageBackground
    source={require('../images/dark2.jpg')} // Replace with the actual path or URL
    style={styles.backgroundImage}
  >
    <View style={styles.container}>
    
      <Text style={styles.title}>Đơn hàng của bạn:</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderContainer}>
            <Text style={styles.serviceName}>{` ${item.serviceName}`}</Text>
            <Text style={styles.status}>{`Ngày đặt: ${item.orderDate}`}</Text>
            <Text style={styles.status}>{`Ngày giao: ${item.selectedDate}`}</Text>
            <Text style={styles.status}>{`Trạng thái: ${item.status}`}</Text>
            {/* Add more details as needed */}
          </View>
        )}
      />
      <View style={styles.footer}>
      <TouchableOpacity style={styles.userButton} onPress={navigateToUser}>
        <Icon name="user" size={20} color="#ff66b2" /> 
      </TouchableOpacity>
      <TouchableOpacity style={styles.BookingButton} onPress={navigateToCustomer}>
        <Icon name="list" size={20} color="#ff66b2" />
      </TouchableOpacity>
      </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    //backgroundImage: '../src/images/e8e0c7d44329a2fa9b48407d52ae3f90.jpg',

  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' or 'contain'
  },
  BookingButton: {
    position: 'absolute',
    bottom: 0,
    marginLeft: 315,
    width: 50,
    height: 50,
    backgroundColor: 'white', // Màu hồng cho nút list
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userButton: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userButtonText: {
    color: '#ff66b2',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 30,
    //backgroundImage: 'Lab5/Lab5/src/images/e8e0c7d44329a2fa9b48407d52ae3f90.jpg',

  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white', // White text color
    marginBottom: 16,
  },
  orderContainer: {
    backgroundColor: 'white', // White background for each order
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff66b2', // Pink text color
  },
  status: {
    fontSize: 16,
    color: '#333', // Dark gray text color
  },
});

export default Tracking;
