import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  ScrollView,
  Dimensions,
} from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { map, size, filter } from "lodash";
import Modal from "../Modal";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get("window").width;
export default function AddRestaurantForm(props) {
  const { toastRef, setisLoading, navigation } = props;
  const [restauranteName, setrestauranteName] = useState("");
  const [restaurantAddress, setrestaurantAddress] = useState("");
  const [restaurantDescription, setrestaurantDescription] = useState("");
  const [imagesSelected, setImagesSelected] = useState([]);
  const [isVisibleMap, setisVisibleMap] = useState(false);
  const [locationRestaurant, setLocationRestaurant] = useState(null);

  const addRestaurant = () => {
    if (!restauranteName || !restaurantAddress || !restaurantDescription) {
      toastRef.current.show("Todos los campos del formulario son obligatorios");
    } else if (size(imagesSelected) === 0) {
      toastRef.current.show("El restaurante tiene que tener almenos una foto");
    } else if (!locationRestaurant) {
      toastRef.current.show("Tienes que localizar el restaurante en el mapa");
    } else {
      setisLoading(true);
      uploadImageStorage().then((response) => {
        db.collection("restaurants")
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
          });
      });
    }
  };

  const uploadImageStorage = async () => {
    const imageBlob = [];
    await Promise.all(
      map(imagesSelected, async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = firebase.storage().ref("restaurants").child(uuid());
        await ref.put(blob).then(async (result) => {
          await firebase
            .storage()
            .ref(`restaurants/${result.metadata.name}`)
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
    <ScrollView style={styles.scrollView}>
      <ImageRestaurant imagenRestaurant={imagesSelected[0]} />
      <FormAdd
        locationRestaurant={locationRestaurant}
        setrestauranteName={setrestauranteName}
        setrestaurantAddress={setrestaurantAddress}
        setrestaurantDescription={setrestaurantDescription}
        setisVisibleMap={setisVisibleMap}
      />
      <UpladImage
        toastRef={toastRef}
        imagesSelected={imagesSelected}
        setImagesSelected={setImagesSelected}
      />
      <Button
        title="Crear Restaurante"
        onPress={addRestaurant}
        buttonStyle={styles.btnAddRestaurant}
      />
      <Map
        isVisibleMap={isVisibleMap}
        setisVisibleMap={setisVisibleMap}
        setLocationRestaurant={setLocationRestaurant}
        toastRef={toastRef}
      />
    </ScrollView>
  );
}
function ImageRestaurant(props) {
  const { imagenRestaurant } = props;
  return (
    <View style={styles.viewPhoto}>
      <Image
        source={
          imagenRestaurant
            ? { uri: imagenRestaurant }
            : require("../../../assets/img/no-image.png")
        }
        style={{ width: widthScreen, height: 200 }}
      />
    </View>
  );
}
function FormAdd(props) {
  const {
    setrestauranteName,
    setrestaurantAddress,
    setrestaurantDescription,
    setisVisibleMap,
    locationRestaurant,
  } = props;

  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Nobre del restaurante"
        containerStyle={styles.input}
        onChange={(e) => setrestauranteName(e.nativeEvent.text)}
      />
      <Input
        placeholder="Direccion"
        containerStyle={styles.input}
        onChange={(e) => setrestaurantAddress(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: locationRestaurant ? "#00a680" : "#c2c2c2",
          onPress: () => setisVisibleMap(true),
        }}
      />
      <Input
        placeholder="Descripcion del restaurante"
        containerStyle={styles.input}
        multiline={true}
        inputStyle={styles.textArea}
        onChange={(e) => setrestaurantDescription(e.nativeEvent.text)}
      />
    </View>
  );
}

function Map(props) {
  const {
    isVisibleMap,
    setisVisibleMap,
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
        const address = await Location.reverseGeocodeAsync(loc.coords);
        console.log("----localizacion::", address);
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    })();
  }, []);

  const confirmarLocation = () => {
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
            onRegionChange={(region) => setLocation(region)}
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
      {size(imagesSelected) < 5 && (
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
  scrollView: {
    height: "100%",
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnAddRestaurant: {
    backgroundColor: "rgb(137,144,246)",
    margin: 20,
  },
  viewImage: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
  },
  miniatureStyles: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
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
