import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { size } from "lodash";
import { Image } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
export default function ListRestaurants(props) {
  const { user, handleLoadMore, loading } = props;
  const navigation = useNavigation();

  return (
    <View>
      {size(user) > 0 ? (
        <FlatList
          data={user}
          renderItem={(restaurant) => (
            <Restaurants restaurant={restaurant} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          ListFooterComponent={<FooterList loading={loading} />}
        />
      ) : (
        <View style={styles.loaderRestaurants}>
          <ActivityIndicator size="large" color="#00a680" />
          <Text>Cargando user</Text>
        </View>
      )}
    </View>
  );
}
function Restaurants(props) {
  const { restaurant, navigation } = props;
  const { id, images, name, description, addrees } = restaurant.item;
  //pasar valores por navigation
  const goRestaurants = () => {
    navigation.navigate("restaurant", { id, name });
  };
  return (
    <TouchableOpacity onPress={goRestaurants}>
      <View style={styles.viewRestaurant}>
        <View style={styles.viewRestaurantImage}>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="#fff" />}
            source={
              images[0]
                ? { uri: images[0] }
                : require("../../../assets/img/no-image.png")
            }
            style={styles.imageRestaurants}
          />
        </View>
        <View>
          <Text style={styles.restaurantName}>{name} </Text>
          <Text style={styles.restaurantAddress}>{addrees} </Text>
          <Text style={styles.restaurantDescription}>
            {description.substr(0, 600)}...{" "}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FooterList(props) {
  const { loading } = props;
  if (loading)
    return (
      <View style={styles.loaderRestaurants}>
        <ActivityIndicator size="large" color="#00a680" />
      </View>
    );
  else
    return (
      <View style={styles.notFoundRestaurants}>
        <Text> No queda restaurantes por cargar</Text>
      </View>
    );
}
const styles = StyleSheet.create({
  loaderRestaurants: {
    marginTop: 10,
    marginBottom: 10,
  },
  viewRestaurant: {
    flexDirection: "row",
    backgroundColor: "rgb(204, 228, 250)",
    borderRadius: 10,
    margin: 10,
  },
  viewRestaurantImage: {
    marginRight: 15,
  },
  imageRestaurants: {
    width: 80,
    height: 80,
  },
  restaurantName: {
    fontWeight: "bold",
  },
  restaurantAddress: {
    color: "grey",
    paddingTop: 2,
  },
  restaurantDescription: {
    paddingTop: 2,
    color: "grey",
    width: 300,
  },
  notFoundRestaurants: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
});
