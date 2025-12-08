import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Imports de Estilos, Colores y API
import styles from '../styles/DetailStyles';
import Colors from '../styles/Colors';
import { getImageUrl } from '../services/api'; 
import ModelViewer from '../components/ModelViewer';

export default function DetailScreen({ route, navigation }) {
  const { item } = route.params || {}; 
  const toolName = item?.title || "Herramienta";
  

  const stlUrl = item?.stlFile ? getImageUrl(item.stlFile) : null;

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 5}}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{toolName}</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/*VISOR 3D */}
        <View style={styles.imageContainer}>
          {stlUrl ? (
             
             <View style={{width: '100%', height: '80%'}}>
                 <ModelViewer url={stlUrl} />
             </View>
          ) : (
             // Si no hay STL, mostramos la imagen por default
             <Image 
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2558/2558162.png' }} 
                style={styles.toolImage}
                resizeMode="contain"
             />
          )}
          
          <Text style={styles.modelTitle}>Modelo 3D</Text>
          <Text style={styles.modelSubtitle}>
             {stlUrl ? "Arrastra para rotar y haz pinza para zoom" : "Modelo no disponible"}
          </Text>
        </View>

        <View style={styles.bottomSheet}>
          <View style={styles.dragHandle} />
          <Text style={styles.categoryTitle}>Información</Text>
          <Text style={styles.descriptionText}>
            Herramienta identificada: {toolName}.
            {stlUrl ? '\nModelo 3D cargado correctamente.' : '\nNo se encontró archivo 3D asociado.'}
          </Text>

          <View style={styles.featuresList}>
            <FeatureItem text="Identificación por IA." />
            <FeatureItem text="Visualización 3D interactiva." />
            <FeatureItem text="Análisis de geometría." />
          </View>
        </View>

      </ScrollView>

      {/* Botones Flotantes */}
      <View style={styles.fabContainer}>
        {}
        <TouchableOpacity style={[styles.fab, { backgroundColor: Colors.PRIMARY }]}>
           <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

    </View>
  );
}

const FeatureItem = ({ text }) => (
  <View style={styles.featureRow}>
    <Ionicons name="checkmark-circle-outline" size={24} color={Colors.PRIMARY} style={{ marginRight: 10 }} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);