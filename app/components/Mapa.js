import React from "react";
import { View, Text } from "react-native";
import MapView from "react-native-maps";
import openMap from "react-native-open-maps";
export default function Mapa({ location, name, height }) {
  console.log("dddddireciones", location);
  const openAppMap = () => {
    openMap({
      latitude: location[0].position.latitude,
      longitude: location[0].position.longitude,
      zoom: 19,
      query: name,
    });
  };
  return (
    <MapView
      style={{ height: height, width: "100%" }}
      initialRegion={location[0].position}
      onPress={openAppMap}
    >
      {location.map((addres) => {
        console.log("direccion".addres);
        return (
          <MapView.Marker
            coordinate={{
              latitude: addres.position.latitude,
              longitude: addres.position.longitude,
            }}
          />
        );
      })}
    </MapView>
  );
}
