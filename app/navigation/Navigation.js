import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RestaurantsStack from "./RestaurantsStack";
import FovoritesStack from "./FavoritesStack";
import TopRestaurantsStack from "./TopRestaurantsStack";
import SearchStack from "./SearchStack";
import AccountStack from "./AccountStack";
import { Icon } from "react-native-elements";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="restaurants"
        tabBarOptions={{
          inactiveTintColor: "rgb(137,144,246)",
          activeTintColor: "rgb(66,75,188)",
        }}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => screenOptions(route, color),
        })}
      >
        <Tab.Screen
          name="restaurants"
          component={RestaurantsStack}
          options={{ title: "Paseadores" }}
        />
        <Tab.Screen
          name="favorites"
          component={FovoritesStack}
          options={{ title: "Favoritos" }}
        />
        <Tab.Screen
          name="top-restaurants"
          component={TopRestaurantsStack}
          options={{ title: "Top 5" }}
        />
        <Tab.Screen
          name="search"
          component={SearchStack}
          options={{ title: "Mascotas" }}
        />
        <Tab.Screen
          name="account"
          component={AccountStack}
          options={{ title: "Cuenta" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function screenOptions(route, color) {
  let iconName;
  switch (route.name) {
    case "restaurants":
      iconName = "run";
      break;
    case "favorites":
      iconName = "heart";
      break;
    case "top-restaurants":
      iconName = "star";
      break;
    case "search":
      iconName = "paw";
      break;
    case "account":
      iconName = "account";
      break;
    default:
      break;
  }
  return <Icon type="material-community" name={iconName} color={color} />;
}
