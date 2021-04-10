import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  useWindowDimensions,
} from "react-native";
import { Button, Badge } from "react-native-elements";
import * as firebase from "firebase";
import Toast from "react-native-easy-toast";
import AccountOptions from "../../components/Account/AccountOptions";

import Loading from "../../components/Loading";
import InfoUser from "../../components/Account/InfoUser";

import { TabView, SceneMap } from "react-native-tab-view";

const FirstRoute = () => <View style={{ flex: 1, backgroundColor: "white" }} />;

const SecondRoute = () => (
  <View style={{ flex: 1, backgroundColor: "white" }} />
);

export default function UseLogged() {
  const [userInfo, setuserInfo] = useState(null);
  const [loading, setloading] = useState(false);
  const [loadingText, setloadingText] = useState("");
  const [realoadUserInfo, setrealoadUserInfo] = useState(false);
  const [dayActive, setDayActive] = useState([]);
  const toastRef = useRef();

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Ubicacion" },
    { key: "second", title: "Fotos" },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  useEffect(() => {
    (async () => {
      const user = firebase.auth().currentUser;

      setuserInfo(user);
    })();
    setrealoadUserInfo(false);
  }, [realoadUserInfo]);

  //guarda los dias activo
  const diaActivate = (day) => {
    console.log("---", day);

    setDayActive({ ...dayActive, day });

    console.log("....dfgsdfgsdfgsdf...", dayActive);
  };

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
      <Text>Dias de disponibilidad</Text>
      <View style={{ flexDirection: "row" }}>
        {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((dia) => (
          <Badge
            onPress={() => diaActivate(dia)}
            badgeStyle={styles.badgeView}
            value={dia}
          />
        ))}
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
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
  badgeView: {
    marginTop: 20,
    backgroundColor: "gray",
    width: 35,
    height: 35,
    marginBottom: 10,
    borderRadius: 50,
  },
});
