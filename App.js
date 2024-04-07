import React,{useEffect} from "react"
import { StyleSheet,Text,View } from "react-native" 
import firestore from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import { MyContextControllerProvider } from "./src/context"
import Router from "./src/screens/Router"
import { NavigationContainer } from '@react-navigation/native'
import { initializeApp } from '@react-native-firebase/app';
//import RouterServices from "./src/screens/RouterServices"
import { MenuProvider } from 'react-native-popup-menu';

const initial = async () => {
  const USERS = firestore().collection("USERS");
  const admin = {
    name: "admin",
    phone: "09111111",
    address: "Binh Duong",
    email: "trang@gmail.com",
    password: "123456",
    role: "admin",
  };

  try {
    // Create a new user
    const userCredential = await auth().createUserWithEmailAndPassword(admin.email, admin.password);

    // Save additional information to Firestore using admin.email as the document ID
    await USERS.doc(admin.email).set(admin);

    console.log("Admin user created and information saved successfully!");
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      console.log("Admin user already exists.");
    } else {
      console.error("Error during admin user creation:", error);
    }
  }
};





export default App = ()=>{
  useEffect(()=>{
    initial()
  },[])
  return(
    <MyContextControllerProvider>
      <MenuProvider>
      <NavigationContainer>
        <Router/>
      </NavigationContainer>
      </MenuProvider>
    </MyContextControllerProvider>
  )
}
const styles = StyleSheet.create(
  {
    container:{
      flex:1
    }
  }
)