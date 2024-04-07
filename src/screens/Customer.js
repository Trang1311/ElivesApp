import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ImageBackground, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { useMyContextController } from '../context';
import { SafeAreaView } from 'react-native-safe-area-context';

const Customer = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;

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

    // Hủy đăng ký lắng nghe khi component bị hủy
    return () => unsubscribe();
  }, [searchTerm]);

  const filterServices = (term, servicesList) => {
    const filteredList = servicesList.filter(
      (item) => item.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredServices(filteredList);
  };

  const navigateToUser = () => {
    navigation.navigate('User');
  };

  const navigateToTracking = () => {
    navigation.navigate('Tracking');
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
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceName}>{item.name}</Text>
                {item.image && <Image source={{ uri: item.image }} style={styles.serviceImage} />}
              </View>
              <Text style={styles.serviceDescription}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.button, styles.BookingButton]} onPress={navigateToTracking}>
            <Icon name="list" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToUser}>
            <Icon name="user" size={28} color="white" />
            <TouchableOpacity style={[styles.button, styles.HeartButton]} onPress={navigateToTracking}>
          <Icon name="heart" size={28} color="white" />
        </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  BookingButton: {
    position: 'absolute',
    bottom: 4,
    marginLeft: 340,
  },
  HeartButton: {
    position: 'absolute',
    bottom: -12,
    marginLeft: 150,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff66b2',
  },
  serviceImage: {
    width: 50,
    height: 40,
    borderRadius: 0,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  serviceDescription: {
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Customer;
