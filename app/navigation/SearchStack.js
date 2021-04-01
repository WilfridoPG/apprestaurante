import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Search from "../screens/Search";

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
        options={{ title: "Buscar" }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
