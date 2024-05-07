// FavoritesScreen
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity,ImageBackground, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { useMyContextController } from '../context';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const getCurrentUser = () => {
  return auth().currentUser;
};

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const [favoriteServices, setFavoriteServices] = useState([]);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

  useEffect(() => {
    const fetchFavoriteServices = async () => {
      const user = getCurrentUser();
      if (!user) {
        console.warn('User not authenticated');
        return;
      }

      const userDocRef = firestore().collection('USERS').doc(user.email);

      try {
        const userDoc = await userDocRef.get();
        console.log('User document:', userDoc.data());

        const favorites = userDoc.data()?.favorites || [];
        console.log('Fetched favorites:', favorites);

        setFavoriteServices(favorites);
        setUpdateFlag((prev) => !prev); // Force re-render
      } catch (error) {
        console.error('Error fetching favorite services:', error);
      }
    };

    fetchFavoriteServices();
  }, [updateFlag]);

  const navigateToServiceDetail = (service) => {
    navigation.navigate('ServiceDetail', { service });
  };

  const addToCart = (service) => {
    if (!selectedServices.some((selectedService) => selectedService.id === service.id)) {
      setSelectedServices([...selectedServices, service]);
      Alert.alert('Thành công', 'Dịch vụ đã được thêm vào giỏ hàng');
    } else {
      Alert.alert('Thông báo', 'Dịch vụ đã tồn tại trong giỏ hàng.');
    }
  };

  const isServiceFavorite = (service) => {
    return favoriteServices.some((fav) => fav.id === service.id);
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
        const updatedFavorites = favoriteServices.filter((fav) => fav.id !== service.id);
        console.log('Updated Favorites:', updatedFavorites);
        await userDocRef.update({ favorites: updatedFavorites });
      } else {
        const updatedFavorites = [...favoriteServices, service];
        console.log('Updated Favorites:', updatedFavorites);
        await userDocRef.update({ favorites: updatedFavorites });
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  return (
    <ImageBackground
      source={require('../images/dark2.jpg')}
      style={styles.backgroundImage}
    >
    <View style={styles.container}>
      {favoriteServices.length === 0 ? (
        <Text style={styles.emptyCartMessage}>Danh sách Yêu thích của bạn hiện đang trống.</Text>
      ) : (
        <FlatList
          data={favoriteServices}
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
      )}
    </View>
    </ImageBackground>
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
  emptyCartMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
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

export default FavoritesScreen;
