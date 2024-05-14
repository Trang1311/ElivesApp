import React, { useState } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, TextInput, ImageBackground, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const getCurrentUser = () => {
  const user = auth().currentUser;
  if (user) {
    return user;
  } else {
    console.error('No user logged in.');
    return null;
  }
};

const Booking = ({ route }) => {
  const { cartItems, totalPrice } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [otherOptions, setOtherOptions] = useState('');
  const navigation = useNavigation();

  const handleBooking = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      Alert.alert('Lỗi', 'Không thể xác định người dùng hiện tại. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      const bookingData = {
        userEmail: currentUser.email,
        serviceName:cartItems.map(item => item.name).join(', '),
        cartItems: cartItems,
        totalPrice: totalPrice,
        orderDate: new Date().toISOString(),
        selectedDate: selectedDate.toDateString(),
        selectedTime: selectedTime || 'Default Time',
        otherOptions: otherOptions,
        status: 'Đang chờ xác nhận',
      };

      const docRef = await firestore().collection('bookings').add(bookingData);
      const bookingId = docRef.id;

      console.log('Booking details saved to Firestore:', bookingData);
      console.log('Booking ID:', bookingId);

      navigation.navigate('Pay', { bookingData: { ...bookingData, id: bookingId } });
    } catch (error) {
      console.error('Error saving booking details:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi lưu chi tiết đơn đặt. Vui lòng thử lại.');
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const hideDatePickerModal = () => {
    setShowDatePicker(false);
  };

  const handleDateChange = (event, date) => {
    hideDatePickerModal();
    setSelectedDate(date || selectedDate);
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  const hideTimePickerModal = () => {
    setShowTimePicker(false);
  };

  const handleTimeChange = (event, date) => {
    hideTimePickerModal();
    if (date) {
      const selectedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setSelectedTime(selectedTime);
    }
  };

  return (
    <ImageBackground
      source={require('../images/3af00f57dbb1b2c9fcc47352f47009a5.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Xác nhận thông tin:</Text>
        <Text style={styles.text}>Tên sản phẩm: {cartItems.map(item => item.name).join(', ')}</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={getCurrentUser()?.email}
          editable={false}
        />

        <Text style={styles.text}>Chọn ngày để lấy hàng (vui lòng chọn thời gian sau 2-5 ngày):</Text>
        <TouchableWithoutFeedback onPress={showDatePickerModal}>
          <View style={styles.iconContainer}>
            <Icon name="calendar" size={16} style={styles.icon} />
          </View>
        </TouchableWithoutFeedback>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleDateChange}
          />
        )}
        <Text style={styles.text}>{`Ngày đã chọn: ${selectedDate.toDateString()}`}</Text>

        <Text style={styles.text}>Chọn thời gian lấy hàng:</Text>
        <TouchableWithoutFeedback onPress={showTimePickerModal}>
          <View style={styles.iconContainer}>
            <Icon name="clock-o" size={16} style={styles.icon} />
          </View>
        </TouchableWithoutFeedback>
        {showTimePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="time"
            is24Hour={false}
            display="default"
            onChange={handleTimeChange}
          />
        )}
        <Text style={styles.text}>{`Thời gian đã chọn: ${selectedTime}`}</Text>
        <Text style={styles.text}>Các tùy chọn khác:</Text>
        <TextInput
          style={styles.input}
          placeholder="Vui lòng nhập vào đây"
          value={otherOptions}
          onChangeText={(text) => setOtherOptions(text)}
        />
        <Text style={styles.text}>Tổng tiền: {totalPrice} VND</Text>

        <View style={styles.buttonContainer}>
          <TouchableWithoutFeedback onPress={handleBooking}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Đặt Ngay</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
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
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 16,
  },
  title: {
    color: '#ff66b2',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  text: {
    color: '#ff66b2',
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'left',
  },
  input: {
    backgroundColor: 'pink',
    marginBottom: 8,
    padding: 8,
    fontSize: 20,
    color: '#333',
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  button: {
    backgroundColor: '#ff66b2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 180,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 28,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    color: '#ff66b2',
    fontSize: 20,
    marginRight: 4,
  },
});

export default Booking;
