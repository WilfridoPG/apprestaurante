import React, { useState, useEffect, useCallback } from "react";
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
import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

import { useFocusEffect } from "@react-navigation/native";
const db = firebase.firestore(firebaseApp);
firebase.firestore().settings({ experimentalForceLongPolling: true });

export default function Search(props) {
  const [user, setUser] = useState(null);
  const { navigation } = props;
  const [mascotas, setMascotas] = useState([]);
  const [totalMascotas, setTotalMascotas] = useState(0);
  const [startMascotas, setStartMascotas] = useState(null);
  const [loading, setLoading] = useState(false);
  const limitMascotas = 10;

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      db.collection("mascotas")
        .get()
        .then((snap) => {
          setTotalMascotas(snap.size);
        });
      const resultRestaurant = [];
      db.collection("mascotas")
        .orderBy("createAt", "desc")
        .limit(limitMascotas)
        .get()
        .then((response) => {
          setStartMascotas(response.docs[response.docs.length - 1]);
          response.forEach((doc) => {
            const restaurant = doc.data();
            restaurant.id = doc.id;
            resultRestaurant.push(restaurant);
          });
          setMascotas(resultRestaurant);
        });
    }, [])
  );

  const handleLoadMore = () => {
    const resultRestaurant = [];
    mascotas.length < totalMascotas && setLoading(true);
    db.collection("mascotas")
      .orderBy("createAt", "desc")
      .startAfter(startMascotas.data().createAt)
      .limit(limitMascotas)
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          setStartMascotas(response.docs[response.docs.length - 1]);
        } else {
          setLoading(false);
        }

        response.forEach((doc) => {
          const restaurant = doc.data();
          restaurant.id = doc.id;
          resultRestaurant.push(restaurant);
        });
        setMascotas([...mascotas, ...resultRestaurant]);
      });
  };

  return (
    <View>
      {size(mascotas) > 0 ? (
        <FlatList
          data={mascotas}
          renderItem={(restaurant) => (
            <Mascotas restaurant={restaurant} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          ListFooterComponent={<FooterList loading={loading} />}
        />
      ) : (
        <View style={styles.loaderMascotas}>
          <ActivityIndicator size="large" color="#00a680" />
          <Text>Cargando mascotas</Text>
        </View>
      )}
    </View>
  );
}
function Mascotas(props) {
  const { restaurant, navigation } = props;
  const { id, images, name, description, addrees } = restaurant.item;
  //pasar valores por navigation
  const goMascotas = () => {
    navigation.navigate("restaurant", { id, name });
  };
  return (
    <TouchableOpacity onPress={goMascotas}>
      <View style={styles.viewRestaurant}>
        <View style={styles.viewRestaurantImage}>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="#fff" />}
            source={
              images[0]
                ? { uri: images[0] }
                : require("../../assets/img/no-image.png")
            }
            style={styles.imageMascotas}
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
      <View style={styles.loaderMascotas}>
        <ActivityIndicator size="large" color="#00a680" />
      </View>
    );
  else
    return (
      <View style={styles.notFoundMascotas}>
        <Text> No queda restaurantes por cargar</Text>
      </View>
    );
}
const styles = StyleSheet.create({
  loaderMascotas: {
    marginTop: 10,
    marginBottom: 10,
  },
  viewRestaurant: {
    backgroundColor: "rgb(204, 228, 250)",

    borderRadius: 10,
    flexDirection: "row",
    margin: 10,
  },
  viewRestaurantImage: {
    marginRight: 15,
  },
  imageMascotas: {
    width: 100,
    height: 100,
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
  notFoundMascotas: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
});
