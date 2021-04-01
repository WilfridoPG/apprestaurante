import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Loading from "../components/Loading";
import Toast from "react-native-easy-toast";

const db = firebase.firestore(firebaseApp);
export default function Favorites(props) {
  const [restaurante, setRestaurante] = useState(null);
  const [userLogged, setUserLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const { navigation } = props;
  const refToast = useRef();
  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });
  useFocusEffect(
    useCallback(() => {
      if (userLogged) {
        const idUser = firebase.auth().currentUser.uid;
        db.collection("favorites")
          .where("idUser", "==", idUser)
          .get()
          .then((response) => {
            const idRestaurantsArray = [];
            response.forEach((doc) => {
              idRestaurantsArray.push(doc.data().idRestaurant);
            });
            getDataRestaurant(idRestaurantsArray).then((response) => {
              const restaurants = [];
              response.forEach((doc) => {
                const restaurant = doc.data();
                restaurant.id = doc.id;
                restaurants.push(restaurant);
              });
              setRestaurante(restaurants);
            });
          });
      }
      setReloadData(false);
    }, [userLogged, reloadData])
  );

  const getDataRestaurant = (idRestaurantsArray) => {
    const arrayRestaurant = [];
    idRestaurantsArray.forEach((idRestaurant) => {
      const result = db.collection("restaurants").doc(idRestaurant).get();
      arrayRestaurant.push(result);
    });
    return Promise.all(arrayRestaurant);
  };
  if (!userLogged) {
    return <UserNoLogged navigation={navigation}></UserNoLogged>;
  }
  if (restaurante?.length === 0) {
    return <NotFoundRestaurants></NotFoundRestaurants>;
  }
  return (
    <View style={styles.viewBody}>
      {restaurante ? (
        <FlatList
          data={restaurante}
          renderItem={(restaurant) => (
            <Restaurant
              restaurant={restaurant}
              setIsLoading={setIsLoading}
              refToast={refToast}
              setReloadData={setReloadData}
              navigation={navigation}
            ></Restaurant>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.loaderRestaurants}>
          <ActivityIndicator size="large" />
          <Text style={{ textAlign: "center" }}>Cargando restaurante</Text>
        </View>
      )}
      <Toast ref={refToast} position="center" opacity={0.9}></Toast>
      <Loading text="Eliminado restaurante" isVisible={isLoading}></Loading>
    </View>
  );
}
function Restaurant({
  restaurant,
  refToast,
  setIsLoading,
  setReloadData,
  navigation,
}) {
  const { id, name, images } = restaurant.item;
  const confirmRemoveFavorite = () => {
    Alert.alert(
      "Eliminar restaurante de favoritos",
      "¿Estás seguro de eliminar?",
      [
        { text: "Cancelar", style: "cancelar" },
        { text: "Eliminar", onPress: removeFavorite },
      ],
      { cancelable: false }
    );
  };
  const removeFavorite = () => {
    setIsLoading(true);
    db.collection("favorites")
      .where("idRestaurant", "==", id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsLoading(false);
              setReloadData(true);
              refToast.current.show("Restaurante eliminado correctamente");
            })
            .catch(() => {
              refToast.current.show("Error al eliminar correctamente");
            });
        });
      });
    console.log("remove");
  };
  return (
    <View style={styles.restaurant}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("restaurant", {
            screen: "restaurants",
            id: id /*params:{id:id} */,
          })
        }
      >
        <Image
          resizeMode="cover"
          style={styles.image}
          PlaceholderContent={<ActivityIndicator color="#fff" />}
          source={
            images[0]
              ? { uri: images[0] }
              : require("../../assets/img/no-image.png")
          }
        />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Icon
            type="material-community"
            name="heart"
            color="#f00"
            containerStyle={styles.favorite}
            onPress={confirmRemoveFavorite}
            underlayColor="transparent"
          ></Icon>
        </View>
      </TouchableOpacity>
    </View>
  );
}
function NotFoundRestaurants() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        No tienes restaurantes en tu lista
      </Text>
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
        containerStyle={{ marginTop: 20, width: "80%" }}
        buttonStyle={{ backgroundColor: "rgb(137,144,246)" }}
        onPress={() => navigation.navigate("account", { screen: "login" })}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  loaderRestaurants: {
    marginTop: 10,
    marginBottom: 10,
  },
  restaurant: {
    margin: 10,
  },
  image: {
    width: "100%",
    height: 180,
  },
  info: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: -30,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
  },
  favorite: {
    marginTop: -35,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 100,
  },
});
