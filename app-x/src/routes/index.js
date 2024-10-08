import { createStackNavigator } from "@react-navigation/stack";
import Welcome from "../pages/Welcome";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Users from "../pages/Users";
import EditUser from "../pages/EditUser";

const Stack = createStackNavigator();

export default function Routes() {
    return (

        <Stack.Navigator initialRouteName="Welcome">

            <Stack.Screen
                name="Welcome"
                component={Welcome}
                options={{headerShown: false}}
            />

            <Stack.Screen
                name="Login"
                component={Login}
                options={{headerShown: false}}
            />

            <Stack.Screen
                name="Home"
                component={Home}
                options={{headerShown: false}}
            />

            <Stack.Screen 
                name="Register"
                component={Register}
                options={{headerShown: false}}
            />

            <Stack.Screen
                name="Users"
                component={Users}
                options={{headerShown: false}}
            />
            
            <Stack.Screen
                name="EditUser"
                component={EditUser}
                options={{headerShown: false}}
            />

        </Stack.Navigator>

    )
}