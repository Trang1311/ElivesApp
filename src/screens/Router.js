import 'react-native-gesture-handler';
import React from "react"
import { StyleSheet,Text,View } from "react-native" 
import { useMyContextController } from '../context';
import { createStackNavigator } from '@react-navigation/stack';
import Admin from './Admin';
import Login from './Login';
import Customer from './Customer';
import Services from "./Services";
import ServiceDetail from "./ServiceDetail";
import AddNewService from "./AddNewService";
import User from './User';
import DeleteServices from './DeleteServices';
import EditServices from './EditServices';
import Chat from './Chat';
import Booking from './Booking'
import ListBookings from './ListBookings';
import Tracking from './Tracking';
import Pay from './Pay';
import QRPay from './QRPay';
import SignUp from './SignUp';
import ForgetPass from './ForgetPass';
import FavoritesScreen from './FavoritesScreen';
import CartScreen from './CartScreen';

const Stack = createStackNavigator();
 export default Router =()=>{
    const [controller, dispatch]= useMyContextController();
    const {userlogin}=controller;
    return (
        <Stack.Navigator initialRouteName='Login'
        screenOptions={{
            headerShown:false
        }}
        >
            <Stack.Screen name='Admin' component={Admin}/>
            <Stack.Screen name='Customer' component={Customer}/>
            <Stack.Screen name='Login' component={Login}/>
            <Stack.Screen name='DeleteServices' component={DeleteServices}/>
            <Stack.Screen name='EditServices' component={EditServices}/>
            <Stack.Screen name='Chat' component={Chat}/>
            <Stack.Screen name='Pay' component={Pay}/>
            <Stack.Screen name='QRPay' component={QRPay}/>
            <Stack.Screen name='Tracking' component={Tracking}/>
            <Stack.Screen name='SignUp' component={SignUp}/>
            <Stack.Screen name='Forget' component={ForgetPass}/>
            <Stack.Screen name='FavoritesScreen' component={FavoritesScreen}/>
            <Stack.Screen name='CartScreen' component={CartScreen}/>
            <Stack.Screen name="Booking" component={Booking}
                options={{
                    headerStyle: {backgroundColor:"pink"},
                }}
            />
            <Stack.Screen name="Services" component={Services}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen name="AddNewService" component={AddNewService}
                options={{
                    headerStyle: {backgroundColor:"pink"},
                }}
            />
            <Stack.Screen name="ServiceDetail"component={ServiceDetail}
                options={{
                    headerStyle: {backgroundColor: "pink"},
            }}
            />
            <Stack.Screen name="User"component={User}
                options={{
                    headerStyle: {backgroundColor: "pink"},
            }}
            />
            <Stack.Screen name="List"component={ListBookings}
                options={{
                    headerStyle: {backgroundColor: "pink"},
            }}
            />
            
        </Stack.Navigator>
    )
 }