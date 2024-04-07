
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/dist/FontAwesome'; 

const ListBookings = () => {
  const [bookings, setBookings] = useState([]);

  const navigation = useNavigation();
  const navigateToAdmin = () => {
    navigation.navigate('Admin');
  };
  const navigateToUser = () => {
    navigation.navigate('User');
  };
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const snapshot = await firestore().collection('bookings').orderBy('orderDate', 'desc').get();
        const bookingsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
  
    fetchBookings();
  }, []);
  

  const renderItem = ({ item }) => (
    <View style={styles.orderContainer}>
      <Text style={styles.serviceName}>{` ${item.serviceName}`}</Text>
      <Text style={styles.userName}>{`Khách hàng: ${item.userName}`}</Text>
      <Text style={styles.userName}>{`Ngày đặt: ${item.orderDate}`}</Text>
      <Text style={styles.selectedDate}>{`Ngày giao: ${item.selectedDate}`}</Text>
      <Text style={styles.selectedTime}>{`Thời gian: ${item.selectedTime}`}</Text>
      <Text style={styles.selectedTime}>{`Trạng thái: ${item.status}`}</Text>
    
    </View>
  );

  return (
    <ImageBackground
    source={require('../images/dark2.jpg')} // Replace with the actual path or URL
    style={styles.backgroundImage}
  >
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách đơn hàng</Text>
      <FlatList
        data={bookings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.footer}>
      <TouchableOpacity style={styles.userButton} onPress={navigateToUser}>
        <Icon name="user" size={20} color="#ff66b2" /> 
      </TouchableOpacity>
      <TouchableOpacity style={styles.BookingButton} onPress={navigateToAdmin}>
        <Icon name="home" size={20} color="#ff66b2" />
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
    backgroundImage: 'Lab5/Lab5/src/images/e8e0c7d44329a2fa9b48407d52ae3f90.jpg',

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
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' or 'contain'
  },
  orderContainer: {
    backgroundColor: 'white', // White background for each order
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white', // Màu trắng
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#ffff', // Màu trắng
    paddingVertical: 8,
    marginBottom: 8,
  },
  serviceName: {
    color: '#ff66b2', 
    fontSize: 20,
    fontWeight:'bold'
  },
  userName: {
    color: 'black', 
    fontSize: 16,
  },
  selectedDate: {
    color: 'black', 
    fontSize: 16,
  },
  selectedTime: {
    color: 'black', 
    fontSize: 16,
  },
});

export default ListBookings;
