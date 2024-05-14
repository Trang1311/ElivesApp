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
import User from './User';
import Tracking from './Tracking';
import BottomTabBar from './BottomTabBar';
import { Alert } from 'react-native';

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
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(false);

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

  const toggleDropdownPrice = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };
  const toggleDropdownClassify = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };
  const toggleDropdownSubject = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleMenuItemPressClassify = async (menuItem) => {
  try {
    // Thực hiện truy vấn dữ liệu từ Firestore dựa trên menuItem
    const querySnapshot = await firestore()
      .collection('services')
      .where('classify', '==', menuItem)
      .get();

    // Lấy dữ liệu từ querySnapshot và cập nhật state
    const servicesList = [];
    querySnapshot.forEach((documentSnapshot) => {
      servicesList.push({
        id: documentSnapshot.id,
        ...documentSnapshot.data(),
      });
    });
    setFilteredServices(servicesList);
  } catch (error) {
    console.error('Error fetching services:', error);
  }
};

const handleMenuItemPressSubject = async (menuItem) => {
  try {
    // Thực hiện truy vấn dữ liệu từ Firestore dựa trên menuItem
    const querySnapshot = await firestore()
      .collection('services')
      .where('subject', '==', menuItem)
      .get();

    // Lấy dữ liệu từ querySnapshot và cập nhật state
    const servicesList = [];
    querySnapshot.forEach((documentSnapshot) => {
      servicesList.push({
        id: documentSnapshot.id,
        ...documentSnapshot.data(),
      });
    });
    setFilteredServices(servicesList);
  } catch (error) {
    console.error('Error fetching services:', error);
  }
};

const handleMenuItemPressPrice = async (minPrice, maxPrice) => {
  try {
    // Thực hiện truy vấn dữ liệu từ Firestore dựa trên mức giá
    const querySnapshot = await firestore()
      .collection('services')
      .where('description', '>=', minPrice)
      .where('description', '<=', maxPrice)
      .get();

    // Lấy dữ liệu từ querySnapshot và cập nhật state
    const servicesList = [];
    querySnapshot.forEach((documentSnapshot) => {
      servicesList.push({
        id: documentSnapshot.id,
        ...documentSnapshot.data(),
      });
    });
    setFilteredServices(servicesList);
  } catch (error) {
    console.error('Error fetching services:', error);
  }
};
  const handleFilterByPrice = (price) => {
    const filteredList = services.filter((item) => {
      // Lọc dịch vụ dựa trên giá
      // Giả sử mỗi dịch vụ có một trường "price"
      return item.price === price;
    });
    setFilteredServices(filteredList);
  };
  // Trong hàm addToCart:

  const addToCart = async (service) => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        console.error('No user logged in.');
        return;
      }
  
      const userEmail = currentUser.email;
      if (!userEmail) {
        console.error('Email not found for the current user.');
        return;
      }
  
      const userDocRef = firestore().collection('USERS').doc(userEmail);
      const userDoc = await userDocRef.get();
  
      if (!userDoc.exists) {
        // Create a new document if the user does not exist in the "USERS" collection
        await userDocRef.set({ cart: [] });
      }
  
      const userCartRef = userDocRef.collection('cart');
  
      // Check if the product already exists in the cart
      const existingProduct = await userCartRef.doc(service.id).get();
      if (existingProduct.exists) {
        // Product already exists, update the quantity
        const currentQuantity = existingProduct.data().quantity || 0;
        await userCartRef.doc(service.id).update({ quantity: currentQuantity + 1 });
        Alert.alert('Thông báo', 'Sản phẩm đã tồn tại trong giỏ hàng.');
      } else {
        // Product does not exist, add it to the cart with initial quantity of 1
        await userCartRef.doc(service.id).set({ ...service, quantity: 1 });
        Alert.alert('Thành công', 'Sản phẩm đã được thêm vào giỏ hàng.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi thêm vào giỏ hàng.');
    }
  };
  

  const navigateToCartScreen = () => {
    navigation.navigate('CartScreen', {
      selectedServices,
      setSelectedServices: setSelectedServices,
      reloadCart: reloadCartScreen,
      forceUpdateCart: forceUpdate,
      getCurrentUser,

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
          <Icon name="search" size={20} color="#666" style={styles.searchIcon1} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
        </View>

        
      
        <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10,}}>
          <TouchableOpacity onPress={toggleDropdownPrice} style={styles.dropdownToggle}><Text>Lọc theo giá</Text></TouchableOpacity>
          {isDropdownVisible && (
              <View style={styles.dropdownMenu3}>
                <TouchableOpacity onPress={() => handleMenuItemPressPrice(100000, 200000)}>
                  <Text style={styles.dropdownMenuItem}>100-200k</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleMenuItemPressPrice(200000, 400000)}>
                  <Text style={styles.dropdownMenuItem}>200-400k</Text>
                </TouchableOpacity>
              </View>
          )}
          <TouchableOpacity onPress={toggleDropdownClassify} style={styles.dropdownToggle}><Text>Theo chất liệu</Text></TouchableOpacity>
          {isDropdownVisible && (
              <View style={styles.dropdownMenu1}>
                <TouchableOpacity onPress={() => handleMenuItemPressClassify('Hoa sáp')}>
                  <Text style={styles.dropdownMenuItem}>Hoa sáp</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleMenuItemPressClassify('Hoa tiền')}>
                  <Text style={styles.dropdownMenuItem}>Hoa tiền</Text>
                </TouchableOpacity>
              </View>
          )}
          <TouchableOpacity onPress={toggleDropdownSubject} style={styles.dropdownToggle}><Text>Theo chủ đề</Text></TouchableOpacity>
          {isDropdownVisible && (
              <View style={styles.dropdownMenu2}>
                <TouchableOpacity onPress={() => handleMenuItemPressSubject('Giáng sinh')}>
                  <Text style={styles.dropdownMenuItem}>Giáng sinh</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleMenuItemPressSubject('Sinh nhật')}>
                  <Text style={styles.dropdownMenuItem}>Sinh nhật</Text>
                </TouchableOpacity>
              </View>
          )}
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
        <TouchableOpacity style={styles.cartButton} onPress={navigateToCartScreen}>
        <FontAwesome name="shopping-cart" size={24} color="white" />
      </TouchableOpacity>
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
  searchIcon1: {
    position: 'relative',
    top: 28,
    left: 10,
    zIndex: 2,
  },
  searchIcon2: {
    top: -45,
    left: 340,

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
  dropdownToggle: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    backgroundColor: 'white',
    paddingLeft: 32,
    color: '#666',
  
  },
  dropdownToggleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'darkslateblue',
  },
  dropdownMenu1: {
    position: 'absolute',
    top: 20, // vị trí menu dropdown so với button
    left: 150,
    backgroundColor: 'gray',
    borderRadius: 5,
    elevation: 3,
    padding: 10,
  },
  dropdownMenu2: {
    position: 'absolute',
    top: 20, // vị trí menu dropdown so với button
    right: 20,
    backgroundColor: 'gray',
    borderRadius: 5,
    elevation: 3,
    padding: 10,
  },
  dropdownMenu3: {
    position: 'absolute',
    top: 20, // vị trí menu dropdown so với button
    left: 30,
    backgroundColor: 'gray',
    borderRadius: 5,
    elevation: 3,
    padding: 10,
  },
  dropdownMenuItem: {
    fontSize: 16,
    paddingVertical: 5,
    color: 'black',
  },
  cartButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 50,
    height: 50,
    backgroundColor: '#ff66b2',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Customer;
