import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const getCurrentUser = () => {
  return auth().currentUser;
};

const CartScreen = () => {
  const navigation = useNavigation();

  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); 
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.error('No user logged in.');
      return;
    }

    const unsubscribe = firestore()
      .collection('USERS')
      .doc(currentUser.email)
      .collection('cart')
      .onSnapshot((querySnapshot) => {
        const items = [];
        let total = 0;
        querySnapshot.forEach((doc) => {
          const item = { id: doc.id, ...doc.data() };
          items.push(item);
          total += item.description * (item.quantity || 1);
        });
        setCartItems(items);
        setTotalPrice(total); // Cập nhật totalPrice khi có sự thay đổi trong giỏ hàng
      });

    return () => unsubscribe();
  }, []);


  const increaseQuantity = async (cartItemId) => {
    try {
      console.log('Increase quantity for cart item:', cartItemId);
  
      const currentUser = getCurrentUser();
      if (!currentUser) {
        console.error('No user logged in.');
        return;
      }
  
      const itemRef = firestore()
        .collection('USERS')
        .doc(currentUser.email)
        .collection('cart')
        .doc(cartItemId);
  
      const doc = await itemRef.get();
      if (doc.exists) {
        const currentQuantity = doc.data().quantity || 1;
        console.log('Current quantity:', currentQuantity);
        
        await itemRef.update({ quantity: currentQuantity + 1 });
        console.log('Quantity increased successfully!');
      }
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  };
  
  const decreaseQuantity = async (cartItemId) => {
    try {
      console.log('Decrease quantity for cart item:', cartItemId);
  
      const currentUser = getCurrentUser();
      if (!currentUser) {
        console.error('No user logged in.');
        return;
      }
  
      const itemRef = firestore()
        .collection('USERS')
        .doc(currentUser.email)
        .collection('cart')
        .doc(cartItemId);
  
      const doc = await itemRef.get();
      if (doc.exists) {
        const currentQuantity = doc.data().quantity || 1;
        console.log('Current quantity:', currentQuantity);
  
        if (currentQuantity > 1) {
          await itemRef.update({ quantity: currentQuantity - 1 });
          console.log('Quantity decreased successfully!');
        } else {
          console.log('Quantity is already at minimum.');
        }
      }
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  };
  
  const removeFromCart = (itemId) => {
    firestore()
      .collection('USERS')
      .doc(getCurrentUser().email)
      .collection('cart')
      .doc(itemId)
      .delete()
      .then(() => {
        console.log('Item removed from cart successfully!');
      })
      .catch((error) => {
        console.error('Error removing item from cart:', error);
      });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Thông báo', 'Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm để thanh toán.');
    } else {
      navigation.navigate('Booking', { cartItems, totalPrice });
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ hàng</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartMessage}>Giỏ hàng trống</Text>
      ) : (
        <FlatList
          data={cartItems}
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
                  <Text style={styles.quantityText}>{item.quantity || 1}</Text>
                  <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
                    <FontAwesome name="plus" size={10} color="blue" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <FontAwesome name="trash-o" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Tổng tiền: {totalPrice} VND</Text>
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
