import React from 'react';
import { View, Text, Button, StyleSheet, Alert, ImageBackground, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const DeleteServices = ({ route, navigation }) => {
  const { service } = route.params;

  const handleDelete = async () => {
    try {
      const serviceRef = firestore().collection('services').doc(service.id);
      await serviceRef.delete();

      console.log('Service deleted successfully from Firestore');

      // Show success message
      Alert.alert('Success', 'Service deleted successfully', [
        {
          text: 'OK',
          onPress: () => {
            // After deleting, navigate back to the Admin screen
            navigation.navigate('Admin');
          },
        },
      ]);
    } catch (error) {
      console.error('Error deleting service from Firestore:', error);

      // Show error message
      Alert.alert('Error', 'Error deleting service. Please try again.');
    }
  };

  return (
    <ImageBackground
    source={require('../images/iphone-flower-background-8hne18a7azyskyef.jpg')} // Replace with the actual path or URL
    style={styles.backgroundImage}
  >
    <View style={styles.container}>
      <Text style={styles.title} >Xóa Sản phẩm</Text>
      <Image
        source={require('../images/free-30-instagram-stories-icons66_122613.png')}  // Update with the correct path to your image
        style={{ position: 'relative', top:0, right: 10, width: 80, height: 80 }}
      />
      <Text style={styles.title1}>Bạn có chắc muốn xóa sản phẩm này?</Text>
      <View style={styles.buttonContainer}>
        <Button title="    HỦY    " onPress={() => navigation.goBack()} 
        color="#ff66b2" fontSize={30}/>
        <View style={styles.buttonSpacer} />
        <Button title="     OK     " onPress={handleDelete} 
        color="#ff66b2" fontSize={20}/>
      </View>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderWidth: 8, 
    borderColor: '#ff66b2', // Border color
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' or 'contain'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 150,
    color: '#ff66b2',
    
  },
  title1: {
    fontSize: 20,
    
    marginBottom: 40,
    color: '#ff66b2',
    
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
    overflow: 'hidden',
  },
  buttonSpacer: {
    width: 20, // Adjust the width as needed
  },
});

export default DeleteServices;
