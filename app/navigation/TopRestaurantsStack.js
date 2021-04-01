import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TopRestaurants from "../screens/TopRestaurants";

const Stack = createStackNavigator();

export default function TopRestaurantsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "rgb(87,95,206)" },
      }}
    >
      <Stack.Screen
        name="top-restaurants"
        component={TopRestaurants}
        options={{ title: "Top 5" }}
      ></Stack.Screen>
    </Stack.Navigator>
  );
}
