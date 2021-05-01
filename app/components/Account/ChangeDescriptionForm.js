import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import { size } from "lodash";
import { reauthenticate } from "../../utils/api";
import * as firebase from "firebase";
import { firebaseApp } from "../../utils/firebase";
const db = firebase.firestore(firebaseApp);
export default function ChangeDescriptionForm(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setformData] = useState(defualFormValue());
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const { setshowModal, description } = props;
  const onChange = (e, type) => {
    setformData({ ...formData, [type]: e.nativeEvent.text });
  };
  const onSubmit = async () => {
    let isError = true;
    let tempoError = {};
    setError({});
    if (!formData.description) {
      tempoError = {
        description: !formData.description ? "Agregue un description" : "",
      };
    } /*else if (size(formData.newPassword) < 6) {
      tempoError = {
        newPassword: "La contraseña debe de ser mayor a 6 carácteres",
        repeatNewPassword: "La contraseña debe de ser mayor a 6 carácteres",
      };
    } */ else {
      setLoading(true);
      var user = firebase.auth().currentUser;
      console.log(".....data", user);
      db.collection(`user`)
        .doc(user.uid)
        .update({ description: formData.description })
        .then(() => {
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
    isError && setError(tempoError);
  };
  return (
    <View style={styles.view}>
      <Input
        placeholder="Agrega una description y servicios que ofreces"
        containerStyle={styles.input}
        inputStyle={{ height: 150 }}
        multiline
        defaultValue={description || ""}
        onChange={(e) => onChange(e, "description")}
        errorMessage={error.description}
      />
      <Button
        title="Actualizar"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={loading}
      ></Button>
      <Text>{error.other}</Text>
    </View>
  );
}
function defualFormValue() {
  return {
    description: "",
  };
}
const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    marginBottom: 10,
    height: 150,
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "rgb(137,144,246)",
  },
});
