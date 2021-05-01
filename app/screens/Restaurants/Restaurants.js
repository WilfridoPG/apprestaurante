import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import ListRestaurants from "../../components/Restaurants/ListRestaurants";
import { useFocusEffect } from "@react-navigation/native";

const db = firebase.firestore(firebaseApp);
firebase.firestore().settings({ experimentalForceLongPolling: true });
export default function Restaurants(props) {
  const { navigation } = props;
  const [user, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [startUsers, setStartUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const limitUsers = 10;

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      db.collection("user")
        .get()
        .then((snap) => {
          setTotalUsers(snap.size);
        });
      const resultRestaurant = [];
      db.collection("user")
        .orderBy("createAt", "desc")
        .limit(limitUsers)
        .get()
        .then((response) => {
          setStartUsers(response.docs[response.docs.length - 1]);
          response.forEach((doc) => {
            const user = doc.data();
            user.id = doc.id;
            resultRestaurant.push(user);
          });
          setUsers(resultRestaurant);
        });
    }, [])
  );

  const handleLoadMore = () => {
    const resultRestaurant = [];
    user.length < totalUsers && setLoading(true);
    db.collection("user")
      .orderBy("createAt", "desc")
      .startAfter(startUsers.data().createAt)
      .limit(limitUsers)
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          setStartUsers(response.docs[response.docs.length - 1]);
        } else {
          setLoading(false);
        }

        response.forEach((doc) => {
          const user = doc.data();
          user.id = doc.id;
          resultRestaurant.push(user);
        });
        setUsers([...user, ...resultRestaurant]);
      });
  };

  return (
    <View style={styles.viewBody}>
      <ListRestaurants
        user={user}
        handleLoadMore={handleLoadMore}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
