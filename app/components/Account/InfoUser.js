import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Avatar } from "react-native-elements";
import * as firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-easy-toast";
export default function InfoUser(props) {
  const {
    userInfo: { photoURL, uid, displayName, email },
    toastRef,
    setloading,
    setloadingText,
  } = props;

  const changeAvatar = async () => {
    console.log("chang3e avatar");
    const resultPermision = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    console.log("data..", resultPermision);
    const resultPermisionCamera = resultPermision.permissions.cameraRoll.status;
    if (resultPermisionCamera === "denied") {
      toastRef.current.show("Es necesario aceptar los permiso de la galería");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [3, 4],
      });
      console.log(result);
      if (result.cancelled) {
        toastRef.current.show("Ha cerrado la selección de la imágen");
      } else {
        uploadImagen(result.uri)
          .then(() => updatePhotoUrl())
          .catch(() => {
            toastRef.current.show("Error al actualizar el Avatar.");
          });
      }
    }
    console.log(resultPermision);
  };

  const uploadImagen = async (uri) => {
    setloading(true);
    setloadingText("Actualizando Avatart");
    const response = await fetch(uri);
    const blod = await response.blob();
    const ref = firebase.storage().ref().child(`avatar/${uid}`);
    return ref.put(blod);
  };
  const updatePhotoUrl = () => {
    firebase
      .storage()
      .ref(`avatar/${uid}`)
      .getDownloadURL()
      .then(async (response) => {
        const update = {
          photoURL: response,
        };
        await firebase.auth().currentUser.updateProfile(update);
        setloading(false);
      })
      .catch(() => toastRef.current.show("Error al actualizar el Avatar."));
  };

  return (
    <View style={styles.viewUserInfo}>
      <Avatar
        rounded
        size="large"
        showEditButton
        onEditPress={changeAvatar}
        containerStyle={styles.UserInfoAvatar}
        source={
          photoURL
            ? { uri: photoURL }
            : require("../../../assets/img/avatar-default.jpg")
        }
      />
      <View>
        <Text style={styles.displayName}>
          {displayName ? displayName : "Anonimo"}
        </Text>
        <Text>{email ? email : "Social Login"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewUserInfo: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingTop: 30,
    paddingBottom: 30,
  },
  UserInfoAvatar: {
    marginRight: 20,
  },
  displayName: {
    fontWeight: "bold",
    paddingBottom: 5,
  },
});
