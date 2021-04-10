import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { Overlay } from "react-native-elements";

export default function ModalContainer(props) {
  const { isVisibleModal, text, children } = props;

  return (
    <Overlay
      isVisible={isVisibleModal}
      windowBackgroundColor="rgba(0,0,0,0.5)"
      overlayBackgroundColor="transparent"
      overlayStyle={styles.overlay}
    >
      <View style={styles.view}>{children}</View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlay: {
    height: 400,
    width: 300,
    backgroundColor: "#fff",
    borderColor: "#00a680",
    borderWidth: 2,
    borderRadius: 10,
  },
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
