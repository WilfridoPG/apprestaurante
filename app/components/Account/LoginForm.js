import { firestore } from "firebase";
import { isEmpty } from "lodash";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../../utils/validation";
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/native";
import Loading from "../Loading";

export default function LoginForm({ toasRef }) {
  const [showPassword, setshowPassword] = useState(false);
  const [formData, setformData] = useState(defaultFormValue());
  const [loading, setloading] = useState(false);

  const navigation = useNavigation();
  const onChange = (e, type) => {
    setformData({ ...formData, [type]: e.nativeEvent.text });
  };

  const onSubmit = () => {
    if (isEmpty(formData.email) || isEmpty(formData.password)) {
      toasRef.current.show("Todos los campos son obligatorios");
    } else if (!validateEmail(formData.email)) {
      toasRef.current.show("El email no es correcto");
    } else {
      // setloading(true);

      firebase
        .auth()
        .signInWithEmailAndPassword(formData.email, formData.password)
        .then((snashop) => {
          console.log("datos---", snashop.user.emailVerified);
          if (snashop.user.emailVerified) {
            setloading(false);
            navigation.navigate("account");
          } else {
            toasRef.current.show("Verifica tu correo electronico");
            setloading(false);
          }
        })
        .catch(() => {
          setloading(false);
          toasRef.current.show("Email o contraseña incorrecta");
        });
    }
  };
  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Correo Electrónico"
        containerStyle={styles.InputForm}
        onChange={(e) => onChange(e, "email")}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={styles.IconRight}
          />
        }
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.InputForm}
        password={true}
        secureTextEntry={showPassword ? true : false}
        onChange={(e) => onChange(e, "password")}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.IconRight}
            onPress={() => setshowPassword(!showPassword)}
          />
        }
      />

      <Button
        title="Iniciar Sesión"
        containerStyle={styles.btnContainerLogin}
        buttonStyle={styles.btnLogin}
        onPress={onSubmit}
      />
      <Loading isVisible={loading} text="Iniciando sesión" />
    </View>
  );
}
function defaultFormValue() {
  return {
    email: "",
    password: "",
  };
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  InputForm: {
    width: "100%",
    marginTop: 20,
  },
  btnContainerLogin: {
    marginTop: 20,
    width: "95%",
  },
  btnLogin: {
    backgroundColor: "rgb(137,144,246)",
  },
  IconRight: {
    color: "#c1c1c1",
  },
});
