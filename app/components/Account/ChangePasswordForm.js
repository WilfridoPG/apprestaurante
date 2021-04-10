import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import { size } from "lodash";
import { reauthenticate } from "../../utils/api";
import * as firebase from "firebase";

export default function ChangePasswordForm(props) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setformData] = useState(defualFormValue());
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const { setshowModal } = props;
  const onChange = (e, type) => {
    setformData({ ...formData, [type]: e.nativeEvent.text });
  };
  const onSubmit = async () => {
    let isError = true;
    let tempoError = {};
    setError({});
    if (
      !formData.password ||
      !formData.newPassword ||
      !formData.repeatNewPassword
    ) {
      tempoError = {
        password: !formData.password
          ? "La contraseña no puede estar vacío."
          : "",
        newPassword: !formData.newPassword
          ? "La contraseña no puede estar vacío."
          : "",
        repeatNewPassword: !formData.repeatNewPassword
          ? "La contraseña no puede estar vacío."
          : "",
      };
    } else if (formData.newPassword !== formData.repeatNewPassword) {
      tempoError = {
        newPassword: "La contraseña no son iguales",
        repeatNewPassword: "La contraseña no son iguales",
      };
    } else if (size(formData.newPassword) < 6) {
      tempoError = {
        newPassword: "La contraseña debe de ser mayor a 6 carácteres",
        repeatNewPassword: "La contraseña debe de ser mayor a 6 carácteres",
      };
    } else {
      setLoading(true);
      await reauthenticate(formData.password)
        .then(async () => {
          await firebase
            .auth()
            .currentUser.updatePassword(formData.newPassword)
            .then(() => {
              isError = false;
              setLoading(false);
              setshowModal(false);
              firebase.auth().signOut();
            })
            .catch(() => {
              tempoError = {
                other: "Error al actualizar la contraseña",
              };
              setLoading(false);
            });
        })
        .catch(() => {
          tempoError = {
            password: "La contraseña no es correcta",
          };
          setLoading(false);
        });
    }
    isError && setError(tempoError);
  };
  return (
    <View style={styles.view}>
      <Input
        placeholder="Contraseña Actual"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={showPassword ? true : false}
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => setShowPassword(!showPassword),
        }}
        onChange={(e) => onChange(e, "password")}
        errorMessage={error.password}
      />
      <Input
        placeholder="Nueva Contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={showPassword ? true : false}
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => setShowPassword(!showPassword),
        }}
        onChange={(e) => onChange(e, "newPassword")}
        errorMessage={error.newPassword}
      />
      <Input
        placeholder="Repetir Nueva Contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={showPassword ? true : false}
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => setShowPassword(!showPassword),
        }}
        onChange={(e) => onChange(e, "repeatNewPassword")}
        errorMessage={error.repeatNewPassword}
      />
      <Button
        title="Cambiar Contraseña"
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
    password: "",
    newPassword: "",
    repeatNewPassword: "",
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
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "rgb(137,144,246)",
  },
});
