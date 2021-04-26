import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { Button, Avatar, Badge, Icon, ListItem } from "react-native-elements";
import * as firebase from "firebase";
import uuid from "random-uuid-v4";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import Toast from "react-native-easy-toast";
import AccountOptions from "../../components/Account/AccountOptions";
import Loading from "../../components/Loading";
import InfoUser from "../../components/Account/InfoUser";
import Mapa from "../../components/Mapa";
import { map, size, filter } from "lodash";
import { firebaseApp } from "../../utils/firebase";
import Modal from "../../components/Modal";
import ModalContainer from "../../components/ModalContainer";
import MapView from "react-native-maps";
import Photos from "./Photos";
const db = firebase.firestore(firebaseApp);

export default function UseLogged() {
  const [userInfo, setuserInfo] = useState(null);
  const [loading, setloading] = useState(false);
  const [loadingText, setloadingText] = useState("");
  const [realoadUserInfo, setrealoadUserInfo] = useState(false);
  const [dataUser, setDataUser] = useState(null);
  const [isVisibleMap, setisVisibleMap] = useState(false);
  const [isVisibleModal, setisVisibleModal] = useState(false);
  const [position, setposition] = useState([]);
  const [addres, setAddres] = useState([]);
  const [imagesSelected, setImagesSelected] = useState([]);
  const toastRef = useRef();

  useEffect(() => {
    (async () => {
      const user = firebase.auth().currentUser;
      db.collection("user")
        .doc(user.uid)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            console.log("Document data:66666666666666", doc.data());
            console.log(
              "Document data:66666666666666222222",
              doc.data().images
            );
            let diaDisponible = doc.data().diaDisponible;
            setDataUser(doc.data());
            setImagesSelected(doc.data().images);
            setAddres(doc.data().addres);
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
    console.log("--************-", dataUser.diaDisponible);
    let nuevoDay = [];
    //  console.log("::::", dataUser);
    if (dataUser.diaDisponible.includes(day)) {
      nuevoDay = dataUser.diaDisponible.filter((d) => d !== day);
      setDataUser({ ...dataUser, diaDisponible: nuevoDay });
    } else {
      setDataUser({
        ...dataUser,
        diaDisponible: [...dataUser.diaDisponible, day],
      });
    }
  };
  //remover ubicacion
  const removeUbicacion = (index) => {
    const arraUbicacion = addres.filter((ad, i) => i !== index);
    setAddres(arraUbicacion);
  };
  //open modal map
  const openModalMap = (position) => {
    setisVisibleModal(true);
    setposition(position);
  };
  //guardar configuracino
  const guardarConfig = () => {
    console.log("DATOS SE ENVIIO", dataUser);

    uploadImageStorage().then((response) => {
      db.collection("user")
        .doc(userInfo.uid)
        .update({
          addres: addres,
          diaDisponible: dataUser.diaDisponible,
          images: response,
        })
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });

      /*  db.collection("restaurants")
        .add({
          name: restauranteName,
          addrees: restaurantAddress,
          description: restaurantDescription,
          location: locationRestaurant,
          images: response,
          rating: 0,
          ratingTotal: 0,
          quantityVoting: 0,
          createAt: new Date(),
          createBy: firebase.auth().currentUser.uid,
        })
        .then(() => {
          setisLoading(false);
          navigation.navigate("restaurants");
        })
        .catch(() => {
          setisLoading(false);
          toastRef.current.show(
            "Error al subir el restaurante, intentelo más tarde"
          );
        });*/
    });
  };
  //
  const uploadImageStorage = async () => {
    // Delete the file

    const imageBlob = [];
    await Promise.all(
      map(imagesSelected, async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = firebase
          .storage()
          .ref(`user/${userInfo.uid}`)
          .child(uuid());
        await ref.put(blob).then(async (result) => {
          await firebase
            .storage()
            .ref(`user/${userInfo.uid}/${result.metadata.name}`)
            .getDownloadURL()
            .then((photoUrl) => {
              //console.log("url", photoUrl);
              imageBlob.push(photoUrl);
            });
          //console.log("result", result);
        });
        //console.log(JSON.stringify(response));
      })
    );

    return imageBlob;
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
            onPress={() =>
              addres.length == 5
                ? toastRef.current.show("No se puede agregar mas de 5 lugares")
                : setisVisibleMap(true)
            }
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
          {addres
            ? addres.map((data, index) => {
                console.log("-->çççççççççççç", data.position);
                return (
                  <ListItem
                    key={index}
                    title={`${data.ubicacion.city}, ${data.ubicacion.district}, calle:${data.ubicacion.street}, cp:${data.ubicacion.postalCode}`}
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
                    onPress={() => openModalMap(data.position)}
                  />
                );
              })
            : null}
        </View>
        <View style={{ marginLeft: 20, marginTop: 20 }}>
          <Text>Fotos </Text>
          <UpladImage
            toastRef={toastRef}
            imagesSelected={imagesSelected}
            setImagesSelected={setImagesSelected}
          />
          <Photos
            imagesSelected={imagesSelected}
            setImagesSelected={setImagesSelected}
          />
        </View>

        <Button
          title="Guardar configuración"
          buttonStyle={styles.btnCloseSesion}
          titleStyle={styles.btnCloseSesionText}
          onPress={() => guardarConfig()}
        />

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
          userInfo={userInfo}
          setisVisibleMap={setisVisibleMap}
          setAddres={setAddres}
          addres={addres}
          toastRef={toastRef}
        />
        <ModalContainer isVisibleModal={isVisibleModal}>
          <Text>Ubicación del lugar:</Text>
          <Mapa height={200} location={position} name="data" />

          <Button
            title="Cerrar"
            type="outline"
            onPress={() => setisVisibleModal(false)}
            buttonStyle={{
              borderColor: "rgb(137,144,246)",
              marginTop: 10,
              marginBottom: 10,
            }}
            titleStyle={{ color: "rgb(137,144,246)" }}
          />
        </ModalContainer>
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
    toastRef,
    userInfo,
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
    console.log("----localizacion::", addres);

    if (address) {
      setAddres([...addres, { position: location, ubicacion: address[0] }]);

      toastRef.current.show("Localizacion guardada correctamente");
    } else {
      toastRef.current.show("No se puede guardar mas de 5 lugares");
    }

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

function UpladImage({ toastRef, setImagesSelected, imagesSelected }) {
  const imageSelect = async () => {
    const resultPermissions = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (resultPermissions == "denied") {
      toastRef.current.show(
        "Es necesario activar los permisos para acceder a la galería",
        3000
      );
    } else {
      //lanzamos la galeria
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (result.cancelled) {
        toastRef.current.show(
          "Has cerrado la galeria sin seleccionar ninguna imagen",
          2000
        );
      } else {
        //agregamos varios imagenes
        setImagesSelected([...imagesSelected, result.uri]);
      }
    }
  };
  const removeImage = (image) => {
    Alert.alert(
      "Eliminar imagen",
      "Estas seguro de eliminar la imagen",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            setImagesSelected(
              filter(imagesSelected, (imageUrl) => imageUrl !== image)
            );
          },
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  return (
    <View style={styles.viewImage}>
      {size(imagesSelected) < 4 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}

      {map(imagesSelected, (imagesRestarante, index) => (
        <Avatar
          key={index}
          style={styles.miniatureStyles}
          source={{ uri: imagesRestarante }}
          onPress={() => removeImage(imagesRestarante)}
        />
      ))}
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
