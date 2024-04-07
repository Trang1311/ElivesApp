import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ImageBackground,TouchableOpacity } from 'react-native'; // Import ImageBackground
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const backgroundImage = require('../images/bg.jpg');

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
      // Kiểm tra xem mật khẩu và mật khẩu nhập lại có khớp nhau không
      if (password !== confirmPassword) {
        Alert.alert('Lỗi', 'Mật khẩu và mật khẩu nhập lại không khớp.');
        return;
      }

      // Đăng ký tài khoản trên Firebase Authentication
      const authResult = await auth().createUserWithEmailAndPassword(email, password);

      // Lấy thông tin người dùng
      const user = authResult.user;

      // Lưu thông tin người dùng vào Firestore với ID là email
      await firestore().collection('USERS').doc(user.email).set({
        name,
        email,
        address,
        phone,
        password,
        role: 'Customer', // Role mặc định là Customer
      });

      console.log('User registered successfully:', user.uid);
      
      // Hiển thị thông báo và chuyển hướng đến trang đăng nhập
      Alert.alert('Thông Báo', 'Tạo tài khoản thành công!.', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Login'); // Chuyển hướng đến trang đăng nhập
          },
        },
      ]);
    } catch (error) {
      console.error('Error registering user:', error);
      // Xử lý lỗi và hiển thị thông báo hoặc log lỗi
    }
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Đăng ký tài khoản</Text>
        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ"
          value={address}
          onChangeText={(text) => setAddress(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          value={phone}
          onChangeText={(text) => setPhone(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />
        <TouchableOpacity
  onPress={handleSignUp}
  style={{
    backgroundColor: '#ff66b2',
    padding: 12,
    margin: 10,
    alignItems: 'center',
    borderRadius: 8,
    width: '90%',
  }}
>
  <Text style={{ fontSize: 28, color: 'white',fontWeight:"bold" }}>Đăng Ký</Text>
</TouchableOpacity>

      </View>
    
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 40,
    marginBottom: 16,
    color: '#ff66b2',
    fontWeight: "bold",
    top:-50
  },
  input: {
    height: 50,
    width: '90%',
    borderColor: '#ff66b2',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    opacity: 0.8,
    color: 'black',
    fontSize:20
  },
});

export default SignUp;
