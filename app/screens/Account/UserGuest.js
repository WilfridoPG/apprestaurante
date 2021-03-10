import React from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export default function UserGuest() {
  const navigation = useNavigation();
  return (
    <ScrollView centerContent={true} style={styles.viewBody}>
      <Image
        source={require("../../../assets/img/user-guest.jpg")}
        style={styles.image}
      />
      <Text style={styles.title}>Cosulta tu perfil de 5 Tenedores</Text>
      <Text style={styles.description}>
        Como decribirias tu restaurante ? busca{" "}
      </Text>
      <View style={styles.viewbtn}>
        <Button
          buttonStyle={styles.btnstyle}
          containerStyle={styles.btnContainer}
          title="Ver tu Perfil"
          onPress={() => navigation.navigate("login")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    marginLeft: 30,
    marginRight: 30,
  },
  image: {
    height: 300,
    width: "100%",
    marginBottom: 40,
  },
  title: {
    fontWeight: "bold",
    fontSize: 19,
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
  },
  viewbtn: {
    flex: 1,
    alignItems: "center",
  },
  btnstyle: {
    backgroundColor: "#00a680",
  },
  btnContainer: {
    width: "70%",
  },
});
