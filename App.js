import React, { useEffect } from "react";
import Navigation from "./app/navigation/Navigation";
import { firebaseApp } from "./app/utils/firebase";
import * as firebase from "firebase";
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]);

import { decode, encode } from "base-64";
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

export default function App() {
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {});
  }, []);
  return <Navigation />;
}
