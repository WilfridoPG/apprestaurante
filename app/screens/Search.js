import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Icon } from "react-native-elements";
import { FireSQL } from "firesql";
import firebase from "firebase/app";

const fireSql = new FireSQL(firebase.firestore(), { includeId: "id" });
export default function Search({ navigation }) {
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  useEffect(() => {
    if (search)
      fireSql
        .query(`SELECT * FROM restaurants WHERE name LIKE '${search}%'`)
        .then((response) => {
          console.log("response", response);
          setRestaurants(response);
        });
  }, [search]);
  return (
    <View>
      <SearchBar
        placeholder="Buscar tu restaurante"
        onChangeText={(e) => setSearch(e)}
        containerStyle={styles.searchBar}
        value={search}
      ></SearchBar>
      {search.length == 0 ? (
        <NotFoundRestaurant></NotFoundRestaurant>
      ) : (
        <FlatList
          data={restaurants}
          renderItem={(restaurant) => (
            <Restaurant
              restaurant={restaurant}
              navigation={navigation}
            ></Restaurant>
          )}
          keyExtractor={(item, index) => index.toString()}
        ></FlatList>
      )}
    </View>
  );
}
function Restaurant({ restaurant, navigation }) {
  const { id, name, images } = restaurant.item;
  return (
    <ListItem
      title={name}
      leftAvatar={{
        source: images[0]
          ? { uri: images[0] }
          : require("../../assets/img/no-image.png"),
      }}
      rightIcon={<Icon type="material-community" name="chevron-right"></Icon>}
      onPress={() =>
        navigation.navigate("restaurants", {
          screen: "restaurant",
          params: { id, name },
        })
      }
    ></ListItem>
  );
}

function NotFoundRestaurant() {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Image
        source={require("../../assets/img/no-result-found.png")}
        resizeMode="cover"
        style={{ width: 200, height: 200 }}
      ></Image>
    </View>
  );
}
const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 20,
  },
});
