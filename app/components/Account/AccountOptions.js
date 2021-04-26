import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { ListItem } from "react-native-elements";
import { map } from "lodash";
import Modal from "../../components/Modal";
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";
import ChangeEmailForm from "./ChangeEmailForm";
import ChangePasswordForm from "./ChangeNumberForm";
import ChangeNumberForm from "./ChangeNumberForm";
export default function AccountOptions(props) {
  const [showModal, setshowModal] = useState(true);
  const [rederComponent, setrederComponent] = useState(null);
  const { userInfo, toastRef, setrealoadUserInfo } = props;
  const selectComponent = (key) => {
    switch (key) {
      case "displayName":
        setrederComponent(
          <ChangeDisplayNameForm
            displayName={userInfo.displayName}
            setrealoadUserInfo={setrealoadUserInfo}
            setshowModal={setshowModal}
            toastRef={toastRef}
          ></ChangeDisplayNameForm>
        );
        setshowModal(true);
        break;
      case "email":
        setrederComponent(
          <ChangeEmailForm
            email={userInfo.email}
            setrealoadUserInfo={setrealoadUserInfo}
            setshowModal={setshowModal}
            toastRef={toastRef}
          ></ChangeEmailForm>
        );
        setshowModal(true);
        break;
      case "password":
        setrederComponent(
          <ChangePasswordForm setshowModal={setshowModal} toastRef={toastRef} />
        );
        setshowModal(true);
        break;
      case "numero":
        setrederComponent(
          <ChangeNumberForm setshowModal={setshowModal} toastRef={toastRef} />
        );
        setshowModal(true);
        break;
      default:
        setrederComponent(null);
        setshowModal(false);
        break;
    }
  };
  const menuOptions = generateOptions(selectComponent);

  return (
    <View>
      {map(menuOptions, (menu, index) => (
        <ListItem
          key={index}
          title={menu.title}
          leftIcon={{
            type: menu.iconType,
            name: menu.iconNameLeft,
            color: menu.iconColorLeft,
          }}
          rightIcon={{
            type: menu.iconType,
            name: menu.iconNameRight,
            color: menu.iconColorRight,
          }}
          containerStyle={styles.menuItem}
          onPress={menu.onPress}
        />
      ))}
      {rederComponent && (
        <Modal isVisible={showModal} setIsVisible={setshowModal}>
          {rederComponent}
        </Modal>
      )}
    </View>
  );
}
function generateOptions(selectComponent) {
  return [
    {
      title: "Cambiar Nombre y Apellido",
      iconType: "material-community",
      iconNameLeft: "account-circle",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      iconColorRight: "#ccc",
      onPress: () => selectComponent("displayName"),
    },
    /*
    {
      title: "Cambiar Email",
      iconType: "material-community",
      iconNameLeft: "at",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      iconColorRight: "#ccc",
      onPress: () => selectComponent("email"),
    },*/
    {
      title: "Cambiar Contraseña",
      iconType: "material-community",
      iconNameLeft: "lock-reset",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      iconColorRight: "#ccc",
      onPress: () => selectComponent("password"),
    },
    {
      title: "Cambiar número",
      iconType: "material-community",
      iconNameLeft: "lock-reset",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      iconColorRight: "#ccc",
      onPress: () => selectComponent("numero"),
    },
  ];
}

const styles = StyleSheet.create({
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3",
  },
});
