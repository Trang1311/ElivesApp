import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const QRPay = () => {
  const navigation = useNavigation();

  const navigateToCustomer = () => {
    setTimeout(() => {
      Alert.alert('Thanh toán thành công!', 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.');
      navigation.navigate('Customer');
    }, 2);
  };
  

  return (
    <ImageBackground
      source={require('../images/3af00f57dbb1b2c9fcc47352f47009a5.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ff66b2', marginBottom: 30, marginTop: 50, marginLeft: 3 }}>
          Quét mã QR để thanh toán
        </Text>
        <Image
          source={require('../images/1f46a08a1b9ab3c4ea8b.jpg')}
          style={{ position: 'relative', top: 0, right: 5, width: 320, height: 380 }}
        />

        <TouchableOpacity style={styles.buttonTT} onPress={navigateToCustomer}>
          <Text style={{ fontSize: 20 }}>Xác nhận</Text>
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
  text: {
    color: '#ff66b2',
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  text1: {
    color: '#ff66b2',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
    padding: 8,
    fontSize: 20,
    color: '#333',
    width: '100%',
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

export default QRPay;
