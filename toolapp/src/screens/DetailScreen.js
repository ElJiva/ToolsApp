import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import styles from "../styles/DetailStyles";
import Colors from "../styles/Colors";
import ModelViewer from "../components/ModelViewer";
import { getToolData } from "../constants/ToolAssets";

const { height } = Dimensions.get("window");

export default function DetailScreen({ route, navigation }) {
  const { item } = route.params || {};
  const toolData = getToolData(item?.title);

  return (
    <View style={{ flex: 1, backgroundColor: "#0F1218" }}>
      {/* 1. HEADER */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 50,
          paddingHorizontal: 20,
          zIndex: 10,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5, backgroundColor: "rgba(0,0,0,0.3)", borderRadius: 20 }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>{item?.title || "Detalle"}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 2. ZONA 3D */}
      <View style={{ height: height * 0.55, width: "100%" }}>
        {toolData.model ? (
          <ModelViewer localResource={toolData.model} />
        ) : (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Image source={toolData.image} style={{ width: "60%", height: "60%" }} resizeMode="contain" />
          </View>
        )}

        {/* Indicador visual flotante */}
        {toolData.model && (
          <Text
            style={{
              position: "absolute",
              bottom: 20,
              alignSelf: "center",
              color: "rgba(255,255,255,0.5)",
              fontSize: 12,
            }}
          >
            3D Interactivo
          </Text>
        )}
      </View>

      {/* 3. ZONA DE INFORMACIÓN */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#1A1D26",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: -20,
          paddingHorizontal: 25,
          paddingTop: 30,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ width: 40, height: 4, backgroundColor: "#333", alignSelf: "center", borderRadius: 2, marginBottom: 20 }} />

          <Text style={{ fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 10 }}>Información</Text>

          <Text style={{ fontSize: 16, color: "#A0A0A0", lineHeight: 24, marginBottom: 30 }}>{toolData.description}</Text>

          <Text style={{ fontSize: 18, fontWeight: "bold", color: "white", marginBottom: 15 }}>Características</Text>

          <View style={{ gap: 15, paddingBottom: 40 }}>
            <FeatureItem text="Identificación por IA completada." />
            <FeatureItem text={toolData.model ? "Modelo 3D interactivo disponible." : "Visualización imagen 2D."} />
            <FeatureItem text="Análisis de geometría en tiempo real." />
            <FeatureItem text="Herramienta guardada en historial." />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const FeatureItem = ({ text }) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Ionicons name="checkmark-circle" size={24} color={Colors.PRIMARY || "#2196F3"} style={{ marginRight: 15 }} />
    <Text style={{ color: "#E0E0E0", fontSize: 15 }}>{text}</Text>
  </View>
);
