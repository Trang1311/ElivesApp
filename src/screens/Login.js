import React, { useState, useEffect } from "react";
import { View, Image ,ImageBackground,TouchableOpacity} from "react-native";
import { Button, Text, TextInput,IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { useMyContextController, login } from "../context";

const backgroundImage = require('../images/bg.jpg'); // Update with the correct path to your image

export default Login = ({ navigation }) => {
  const [email, setEmail] = useState("trang@gmail.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const navigateToForgetPassword = () => {
    navigation.navigate("Forget");
  };
  useEffect(() => {
    if (userLogin != null) {
      if (userLogin.role === "admin") {
        navigation.navigate("Admin");
      } else {
        navigation.navigate("Customer");
      }
    }
  }, [userLogin, navigation]);

  const onSubmit = () => {
    login(dispatch, email, password);
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
    >
    <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
      <Text style={{ fontSize: 40, fontWeight: "bold", alignSelf: "center", color: "#ff66b2", marginBottom: 30,top:-80 }}>
        WELLCOME!
      </Text>
      <Image
        source={require('../images/logo.png')}  // Update with the correct path to your image
        style={{ position: 'absolute', top:80, right: 130, width: 150, height: 150 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ margin: 10 }}
        mode="outlined"
        theme={{ colors: { primary: "white", background: "white" } }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        style={{ margin: 10 }}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        mode="outlined"
      />
        <Button
        mode="contained-tonal"
        onPress={onSubmit}
        style={{ margin: 10, padding: 8 ,backgroundColor: 'white'}}
        labelStyle={{ fontSize: 20, color: "#ff66b2" }}
        theme={{ colors: { primary: "white" } }}
      >
        Đăng Nhập
      </Button>
      <Button
        mode="contained-tonal"
        onPress={() => navigation.navigate("SignUp")}
        style={{ margin: 10, padding: 8 ,backgroundColor: 'white'}}
        labelStyle={{ fontSize: 20, color: "#ff66b2" }}
        theme={{ colors: { primary: "#ff66b2" } }}
      >
        Đăng Ký
      </Button>
      <TouchableOpacity onPress={navigateToForgetPassword}>
          <Text style={{ textAlign: 'center', margin: 10, color: 'white' }}>
            Quên mật khẩu?
          </Text>
        </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};
