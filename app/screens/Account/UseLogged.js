import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { Button, Badge, Icon, ListItem } from "react-native-elements";
import * as firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import Toast from "react-native-easy-toast";
import AccountOptions from "../../components/Account/AccountOptions";
import Loading from "../../components/Loading";
import InfoUser from "../../components/Account/InfoUser";

import { firebaseApp } from "../../utils/firebase";
import Modal from "../../components/Modal";
import MapView from "react-native-maps";

const db = firebase.firestore(firebaseApp);

export default function UseLogged() {
  const [userInfo, setuserInfo] = useState(null);
  const [loading, setloading] = useState(false);
  const [loadingText, setloadingText] = useState("");
  const [realoadUserInfo, setrealoadUserInfo] = useState(false);
  const [dataUser, setDataUser] = useState(null);
  const [isVisibleMap, setisVisibleMap] = useState(false);
  const [locationRestaurant, setLocationRestaurant] = useState(null);
  const [addres, setAddres] = useState([]);
  const toastRef = useRef();

  useEffect(() => {
    (async () => {
      const user = firebase.auth().currentUser;
      db.collection("user")
        .doc(user.uid)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            let diaDisponible = doc.data().diaDisponible;
            setDataUser(doc.data());
          } else {
            console.log("No such document!");
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });

      setuserInfo(user);
    })();
    setrealoadUserInfo(false);
  }, [realoadUserInfo]);

  //guarda los dias activo
  const diaActivate = (day) => {
    // console.log("---", day);
    let nuevoDay = [];
    console.log("::::", dataUser);
    if (dataUser.diaDisponible.includes(day)) {
      nuevoDay = dataUser.diaDisponible.filter((d) => d !== day);
      setDataUser({ ...dataUser, diaDisponible: nuevoDay });
    } else {
      setDataUser({
        ...dataUser,
        diaDisponible: [...dataUser.diaDisponible, day],
      });
      nuevoDay = [...dataUser.diaDisponible, day];
    }
    console.log("refferencia11", userInfo.uid);
    db.collection("user")
      .doc(userInfo.uid)
      .update({
        diaDisponible: nuevoDay,
      })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };
  //remover ubicacion
  const removeUbicacion = (index) => {
    const arraUbicacion = addres.filter((ad, i) => i !== index);
    setAddres(arraUbicacion);
  };

  return (
    <ScrollView>
      <View style={styles.viewUserInfo}>
        {userInfo && (
          <InfoUser
            toastRef={toastRef}
            userInfo={userInfo}
            dataUser={dataUser}
            setloading={setloading}
            setloadingText={setloadingText}
          />
        )}

        <AccountOptions
          userInfo={userInfo}
          toastRef={toastRef}
          setrealoadUserInfo={setrealoadUserInfo}
        />
        <Text style={{ marginLeft: 20, fontSize: 17, marginTop: 10 }}>
          Días de la semana de disponibilidad
        </Text>
        <View style={{ flexDirection: "row", marginLeft: 15 }}>
          {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((dia) =>
            dataUser ? (
              <Badge
                onPress={() => diaActivate(dia)}
                badgeStyle={
                  dataUser.diaDisponible.includes(dia)
                    ? styles.badgeViewActive
                    : styles.badgeViewInactive
                }
                value={dia}
              />
            ) : null
          )}
        </View>
        <Text style={{ marginLeft: 20, fontSize: 17, marginTop: 10 }}>
          Mis lugares para paseo
        </Text>
        <View style={{ alignItems: "center" }}>
          <Button
            title="Agregar sitio"
            type="outline"
            onPress={() => setisVisibleMap(true)}
            buttonStyle={{
              borderColor: "rgb(137,144,246)",
              marginTop: 10,
              marginBottom: 10,
            }}
            titleStyle={{ color: "rgb(137,144,246)" }}
            icon={
              <Icon
                type="material-community"
                name="map-marker-plus"
                size={25}
                color="rgb(137,144,246)"
              />
            }
          />
          {addres.map((ubicacion, index) => (
            <ListItem
              key={index}
              title={`${ubicacion[0].city}, ${ubicacion[0].district}, CP: ${ubicacion[0].postalCode} `}
              leftIcon={{
                type: "material-community",
                name: "map-marker-radius",
                color: "gray",
              }}
              rightIcon={{
                type: "material-community",
                name: "close-circle-outline",
                color: "gray",
                onPress: () => removeUbicacion(index),
              }}
              containerStyle={{ width: "100%" }}
            />
          ))}
        </View>

        <Button
          title="Cerrar Sesión"
          buttonStyle={styles.btnCloseSesion}
          titleStyle={styles.btnCloseSesionText}
          onPress={() => firebase.auth().signOut()}
        />
        <Toast ref={toastRef} position="center" opacity={0.9}></Toast>
        <Loading isVisible={loading} text={loadingText} />
        <Map
          isVisibleMap={isVisibleMap}
          setisVisibleMap={setisVisibleMap}
          setAddres={setAddres}
          addres={addres}
          setLocationRestaurant={setLocationRestaurant}
          toastRef={toastRef}
        />
      </View>
    </ScrollView>
  );
}
function Map(props) {
  const {
    isVisibleMap,
    setAddres,
    setisVisibleMap,
    addres,
    setLocationRestaurant,
    toastRef,
  } = props;
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const resultPermissions = await Permissions.askAsync(
        Permissions.LOCATION
      );

      const statusPermisions = resultPermissions.permissions.location.status;
      if (statusPermisions !== "granted") {
        toastRef.current.show(
          "Tienes que aceptar los permisos de localización para crear un restaurante",
          3000
        );
      } else {
        const loc = await Location.getCurrentPositionAsync({});

        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    })();
  }, []);

  const confirmarLocation = async () => {
    const address = await Location.reverseGeocodeAsync(location);
    setAddres([...addres, address]);
    //console.log("----localizacion::", address);
    setLocationRestaurant(location);
    toastRef.current.show("Localizacion guardada correctamente");
    setisVisibleMap(false);
  };
  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setisVisibleMap}>
      <View>
        {location && (
          <MapView
            style={styles.mapStyles}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={(region) => {
              return setLocation(region);
            }}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              draggable
            />
          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button
            title="Guardar Ubicación"
            containerStyle={styles.viewMapBtnContaunerSave}
            buttonStyle={styles.viewMapBtnSave}
            onPress={() => confirmarLocation()}
          />
          <Button
            title="Cancelar Ubicación"
            containerStyle={styles.viewMapBtnContaunerCancel}
            buttonStyle={styles.viewMapBtnCancel}
            onPress={() => setisVisibleMap(false)}
          />
        </View>
      </View>
    </Modal>
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
  badgeViewActive: {
    marginTop: 10,
    backgroundColor: "rgb(66,75,188)",
    width: 35,
    height: 35,
    marginLeft: 5,
    marginBottom: 10,
    borderRadius: 50,
  },
  badgeViewInactive: {
    marginTop: 10,
    backgroundColor: "gray",
    width: 35,
    marginLeft: 5,
    height: 35,
    marginBottom: 10,
    borderRadius: 50,
  },
  agregarLugares: {
    marginTop: 30,
    borderRadius: 0,
    backgroundColor: "#f2f2f2",
    borderTopColor: "#e3e3e3",
    borderBottomColor: "#e3e3e3",
    paddingTop: 10,
    paddingBottom: 10,
  },
  btnLugares: {
    borderTopWidth: 0,
    backgroundColor: "#f2f2f2",
    color: "rgb(137,144,246)",
  },
  mapStyles: {
    width: "100%",
    height: 550,
  },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  viewMapBtnContaunerCancel: {
    paddingLeft: 5,
  },
  viewMapBtnCancel: {
    backgroundColor: "#a60d0d",
  },
  viewMapBtnContaunerSave: {
    paddingRight: 5,
  },
  viewMapBtnSave: {
    backgroundColor: "#00a680",
  },
});
