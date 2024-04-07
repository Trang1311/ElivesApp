
import {View} from "react-native"
import { Button } from "react-native-paper"
import { useMyContextController, logout } from "../context"
export default Setting = ({navigation})=>{
    const [controller, dispatch] = useMyContextController();
    const {userLogin} = controller;
    useEffect(()=>{
        if(userLogin==null)
            navigation.navigate("Login")
    }, [userLogin])
    const onSubmit = ()=>{
        logout (dispatch)
    }
    return (
        <View style={{flex:1, justifyContent:"center"}}>
            <Button mode="contained" onPress={onSubmit}>Đăng Xuất</Button>
        </View>
    )
    
    return (
        <View style={{flex:1, backgroundColor:""}}>
            <View style=
            {{
                backgroundColor: COLORS.pink,
                height:100,
                flexDirection: "row",
                alignItems: "center",
                justifyContent:"space-between",
            }}>
                <Text variant="displaySmall" style={{color: COLORS.white}} > {(userLogin!=null) && userLogin.name.toUpperCase()}</Text>
                <IconButton icon="account-circle" size={40} iconcolor={COLORS.white}/>
            </View>
            <View style={{flex:1, backgroundColor: COLORS.white}}>
                <Image source={logo} style={{margin:10, alignSelf:"center"}}/>
                <View style=
                {
                    {
                        height:50,
                        backgroundColor: COLORS.white,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent:"space-between",
                        
                    }
                }
                >
                    <Text variant="headlineSmall" style={{color: COLORS.black, fontweight:"bold"}} > Danh Sách Dịch Vụ</Text>
                    <IconButton icon="plus-circle" size={40} iconColor={COLORS.pink} onPress={() => navigation.navigate("AddNewService")}/>
                </View>
            </View>
        </View>
    )
}