import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Search from "../screens/Search";
import AddRestaurant from "../screens/Restaurants/AddRestaurant";
const Stack = createStackNavigator();

export default function SearchStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "rgb(87,95,206)" },
      }}
    >
      <Stack.Screen
        name="serach"
        component={Search}
        options={{ title: "Mascotas" }}
      ></Stack.Screen>
      <Stack.Screen
        name="add-restaurant"
        component={AddRestaurant}
        options={{ title: "Agregar mascota" }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
