import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image,TextInput,ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
//test
const Admin = () => {
  const [services, setServices] = useState([]);
  const navigation = useNavigation();
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
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
        filterServices(searchTerm, servicesList); // Thay đổi từ filteredServices thành servicesList
      });
  
    return () => unsubscribe();
  }, [searchTerm]);
  

  const filterServices = (term, servicesList) => {
    const filteredList = servicesList.filter(
      (item) => item.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredServices(filteredList);
  };

  const navigateToAddNewService = () => {
    navigation.navigate('AddNewService');
  };

  const navigateToUser = () => {
    navigation.navigate('User');
  };

  const navigateToList = () => {
    navigation.navigate('List');
  };

  const isUnread = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    return service && service.unreadMessages > 0;
  };

  const renderUnreadDot = (serviceId) => {
    const service = services.find((s) => s.id === serviceId);
    return service && service.unreadMessages > 0 ? (
      <View style={styles.unreadDot} />
    ) : null;
  };
  
  
  return (
    <ImageBackground source={require('../images/dark2.jpg')} style={styles.backgroundImage}>
    <SafeAreaView style={styles.container}>
       
      <Text style={styles.title}>Danh sách sản phẩm</Text>
      <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
        </View>
        <FlatList
            data={filteredServices} // Thay đổi từ services thành filteredServices
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.serviceItem}
                onPress={() => navigation.navigate('ServiceDetail', { service: item })}
              >
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceName}>
                    {renderUnreadDot(item.id)}
                    {item.name}
                  </Text>
                  {item.image && <Image source={{ uri: item.image }} style={styles.serviceImage} />}
                </View>
                <Text style={styles.serviceDescription}>{item.description}</Text>
              </TouchableOpacity>
            )}
        />
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={navigateToAddNewService}>
          <Icon name="plus" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.BookingButton]} onPress={navigateToList}>
          <Icon name="list" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity  onPress={navigateToUser}>
          <Icon name="user" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#ff66b2', // Màu hồng chủ đạo
    padding: 16,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  unreadDot: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 5,
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    margin: 16,
    color: 'white', // Màu chữ trắng
  },
  serviceItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#fff', // Màu nền trắng cho từng dịch vụ
    borderRadius: 8,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative', // Added for positioning the unread dot
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff66b2', // Màu chữ hồng
  },
  serviceImage: {
    width: 50,
    height: 40,
    borderRadius: 0,
    marginLeft: -60,
  },
  serviceDescription: {
    color: '#666', // Màu chữ xám
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: { 
    position: 'absolute',
    bottom: -4,
    right: 16,
  },
  BookingButton: {
    position: 'absolute',
    bottom: -4,
    marginLeft: 160,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    //backgroundColor: '#ff66b2', // Set the background color to transparent
  },
});

export default Admin;
