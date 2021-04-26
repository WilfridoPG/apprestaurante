import React from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import { Button, Icon } from "react-native-elements";
import { filter } from "lodash";

const screenWidth = Dimensions.get("window").width / 3.5;
const Photos = ({ imagesSelected, setImagesSelected }) => {
  console.log("Imagenes ::", imagesSelected);
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {imagesSelected
          ? imagesSelected.map((img) => (
              <View style={[styles.box, styles.box2]}>
                <View
                  style={{
                    backgroundColor: "white",
                    width: 25,
                    height: 25,
                    zIndex: 2,
                    borderRadius: 50,
                    alignContent: "center",
                    borderColor: "blue",
                    position: "absolute",
                  }}
                >
                  <Icon
                    type="material-community"
                    iconStyle={{ marginTop: 5 }}
                    onPress={() =>
                      setImagesSelected(
                        filter(imagesSelected, (imageUrl) => imageUrl !== img)
                      )
                    }
                    name="delete"
                    size={15}
                    color="blue"
                  />
                </View>
                <Image
                  style={{ width: screenWidth, height: 100 }}
                  source={{ uri: img }}
                ></Image>

                {/* <Button
              type="outline"
              style={{ width: screenWidth, color: "blue" }}
              onPress
              icon={
                <Icon
                  type="material-community"
                  name="delete"
                  size={15}
                  color="blue"
                />
              }
              title="Eliminar"
            /> */}
              </View>
            ))
          : null}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  row: {
    flex: 1,
    marginLeft: -15,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  box: {
    flex: 1,
    padding: 5,
    width: screenWidth,
    height: 150,
    backgroundColor: "white",
  },
  box2: {
    backgroundColor: "white",
  },
  box3: {
    backgroundColor: "white",
  },
});

export default Photos;
