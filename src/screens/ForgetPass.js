import React, {useState} from 'react';
import {View,Text, Alert, ImageBackground, StyleSheet,TouchableOpacity} from 'react-native'
import { Button, TextInput } from 'react-native-paper';
import auth from '@react-native-firebase/auth'
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';


function ForgetPass() {

    const [email, setEmail] = useState('')
    const navigation = useNavigation();

    const navigateToLogin = () => {
      navigation.navigate('Login');};
    const handleSendPassword = (values) => {
        const {email} = values
        auth().sendPasswordResetEmail(email)
        .then(() =>{
            Alert.alert('Thông báo','Đã gửi yêu cầu thay đổi mật khẩu! Hãy kiểm tra email và cập nhật mật khẩu mới!')
            navigation.navigate('Login');
        })
        .catch(err => console.log(err))
    }

    return (  
        <ImageBackground
        source={require('../images/3af00f57dbb1b2c9fcc47352f47009a5.jpg')} // Replace with the actual path or URL
        style={styles.backgroundImage}>
        <Formik 
                 initialValues={{
                     email: "",
                     }}
                     onSubmit={values => handleSendPassword(values)}
                >
            {({handleBlur,handleChange,handleSubmit,values}) =>(
        <View style={{flex:1, marginTop: 40}}>
            <Text style={{fontSize: 18, marginLeft: 10}}>Nhập Email để thay đổi mật khẩu</Text>
            <TextInput
            label='Email'
            placeholder='Nhập email của bạn'
            mode='outlined'
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            style={{
                marginTop:10,
                marginLeft:10,
                marginRight:10,
                marginBottom:20
            }}
            />
           
           <TouchableOpacity
                onPress={handleSubmit}
                style={{
                    backgroundColor: '#ff66b2',
                    padding: 12,
                    margin: 20,
                    alignItems: 'center',
                    borderRadius: 8,
                    
                    width: '90%',
                }}>
                <Text style={{ fontSize: 24,fontWeight:"bold", color: 'white' }}>GỬI YÊU CẦU</Text>
            </TouchableOpacity>
            
        </View>
         )}
         </Formik>
         </ImageBackground>
    );
}
const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover', // or 'stretch' or 'contain'
    },
    buttonLabel: {
        fontSize: 24, 
        bottom:-5
        
      },
});

export default ForgetPass;