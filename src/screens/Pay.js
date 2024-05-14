import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Pay = ({ route }) => {
  const { bookingData } = route.params;
  console.log('Received bookingData:', bookingData);

  const [paymentStatus, setPaymentStatus] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(null); // Track the selected payment method
  const navigation = useNavigation();

  const handlePayment = (useMomo) => {
    if (useMomo) {
      setPaymentStatus('Đã thanh toán');
    } else {
      setPaymentStatus('Đang chờ xác nhận');
    }

    // Update the selected method
    setSelectedMethod(useMomo ? 'momo' : 'cash');
  };

  const handleUpdate = async () => {
    try {
      const statusRef = firestore().collection('bookings').doc(bookingData.id);
      const statusDoc = await statusRef.get();
  
      if (statusDoc.exists) {
        await statusRef.update({
          status: paymentStatus,
        });
  
        console.log('Cập nhật trạng thái thành công');
  
        // Conditionally navigate based on the payment method
        if (selectedMethod === 'momo') {
          // If Momo is selected, navigate to the QRPay screen
          navigation.navigate('QRPay');
        } else {
          // If cash on delivery is selected, show an alert and navigate to the Customer screen
          Alert.alert(
            'Xác nhận',
            'Đơn hàng đã được xác nhận. Cảm ơn quý khách!',
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.navigate('Tracking');
                },
              },
            ]
          );
        }
      } else {
        console.error('Document not found:', bookingData.id);
        Alert.alert('Error', 'Document not found. Please try again.');
      }
    } catch (error) {
      console.error('Error updating service in Firestore:', error);
      Alert.alert('Error', 'Error updating service. Please try again.');
    }
  };
  

  return (
    <ImageBackground
      source={require('../images/3af00f57dbb1b2c9fcc47352f47009a5.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ff66b2', marginBottom: 30, marginTop: 50, marginLeft: 3 }}>
          Chọn phương thức thanh toán
        </Text>
        <Image
          source={require('../images/pay_cash_bill_money_buy_icon_143287.png')}
          style={{ position: 'relative', top: 0, right: 10, width: 80, height: 80 }}
        />
        <Text style={styles.text1}>Tổng tiền: {bookingData.description}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, selectedMethod === 'cash' && styles.selectedButton]} // Apply selected styles
            onPress={() => handlePayment(false)}
          >
            <Text style={styles.buttonText}>Khi nhận hàng</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, selectedMethod === 'momo' && styles.selectedButton]} // Apply selected styles
            onPress={() => handlePayment(true)}
          >
            <Text style={styles.buttonText}>Qua Momo</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.buttonTT} onPress={handleUpdate}>
          <Text style={{ fontSize: 20 }}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    borderWidth: 8,
    borderColor: '#ff66b2',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#DDDDDD',
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    borderRadius: 5,
    marginHorizontal: 8,
  },
  selectedButton: {
    backgroundColor: '#ff66b2', // Change the background color for the selected button
  },
  buttonTT: {
    backgroundColor: '#ff66b2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  text1: {
    color: '#ff66b2',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Pay;
