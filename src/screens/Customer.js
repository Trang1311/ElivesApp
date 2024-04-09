import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ImageBackground, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { useMyContextController } from '../context';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FavoritesScreen from './FavoritesScreen';
//import ChatScreen from './ChatScreen';
import User from './User';
import BottomTabBar from './BottomTabBar';
import Tracking from './Tracking';

const Tab = createBottomTabNavigator();

const getCurrentUser = () => {
  return auth().currentUser;
};

const HomeScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Truy vấn danh sách dịch vụ từ Firestore
    const unsubscribe = firestore()
      .collection('services')
      .onSnapshot((querySnapshot) => {
        const servicesList = [];
        querySnapshot.forEach((documentSnapshot) => {
          servicesList.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setServices(servicesList);
        filterServices(searchTerm, servicesList);
      });

      const unsubscribeFavorites = firestore()
      .collection('USERS')
      .doc(getCurrentUser()?.email)
      .onSnapshot((doc) => {
        const userFavorites = doc.data()?.favorites || [];
        setFavorites(userFavorites);
      });

    return () => {
      unsubscribe();
      unsubscribeFavorites();
    };
  }, [searchTerm]);

  const filterServices = (term, servicesList) => {
    const filteredList = servicesList.filter(
      (item) => item.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredServices(filteredList);
  };

  const addToCart = (service) => {
    if (!selectedServices.some((selectedService) => selectedService.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
      Alert.alert('Thành công', 'Dịch vụ đã được thêm vào giỏ hàng');
    } else {
      Alert.alert('Thông báo', 'Dịch vụ đã tồn tại trong giỏ hàng.');
    }
  };

  const navigateToCartScreen = () => {
    navigation.navigate('CartScreen', {
      selectedServices,
      setSelectedServices: setSelectedServices,
      reloadCart: reloadCartScreen,
      forceUpdateCart: forceUpdate,
    });
  };

  const reloadCartScreen = () => {
    setForceUpdate((prev) => !prev);
  };

  const isServiceFavorite = (service) => {
    return favorites.some((fav) => fav.id === service.id);
  };

  const toggleFavorite = async (service) => {
    const user = getCurrentUser();
    if (!user) {
      return;
    }

    const userEmail = user.email;

    if (!userEmail) {
      console.error('Email not found for the current user.');
      return;
    }

    const userDocRef = firestore().collection('USERS').doc(userEmail);

    try {
      const userDoc = await userDocRef.get();

      if (!userDoc.exists) {
        await userDocRef.set({ favorites: [] });
      }

      const updatedUserDoc = await userDocRef.get();
      const updatedFavorites = updatedUserDoc.data()?.favorites || [];

      if (isServiceFavorite(service)) {
        const updatedFavorites = favorites.filter((fav) => fav.id !== service.id);
        console.log('Updated Favorites:', updatedFavorites);
        await userDocRef.update({ favorites: updatedFavorites });
      } else {
        const updatedFavorites = [...favorites, service];
        console.log('Updated Favorites:', updatedFavorites);
        await userDocRef.update({ favorites: updatedFavorites });
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  return (
    <ImageBackground source={require('../images/dark2.jpg')} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Xin chào: {userLogin.name} !</Text>

        {/* Search input */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
        </View>

        <Text style={styles.title1}>Danh sách sản phẩm</Text>
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.serviceItem}
              onPress={() => navigation.navigate('ServiceDetail', { userLogin, service: item })}
            >
              <View style={styles.itemContainer}>
                <Image source={{ uri: item.image }} style={styles.serviceImage} />
                <View style={styles.itemDetails}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.serviceName}>{item.name}</Text>
                    <View style={styles.iconContainer}>
                    <TouchableOpacity
                style={styles.favoriteIcon}
                onPress={() => toggleFavorite(item)}
              >
                <Ionicons
                  name={isServiceFavorite(item) ? 'heart' : 'heart-outline'}
                  size={21}
                  color="red"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => addToCart(item)}
              >
                <FontAwesome name="shopping-cart" size={20} color="#ff66b2" />
              </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.serviceDescription}>{item.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};


const Customer = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ff66b2',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Trang chủ"
        component={HomeScreen}
        options={{
          iconName: 'home',
        }}
      />
      <Tab.Screen
        name="Yêu thích"
        component={FavoritesScreen}
        options={{
          iconName: 'heart',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={Tracking}
        options={{
          iconName: 'list',
        }}
      />
      <Tab.Screen
        name="Thông tin Người dùng"
        component={User}
        options={{
          iconName: 'person',
        }}
      />
    </Tab.Navigator>
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  title1: {
    fontSize: 25,
    marginBottom: 16,
    color: 'white',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    backgroundColor: 'white',
    paddingLeft: 32,
    color: '#666',
  },
  searchIcon: {
    position: 'relative',
    top: 28,
    left: 10,
    zIndex: 2,
  },
  serviceItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    position: 'relative',
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff66b2',
    flex: 1,
  },
  serviceImage: {
    width: 80,
    height: 80,
    marginRight: 8,
    borderRadius: 8,
  },
  serviceDescription: {
    color: '#666',
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 8,
  },
});

export default Customer;
