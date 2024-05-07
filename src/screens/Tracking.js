import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ImageBackground, Alert } from 'react-native';
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
    const unsubscribe = firestore()
      .collection('bookings')
      .where('userEmail', '==', userLogin.email)
      .orderBy('orderDate', 'desc')
      .onSnapshot((querySnapshot) => {
        if (querySnapshot) {
          const userOrders = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data && data.orderDate) {
              userOrders.push({
                id: doc.id,
                ...data,
              });
            }
          });
          setOrders(userOrders); // Cập nhật dữ liệu sau khi lặp xong
        } else {
          console.log("querySnapshot is null");
        }
      });
  
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [userLogin]);
  
  
  const cancelOrder = (orderId) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn chắc chắn muốn xóa đơn hàng không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: () => {
            handleDeleteOrder(orderId);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await firestore().collection('bookings').doc(orderId).delete();
      console.log('Đơn hàng đã được xóa thành công.');
    } catch (error) {
      console.error('Lỗi khi xóa đơn hàng:', error);
    }
  };

  return (  
    <ImageBackground
      source={require('../images/dark2.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Đơn hàng của bạn:</Text>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.orderContainer}>
              <View style={styles.orderHeader}>
                <Text style={styles.serviceName}>{` ${item.serviceName}`}</Text>
                {item.status === 'Đang chờ xác nhận' || item.status === 'Đang chuẩn bị hàng' ? (
                  <TouchableOpacity onPress={() => cancelOrder(item.id)}>
                    <Icon name="times" size={20} color="red" style={styles.cancelIcon} />
                  </TouchableOpacity>
                ) : (
                  <Icon name="times" size={20} color="#666" style={styles.cancelIcon} />
                )}
              </View>
              <Text style={styles.status}>{`Ngày đặt: ${item.orderDate}`}</Text>
              <Text style={styles.status}>{`Ngày giao: ${item.selectedDate}`}</Text>
              <Text style={styles.status}>{`Trạng thái: ${item.status}`}</Text>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  BookingButton: {
    position: 'absolute',
    bottom: 0,
    marginLeft: 315,
    width: 50,
    height: 50,
    backgroundColor: 'white',
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  orderContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff66b2',
  },
  status: {
    fontSize: 16,
    color: '#333',
  },
  cancelIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

export default Tracking;
