import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { useMyContextController } from '../context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const User = () => {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('../images/bg.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <ImageBackground
          source={require('../images/dark2.jpg')} // Replace with your actual header image
          style={styles.header}
        >
          <TouchableOpacity style={styles.userButton} onPress={handleGoBack}>
            <Icon name="home" size={24} color="white" />
          </TouchableOpacity>
          {userLogin.avt && (
            <Image source={{ uri: userLogin.avt }} style={styles.serviceImage} />
          )}
        </ImageBackground>
        <View style={styles.title}>
          {userLogin && (
            <>
              <Text style={styles.userInfo}>Tên: {userLogin.name}</Text>
              <Text style={styles.userInfo}>Email: {userLogin.email}</Text>
              <Text style={styles.userInfo}>Số điện thoại: {userLogin.phone}</Text>
              <Text style={styles.userInfo}>Địa chỉ: {userLogin.address}</Text>
            </>
          )}
          <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Đăng Xuất</Text>
        </TouchableOpacity>
        </View>
        <ImageBackground
          source={require('../images/dark2.jpg')} // Replace with your actual logout button image
          style={styles.logoutButton}
        >
        
        </ImageBackground>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    padding: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    marginBottom: 90,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userButton: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceImage: {
    width: 110,
    height: 110,
    borderRadius: 100,
    position: 'absolute',
    borderColor: 'black',
    top: 150,
    right: 150,
  },
  userInfo: {
    fontSize: 24,
    marginBottom: 10,
    alignSelf: 'center',
    color: 'black',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginLeft: 10,
    marginBottom: 165,
    color: 'white',
  },
  logoutButton: {
    height: 60,
    //backgroundColor: '#ff66b2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    top: -20,
  },
  buttonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff66b2',
    top:10
  },
});

export default User;
