import React, { useState } from 'react';
import { View, Text, TouchableWithoutFeedback, StyleSheet, TextInput,ImageBackground } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icon
import { useMyContextController } from '../context';
import { Alert } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Booking = ({ route }) => {
  const { service } = route.params;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const [otherOptions, setOtherOptions] = useState('');
  const navigation = useNavigation();
 
  const handleBooking = async () => {
    try {
      const currentDate = new Date();
      const bookingData = {
        serviceName: service.name,
        
        userName: userLogin.name,
        userEmail: userLogin.email,
        orderDate: currentDate.toISOString(),
        selectedDate: selectedDate.toDateString(),
        selectedTime: selectedTime || 'Default Time', // Use selectedTime or a default value
        otherOptions: otherOptions,
        description: service.description,
        status: 'Đang chờ xác nhận',
      };
  
      const docRef = await firestore().collection('bookings').add(bookingData);
      const bookingId = docRef.id;
  
      console.log('Booking details saved to Firestore:', bookingData);
      console.log('Booking ID:', bookingId);
  
      // Display success message
      navigation.navigate('Pay', { bookingData: { ...bookingData, id: bookingId } });
    } catch (error) {
      console.error('Error saving booking details:', error);
      // Display error message
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

  const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover', // or 'stretch' or 'contain'
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.6)', // Add an alpha value to control the background opacity
      padding: 16,
    },
    text: {
      color: '#ff66b2', // White text
      fontSize: 20,
      marginBottom: 8,
      textAlign: 'left', // Align text to the left
    },
    text1: {
      color: '#ff66b2', // White text
      fontSize: 25,
      fontWeight: 'bold', // Make the text bold
      marginBottom: 8,
      textAlign: 'center', // Center the text
    },
    input: {
      backgroundColor: 'pink', // Light gray background for TextInput
      marginBottom: 8,
      padding: 8,
      fontSize: 20,
      color: '#333', // Dark gray text color
      width: '100%', // Set width to 100%
    },
    buttonContainer: {
      flexDirection: 'row', // Align items in a row
      justifyContent: 'center', // Center content horizontally
      marginTop: 8, // Add marginTop for space
    },
    button: {
      backgroundColor: '#ff66b2', // Dominant pink color for background
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 180,
      marginHorizontal: 4, // Add horizontal margin between buttons
    },
    button1: {
      backgroundColor: 'white', // Dominant pink color for background
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 180,
      marginHorizontal: 4, // Add horizontal margin between buttons
    },
    buttonText: {
      color: '#ffffff', // White text
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
  
  return (
    <ImageBackground
      source={require('../images/3af00f57dbb1b2c9fcc47352f47009a5.jpg')} // Replace with the actual path or URL
      style={styles.backgroundImage}
    >
    <View style={styles.container}>
      <Text style={styles.text1}>Xác nhận thông tin:</Text>
      <Text style={styles.text}>Tên sản phẩm: {service.name}</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={userLogin.name}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={userLogin.email}
        editable={false}
      />

      <Text style={styles.text}>Chọn ngày để lấy hàng(vui lòng chọn thời gian sau 2-5 ngày):</Text>
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
        placeholder="vui lòng nhập vào đây"
        value={otherOptions}
        onChangeText={(text) => setOtherOptions(text)}
      />
      <Text style={styles.text1}>Đơn giá: {service.description}</Text>
      
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

export default Booking;
