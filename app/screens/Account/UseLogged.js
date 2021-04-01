import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Button } from "react-native-elements";
import * as firebase from "firebase";
import Toast from "react-native-easy-toast";
import AccountOptions from "../../components/Account/AccountOptions";

import Loading from "../../components/Loading";
import InfoUser from "../../components/Account/InfoUser";

export default function UseLogged() {
  const [userInfo, setuserInfo] = useState(null);
  const [loading, setloading] = useState(false);
  const [loadingText, setloadingText] = useState("");
  const [realoadUserInfo, setrealoadUserInfo] = useState(false);
  const toastRef = useRef();
  useEffect(() => {
    (async () => {
      const user = firebase.auth().currentUser;

      setuserInfo(user);
    })();
    setrealoadUserInfo(false);
  }, [realoadUserInfo]);
  return (
    <View style={styles.viewUserInfo}>
      {userInfo && (
        <InfoUser
          toastRef={toastRef}
          userInfo={userInfo}
          setloading={setloading}
          setloadingText={setloadingText}
        />
      )}
      <AccountOptions
        userInfo={userInfo}
        toastRef={toastRef}
        setrealoadUserInfo={setrealoadUserInfo}
      />
      <Button
        title="Cerrar Sesión"
        buttonStyle={styles.btnCloseSesion}
        titleStyle={styles.btnCloseSesionText}
        onPress={() => firebase.auth().signOut()}
      />
      <Toast ref={toastRef} position="center" opacity={0.9}></Toast>
      <Loading isVisible={loading} text={loadingText} />
    </View>
  );
}

const styles = StyleSheet.create({
  viewUserInfo: {
    minHeight: "100%",
    backgroundColor: "#f2f2f2",
  },
  btnCloseSesion: {
    marginTop: 30,
    borderRadius: 0,
    backgroundColor: "#f2f2f2",
    borderTopWidth: 1,
    borderTopColor: "#e3e3e3",
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
    paddingTop: 10,
    paddingBottom: 10,
  },
  btnCloseSesionText: {
    color: "rgb(66,75,188)",
  },
});
