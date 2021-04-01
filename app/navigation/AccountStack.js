import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Account from "../screens/Account/Account";
import Login from "../screens/Account/Login";
import Register from "../screens/Account/Register";
import { color } from "react-native-reanimated";

const Stack = createStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "rgb(87,95,206)" },
      }}
    >
      <Stack.Screen
        name="account"
        component={Account}
        options={{ title: "Cuenta" }}
      ></Stack.Screen>
      <Stack.Screen
        name="login"
        component={Login}
        options={{ title: "Iniciar Sesión" }}
      ></Stack.Screen>
      <Stack.Screen
        name="register"
        component={Register}
        options={{ title: "Regístrate" }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
