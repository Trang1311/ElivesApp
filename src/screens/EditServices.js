import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Button } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';

const EditServices = ({ route, navigation }) => {
  const { service } = route.params;
  const [editedName, setEditedName] = useState(service.name);
  const [editedDescription, setEditedDescription] = useState(service.description);
  const [editedImage, setEditedImage] = useState(service.image);
  const [editedInfor, setEditInfor] = useState(service.infor);

  const selectImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });

      setEditedImage(image.path);
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const serviceRef = firestore().collection('services').doc(service.id);

      await serviceRef.update({
        name: editedName,
        description: editedDescription,
        image: editedImage,
        infor: editedInfor,
        // Add other fields as needed
      });

      console.log('Service updated successfully in Firestore');

      Alert.alert('Thành công!!', 'Sản phẩm đã được cập nhật thành công', [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('ServiceDetail', {
              service: { ...service, name: editedName, description: editedDescription, image: editedImage, infor: editedInfor },
            });
          },
        },
      ]);
    } catch (error) {
      console.error('Error updating service in Firestore:', error);
      Alert.alert('Error', 'Error updating service. Please try again.');
    }
  };

  return (
    <ImageBackground
      source={require('../images/iphone-flower-background-8hne18a7azyskyef.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Sửa Sản Phẩm</Text>
        <TextInput
          style={styles.input}
          placeholder="Service Name"
          value={editedName}
          onChangeText={(text) => setEditedName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Service Description"
          value={editedDescription}
          onChangeText={(text) => setEditedDescription(text)}
          multiline
        />
        <TextInput
          style={styles.inputlarge}
          placeholder="Service Infor"
          value={editedInfor}
          onChangeText={(text) => setEditInfor(text)}
          multiline
        />

        <TouchableOpacity onPress={selectImage}>
          <Text style={styles.selectImageText}>Chọn hình ảnh</Text>
        </TouchableOpacity>
        {editedImage && <Image source={{ uri: editedImage }} style={styles.selectedImage} />}
        <Button mode="contained" buttonColor="#ff66b2" onPress={handleUpdate} labelStyle={styles.buttonLabel}>
          Cập Nhật
        </Button>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // White background color with some transparency
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' or 'contain'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    padding: 13,
    color: '#ff66b2', // White text color
  },
  inputlarge: {
    height: 200,
    borderColor: '#ff66b2', // Pink border color
    borderWidth: 1,
    marginBottom: 12,
    borderRadius: 5,
    paddingHorizontal: 8,
    color: '#ff66b2', // Pink text color
    fontSize: 18,
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
  buttonLabel: {
    fontSize: 18, // Adjust the font size as needed
  },
  selectImageText: {
    color: '#ff66b2',
    fontSize: 20,
    fontWeight:'bold',
    marginVertical: 8,
  },

  selectedImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginVertical: 8,
  },
});

export default EditServices;
