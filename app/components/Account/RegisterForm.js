import React, { useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../../utils/validation";
import { size, isEmpty } from "lodash";
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/native";
import Loading from "../Loading";
import ModalContainer from "../ModalContainer";

import { firebaseApp } from "../../utils/firebase";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);
export default function RegisterForm(props) {
  const { toastRef } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setshowRepeatPassword] = useState(false);
  const [formData, setformData] = useState(defaultFormValue());
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const navigation = useNavigation();

  const onSubmit = async () => {
    if (
      isEmpty(formData.nombre) ||
      isEmpty(formData.email) ||
      isEmpty(formData.password) ||
      isEmpty(formData.repeatPassword)
    ) {
      toastRef.current.show("Todos los campos son obligatorios");
    } else if (!validateEmail(formData.email)) {
      toastRef.current.show("El email no es correcto");
    } else if (formData.password !== formData.repeatPassword) {
      toastRef.current.show("Las contraseñas tienes que ser iguales");
    } else if (size(formData.password) < 6) {
      toastRef.current.show(
        "La contraseña debe de tener al menos 6 caracteres"
      );
    } else {
      //setLoading(true);
      await firebase
        .auth()
        .createUserWithEmailAndPassword(formData.email, formData.password)
        .then((snashop) => {
          db.collection(`user`)
            .doc(snashop.user.uid)
            .set({
              peseador: isEnabled,
              diaDisponible: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"],
            })
            .then(() => {
              sendEmail();

              setIsVisibleModal(true);
            })
            .catch(() => {});
        })
        .catch(() => {
          setLoading(false);
          toastRef.current.show(
            "El correo ya esta registrado , intente con otro correo"
          );
        });
    }
  };
  const login = () => {
    setIsVisibleModal(false);
    navigation.navigate("login");
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };
  const sendEmail = () => {
    var user = firebase.auth().currentUser;
    user
      .sendEmailVerification()
      .then(() => {
        user
          .updateProfile({
            displayName: formData.nombre,
          })
          .then(function () {
            // Update successful.
          })
          .catch(function (error) {
            // An error happened.
          });
      })
      .catch(function (error) {});
  };
  const onChange = (e, type) => {
    setformData({ ...formData, [type]: e.nativeEvent.text });
  };
  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Nombre completo"
        containerStyle={styles.InputForm}
        onChange={(e) => onChange(e, "nombre")}
      />
      <Input
        placeholder="Correo Electronico"
        onChange={(e) => onChange(e, "email")}
        containerStyle={styles.inputForm}
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.inputForm}
        onChange={(e) => onChange(e, "password")}
        password={true}
        secureTextEntry={showPassword ? false : true}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <Input
        placeholder="Confirmar contraseña"
        containerStyle={styles.inputForm}
        password={true}
        onChange={(e) => onChange(e, "repeatPassword")}
        secureTextEntry={showRepeatPassword ? false : true}
        rightIcon={
          <Icon
            type="material-community"
            name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.iconRight}
            onPress={() => setshowRepeatPassword(!showRepeatPassword)}
          />
        }
      />
      <View style={styles.viewSwitch}>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          style={{ transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }] }}
          ios_backgroundColor="gray"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        <Text style={styles.textSwitch}>
          Como paseador / como dueño de mascotas
        </Text>
      </View>
      <Button
        title="Unirse"
        onPress={onSubmit}
        containerStyle={styles.btnContainerRegister}
        buttonStyle={styles.btnRegister}
      />
      <Loading isVisible={loading} text="Creando cuenta" />
      <ModalContainer isVisibleModal={isVisibleModal}>
        <Text>
          Te hemos enviado un link a tu correo para validar tu cuenta, una vez
          validada puedes iniciar sesion. Si no te ha llegado el correo puedes
          volver a enviar el link.
        </Text>
        <Button
          title="Reenviar correo"
          onPress={sendEmail}
          containerStyle={styles.btnContainerRegister}
          buttonStyle={styles.btnRegister}
        ></Button>
        <Button
          title="Aceptar"
          containerStyle={styles.btnContainerRegister}
          onPress={login}
          buttonStyle={styles.btnRegister}
        ></Button>
      </ModalContainer>
    </View>
  );
}

function defaultFormValue() {
  return {
    email: "",
    password: "",
    repeatPassword: "",
  };
}
const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  inputForm: {
    width: "100%",
    marginTop: 20,
  },
  btnContainerRegister: {
    marginTop: 20,
    width: "95%",
  },
  btnRegister: {
    backgroundColor: "rgb(137,144,246)",
  },
  iconRight: {
    color: "#c1c1c1",
  },
  viewSwitch: {
    marginTop: 20,
    flexDirection: "row",
  },
  textSwitch: {
    marginTop: 5,
  },
});
