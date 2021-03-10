import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import { validateEmail } from "../../utils/validation";
import { reauthenticate } from "../../utils/api";
import * as firebase from "firebase";

export default function ChangeEmailForm(props) {
  const { email, setrealoadUserInfo, setshowModal, toastRef } = props;
  const [formData, setFormData] = useState(defualFormValue());
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const onChange = (e, type) => {
    console.log("--->", type, e.nativeEvent.text);
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };
  const onSubmit = () => {
    setError({});
    if (!formData.email || email === formData.email) {
      setError({ email: "Email no ha cambiado" });
    } else if (!validateEmail(formData.email)) {
      setError({ email: "Email Incorrecto" });
    } else if (!formData.password) {
      setError({ password: "La contraseña no puede estar vacío." });
    } else {
      setLoading(true);
      reauthenticate(formData.password)
        .then((response) => {
          console.log(response);
          firebase
            .auth()
            .currentUser.updateEmail(formData.email)
            .then(() => {
              setLoading(false);
              setrealoadUserInfo(true);
              toastRef.current.show("Email actualizado correctamente");
              setshowModal(false);
            })
            .catch(() => {
              setError({ email: "Error al actualizar email" });
              setLoading(false);
            });
        })
        .catch(() => {
          setError({ password: "La contraseña no es correcta." });
          setLoading(false);
        });
      console.log("ok");
    }

    console.log("formulario enviado");
  };
  return (
    <View style={styles.View}>
      <Input
        placeholder="Correo Electronico"
        containerStyle={styles.input}
        defaultValue={email || ""}
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#c2c2c2",
        }}
        onChange={(e) => onChange(e, "email")}
        errorMessage={error.email}
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.input}
        defaultValue=""
        password={true}
        secureTextEntry={showPassword ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => setShowPassword(!showPassword),
        }}
        onChange={(e) => onChange(e, "password")}
        errorMessage={error.password}
      />
      <Button
        title="Cambiar Email"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={loading}
      />
    </View>
  );
}
function defualFormValue() {
  return {
    email: "",
    password: "",
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
    backgroundColor: "#00a680",
  },
});
