import { createContext, useContext, useReducer, useMemo } from "react"; 
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore"; 
import { useNavigation } from '@react-navigation/native';

const MyContext = createContext(); 
MyContext.displayName = "MyContextContext"; 

function reducer(state, action) {
    switch (action.type) {
      case "USERS_LOGIN": {
        return { ...state, userLogin: action.value };
      }
      case "USER_LOGOUT": {
        return { ...state, userLogin: null };
      }
      default: {
        console.error(`Unhandled action type: ${action.type}`);
        return state;
      }
    }
  }
  
  

function MyContextControllerProvider({ children }) { 
    const initialState = { 
        userLogin: null,
        loading: false,
    }; 
    const [controller, dispatch] = useReducer(reducer, initialState);
    const value = useMemo(() => [controller, dispatch], [controller, dispatch]); 
    return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

function useMyContextController() { 
    const context= useContext(MyContext); 
    if (!context) { 
        throw new Error ("useMyContextController should be used inside the MyContextControllerProvider.");
    }
    return context; 
}

const USERS = firestore().collection("USERS");

const login = async (dispatch, email, password) => {
    try {
      // Sign in the user
      await auth().signInWithEmailAndPassword(email, password);
  
      // Fetch user data from Firestore based on the email
      const userSnapshot = await firestore().collection("USERS").doc(email).get();
  
      // Check if the user exists
      if (userSnapshot.exists) {
        const userData = userSnapshot.data();
        console.log("Đăng nhập thành công với user:", userData);
  
        // Dispatch the user data to the context
        dispatch({ type: "USERS_LOGIN", value: userData });
      } else {
        console.error("User data not found in Firestore for email:", email);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Sai user và password");
    }
  };

  const logout = (dispatch) => {
    // Reset the userLogin state to null
    dispatch({ type: "USER_LOGOUT" });
  
    // Navigate back to the Home screen
    //const navigation = useNavigation();
    //navigation.navigate('Login');
  };
  

const createNewService = async (newService) => {
    newService.finalupdate = firestore.FieldValue.serverTimestamp();
    await firestore().collection("SERVICES").add(newService);
};

export { 
    MyContextControllerProvider,
    useMyContextController,
    login, 
    logout, 
    createNewService,
};
