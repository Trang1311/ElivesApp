import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, Alert } from 'react-native';
import { Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import { useNavigation } from '@react-navigation/native';
import { useMyContextController } from '../context';
import { ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; // Import thêm auth từ Firebase

const ServiceDetail = ({ route }) => {
  const { service } = route.params;
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);
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
        </MenuOptions>
    </Menu>
  );

  // Định nghĩa hàm getCurrentUser để lấy người dùng hiện tại từ Firebase Authentication
  const getCurrentUser = () => {
    return auth().currentUser;
  };

  // Xác định trạng thái yêu thích của dịch vụ hiện tại
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const user = getCurrentUser(); // Sử dụng hàm getCurrentUser để lấy người dùng hiện tại
      if (!user) return;

      const userEmail = user.email;
      if (!userEmail) return;

      const userDocRef = firestore().collection('USERS').doc(userEmail);
      const userDoc = await userDocRef.get();

      if (!userDoc.exists) return;

      const userFavorites = userDoc.data()?.favorites || [];
      setIsFavorite(userFavorites.some(fav => fav.id === service.id));
    };

    checkFavoriteStatus();
  }, []);

  // Thêm hoặc xóa dịch vụ khỏi danh sách yêu thích
  const toggleFavorite = async () => {
    const user = getCurrentUser();
    if (!user) return;

    const userEmail = user.email;
    if (!userEmail) return;

    const userDocRef = firestore().collection('USERS').doc(userEmail);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      await userDocRef.set({ favorites: [] });
    }

    const userFavorites = userDoc.data()?.favorites || [];

    if (isFavorite) {
      const updatedFavorites = userFavorites.filter(fav => fav.id !== service.id);
      await userDocRef.update({ favorites: updatedFavorites });
    } else {
      const updatedFavorites = [...userFavorites, service];
      await userDocRef.update({ favorites: updatedFavorites });
    }

    setIsFavorite(!isFavorite);
  };

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
  favoriteContainer: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 24,
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
