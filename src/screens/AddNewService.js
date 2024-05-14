import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';

const AddNewService = ({ navigation }) => {
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [serviceInfor, setServiceInfor] = useState('');

  const selectImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });

      setSelectedImage(image.path);
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const addNewService = async () => {
    try {
      // Check if name, description, and image are not empty
      if (!serviceName.trim() || !serviceDescription.trim() || !selectedImage) {
        alert('Vui lòng nhập đầy đủ thông tin (tên, giá và hình ảnh)');
        return;
      }
  
      // Thêm dịch vụ mới vào Firestore
      const newServiceRef = await firestore().collection('services').add({
        name: serviceName,
        description: serviceDescription,
        infor: serviceInfor,
        image: selectedImage, // Add the image URI to Firestore
      });
  
      console.log('Dịch vụ đã được thêm thành công vào Firestore');
      // Hiển thị thông báo thành công
      alert('Sản phẩm đã được thêm thành công vào Firestore');
  
      // Sau khi thêm thành công, chuyển đến màn hình "Admin"
      navigation.navigate('Admin');
    } catch (error) {
      console.error('Lỗi khi thêm dịch vụ vào Firestore:', error);
  
      // Hiển thị thông báo lỗi
      alert('Lỗi khi thêm dịch vụ vào Firestore');
    }
  };
  

  return (
    <ImageBackground
    source={require('../images/iphone-flower-background-8hne18a7azyskyef.jpg')} // Replace with the actual path or URL
    style={styles.backgroundImage}
  >
    <View style={styles.container}>
      <Text style={styles.title}>Thêm mới sản phẩm</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên sản phẩm"
        value={serviceName}
        onChangeText={(text) => setServiceName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Giá sản phẩm"
        value={serviceDescription}
        onChangeText={(text) => setServiceDescription(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mô tả"
        value={serviceInfor}
        onChangeText={(text) => setServiceInfor(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phân Loại"
        value={serviceInfor}
        onChangeText={(text) => setServiceInfor(text)}
      />
      <TouchableOpacity style={styles.selectImageButton} onPress={selectImage}>
        <Text style={styles.selectImageText}>Chọn hình ảnh</Text>
      </TouchableOpacity>
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.selectedImage} />}

      <TouchableOpacity style={styles.selectImageButton} onPress={addNewService}>
        <Text style={styles.selectImageText}>Thêm sản phẩm</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    alignSelf: 'center',
    padding: 16,
    ImageBackground: 'Lab5/Lab5/src/images/f153f1c09000cbe8362c9ddbeed64036.jpg', // Pink background color
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign:'center',
    padding: 13,
    color: '#ff66b2', // White text color
    
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' or 'contain'
  },

  input: {
    height: 50,
    borderColor: '#ff66b2', // Pink border color
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: 5,
    paddingHorizontal: 8,
    color: '#ff66b2', // Pink text color
    fontSize: 18,
    
  },
  selectImageButton: {
    backgroundColor: '#ff66b2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    
  },
  selectImageText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
});

export default AddNewService;
