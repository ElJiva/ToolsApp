import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Brightness from "expo-brightness";

import styles from "../styles/ResultStyles";
import { getToolData } from "../constants/ToolAssets";

const { width } = Dimensions.get("window");
const IMAGE_SIZE = width * 0.35;

const HologramFace = ({ imageSource, rotation, positionStyle }) => (
  <View style={[styles.hologramFace, { width: IMAGE_SIZE, height: IMAGE_SIZE }, positionStyle]}>
    <Image source={imageSource} style={[styles.faceImage, { transform: [{ rotate: rotation }] }]} resizeMode="contain" />
  </View>
);

export default function ResultScreen({ route, navigation }) {
  const { scanData } = route.params;

  const localTool = getToolData(scanData.toolName);
  const hologramImage = localTool.image;

  // Lógica de brillo
  useEffect(() => {
    let previousBrightness = null;
    const maxBrightness = async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === "granted") {
        previousBrightness = await Brightness.getBrightnessAsync();
        await Brightness.setBrightnessAsync(1.0);
      }
    };
    maxBrightness();
    return () => {
      if (previousBrightness !== null) {
        Brightness.setBrightnessAsync(previousBrightness);
      }
    };
  }, []);

  if (!scanData || scanData.found === false) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>No identificado</Text>
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.replace("Scanner")}>
          <Text style={styles.buttonTextSecondary}>Intentar de nuevo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.floatingHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Holograma</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.hologramContainer}>
        <View style={styles.centerGuide} />
        <HologramFace imageSource={hologramImage} rotation="180deg" positionStyle={{ top: 20, alignSelf: "center" }} />
        <HologramFace imageSource={hologramImage} rotation="0deg" positionStyle={{ bottom: 20, alignSelf: "center" }} />
        <HologramFace imageSource={hologramImage} rotation="90deg" positionStyle={{ left: 10, top: "40%" }} />
        <HologramFace imageSource={hologramImage} rotation="-90deg" positionStyle={{ right: 10, top: "40%" }} />
      </View>

      <View style={styles.infoPanel}>
        <Text style={styles.resultTitle}>{scanData.toolName}</Text>
        <Text style={{ color: "#ccc", marginBottom: 15 }}>Confianza: {scanData.confidence}%</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.buttonSecondary, { flex: 1, backgroundColor: "#2196F3" }]}
            onPress={() =>
              navigation.navigate("Detail", {
                item: {
                  title: scanData.toolName, 
                },
              })
            }
          >
            <Ionicons name="cube-outline" size={24} color="white" style={{ marginRight: 10 }} />
            <Text style={[styles.buttonTextSecondary, { color: "white" }]}>Ver Modelo 3D</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
