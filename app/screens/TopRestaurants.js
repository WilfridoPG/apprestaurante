import React, { useState, useEffect, useRef } from "react";
import { View, Text } from "react-native";
import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Toast from "react-native-easy-toast";
import LisTopRestaurants from "../components/Ranking/LisTopRestaurants";
const db = firebase.firestore(firebaseApp);
export default function TopRestaurants(props) {
  const { navigation } = props;
  const toastRef = useRef();
  const [restaurants, setrestaurants] = useState([]);

  useEffect(() => {
    db.collection("restaurants")
      .orderBy("rating", "desc")
      .limit(5)
      .get()
      .then((response) => {
        const restaurantArray = [];
        response.forEach((doc) => {
          const data = doc.data();
          data.id = doc.id;
          restaurantArray.push(data);
        });
        setrestaurants(restaurantArray);
      });
  }, []);
  return (
    <View>
      <LisTopRestaurants restaurants={restaurants} navigation={navigation} />
      <Toast ref={toastRef} position="center" opacity={0.9}></Toast>
    </View>
  );
}
