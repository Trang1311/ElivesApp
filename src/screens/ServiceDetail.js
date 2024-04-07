import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { useNavigation } from '@react-navigation/native';
import { useMyContextController } from '../context';
import { ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ServiceDetail = ({ route }) => {
  const { service } = route.params;
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  const renderAdminMenu = () => (
    <Menu style={styles.menu}>
      <MenuTrigger text="&#8942;" customStyles={triggerStyles} />
      <MenuOptions>
        <MenuOption onSelect={() => navigation.navigate('EditServices', { service })} text="Sửa sản phẩm" customStyles={menuOptionStyles} />
        <MenuOption onSelect={() => navigation.navigate('DeleteServices', { service })} text="Xóa sản phẩm" customStyles={menuOptionStyles} />
        <MenuOption onSelect={() => navigation.navigate('Chat', { service })} text="Tư vấn Khách hàng" customStyles={menuOptionStyles} />
      </MenuOptions>
    </Menu>
  );

  const renderCustomerMenu = () => (
    <Menu style={styles.menu}>
      <MenuTrigger text="&#8942;" customStyles={triggerStyles} />
      <MenuOptions>
        <MenuOption onSelect={() => navigation.navigate('Chat', { service })} text="Tư vấn" customStyles={menuOptionStyles} />
        <MenuOption onSelect={() => navigation.navigate('Booking', { service })} text="Đặt lịch" customStyles={menuOptionStyles} />
      </MenuOptions>
    </Menu>
  );

  return (
    <ImageBackground source={require('../images/white.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.title}>Chi tiết sản phẩm</Text>
            <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteContainer}>
              <Icon name={isFavorite ? 'heart' : 'heart-o'} size={24} color={isFavorite ? 'red' : 'white'} style={styles.favoriteIcon} />
            </TouchableOpacity>
            {userLogin.role === 'admin' ? renderAdminMenu() : renderCustomerMenu()}
          </View>
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Tên sản phẩm:</Text>
            <Text style={styles.value}>{service.name}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Giá:</Text>
            <Text style={styles.value}>{service.description}</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image source={{ uri: service.image }} style={styles.serviceImage} />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Thông tin sản phẩm:</Text>
            <Text style={styles.value}>{service.infor}</Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const triggerStyles = {
  triggerText: {
    fontSize: 30,
    color: 'white',
  },
};

const menuOptionStyles = {
  optionText: {
    fontSize: 18,
    padding: 8,
    backgroundColor: "#ff66b2",
    color: 'white',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  scrollView: {
    marginTop: 80,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'stretch',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor:"#ff66b2"
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  menu: {
    marginRight: -4,
    top:-1,
  },
  infoContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  value: {
    fontSize: 18,
    color: 'black',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
});

export default ServiceDetail;
