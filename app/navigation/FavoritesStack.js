import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Favorites from "../screens/Favorites";

const Stack = createStackNavigator();

export default function FovoritesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "rgb(87,95,206)" },
      }}
    >
      <Stack.Screen
        name="favorites"
        component={Favorites}
        options={{ title: "Restaurantes Favoritos" }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
