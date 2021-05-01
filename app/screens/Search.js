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
import { Image, Icon, Button } from "react-native-elements";
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
  const [userLogged, setUserLogged] = useState(false);
  const [loading, setLoading] = useState(false);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useFocusEffect(
    useCallback(() => {
      if (userLogged) {
        db.collection("mascotas")
          .get()
          .then((snap) => {
            setTotalMascotas(snap.size);
          });
        const resultRestaurant = [];
        db.collection("mascotas")
          .where("createBy", "==", firebase.auth().currentUser.uid)
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
      }
    }, [userLogged])
  );

  if (!userLogged) {
    return <UserNoLogged navigation={navigation}></UserNoLogged>;
  }
  return (
    <View style={{ flex: 1 }}>
      {size(mascotas) > 0 ? (
        <FlatList
          data={mascotas}
          renderItem={(restaurant) => (
            <Mascotas restaurant={restaurant} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.loaderMascotas}>
          {/* <ActivityIndicator size="large" color="#00a680" />*/}

          <Text>No hay mascotas registrado</Text>
        </View>
      )}

      {userLogged && (
        <Icon
          reverse
          type="material-community"
          name="plus"
          color="rgb(65,75,188)"
          containerStyle={styles.btnContainer}
          onPress={() => navigation.navigate("add-restaurant")}
        />
      )}
    </View>
  );
}
function UserNoLogged(props) {
  const { navigation } = props;
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Icon type="material-community" name="alert-outline" size={50}></Icon>
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        Necesitas estar logeado para ver esta sección
      </Text>
      <Button
        title="Ir al login"
        type="outline"
        containerStyle={{ marginTop: 20, width: "80%" }}
        onPress={() => navigation.navigate("account", { screen: "login" })}
      ></Button>
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
    alignItems: "center",
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
  btnContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
  },
});
