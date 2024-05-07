import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


const CartScreen = ({ route }) => {
  const { selectedServices, setSelectedServices, reloadCart } = route.params;
  const navigation = useNavigation();

  const [serviceQuantities, setServiceQuantities] = useState(
    Object.fromEntries(selectedServices.map((service) => [service.id, 1]))
  );

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setServiceQuantities(Object.fromEntries(selectedServices.map((service) => [service.id, 1])));
    updateTotalPrice();
  }, [selectedServices]);

  const increaseQuantity = (serviceId) => {
    setServiceQuantities((prevQuantities) => ({
      ...prevQuantities,
      [serviceId]: prevQuantities[serviceId] + 1,
    }));
    updateTotalPrice();
  };

  const decreaseQuantity = (serviceId) => {
    setServiceQuantities((prevQuantities) => ({
      ...prevQuantities,
      [serviceId]: Math.max(prevQuantities[serviceId] - 1, 1),
    }));
    updateTotalPrice();
  };

  const updateTotalPrice = () => {
    const newTotalPrice = selectedServices.reduce((total, service) => {
      return total + service.description * serviceQuantities[service.id];
    }, 0);
    setTotalPrice(newTotalPrice);
  };

  const removeService = (serviceId) => {
    const updatedServices = selectedServices.filter((service) => service.id !== serviceId);
    setSelectedServices(updatedServices);

    // Check if the cart is empty after removing the item
    if (updatedServices.length === 0) {
      // Reload the cart to update the UI
      reloadCart();
    } else {
      updateTotalPrice();
    }
  };

  const handleCheckout = () => {
    if (selectedServices.length === 0) {
      // Show an alert if the cart is empty
      Alert.alert('Thông báo', 'Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm để thanh toán.');
    } else {
      // Navigate to the checkout screen
      navigation.navigate('YourCheckoutScreen', { selectedServices, totalPrice });
;
    }
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ hàng</Text>
      {selectedServices.length === 0 ? (
        <Text style={styles.emptyCartMessage}>Giỏ hàng trống</Text>
      ) : (
        <FlatList
          data={selectedServices}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <View style={styles.serviceInfo}>
                <Image source={{ uri: item.image }} style={styles.serviceImage} />
                <View style={styles.serviceText}>
                  <Text>{item.name}</Text>
                  <Text>{item.description} VND</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => decreaseQuantity(item.id)}>
                    <FontAwesome name="minus" size={10} color="blue" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{serviceQuantities[item.id]}</Text>
                  <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
                    <FontAwesome name="plus" size={10} color="blue" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeService(item.id)}>
                  <FontAwesome name="trash-o" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Tổng tiền: {totalPrice}.000 VND</Text>
      </View>
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyCartMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  cartItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceImage: {
    width: 80,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
  },
  serviceText: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  quantityText: {
    marginHorizontal: 8,
  },
  totalContainer: {
    marginTop: 16,
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#ff66b2',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;
