import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Brightness from 'expo-brightness'; // <--- NUEVA IMPORTACIÓN

import { saveScan } from '../services/api'; 
import styles from '../styles/ResultStyles';
import Colors from '../styles/Colors';

const { width } = Dimensions.get('window');


const IMAGE_SIZE = width * 0.35; 

// Componente  para posicionar cada cara del holograma
const HologramFace = ({ imageUri, rotation, positionStyle }) => (
  <View style={[styles.hologramFace, { width: IMAGE_SIZE, height: IMAGE_SIZE }, positionStyle]}>
    <Image
      source={{ uri: imageUri }}
      style={[styles.faceImage, { transform: [{ rotate: rotation }] }]}
      resizeMode="contain"
    />
  </View>
);

export default function ResultScreen({ route, navigation }) {
  const { scanData } = route.params;
  const [saving, setSaving] = React.useState(false);

  // --- LÓGICA DE FÍSICA (BRILLO) ---
  useEffect(() => {
    let previousBrightness = null;

    const maxBrightness = async () => {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === 'granted') {
        // Guardamos el brillo actual para restaurarlo al salir
        previousBrightness = await Brightness.getBrightnessAsync();
        // Subimos el brillo al 100% para que el holograma se vea bien
        await Brightness.setBrightnessAsync(1.0);
      }
    };

    maxBrightness();

    // Al salir de la pantalla, restauramos el brillo normal
    return () => {
      if (previousBrightness !== null) {
        Brightness.setBrightnessAsync(previousBrightness);
      }
    };
  }, []);

  if (!scanData || scanData.found === false) {
    return (
        <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>¡Herramienta no encontrada!</Text>
             <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.replace('Scanner')}>
                <Text style={styles.buttonTextSecondary}>Volver a Escanear</Text>
            </TouchableOpacity>
        </View>
    );
  }

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
        await saveScan(scanData);
        Alert.alert("¡Guardado!", `La herramienta "${scanData.toolName}" se guardó en tu historial.`);
    } catch (error) {
        Alert.alert("Error", "No se pudo guardar.");
    } finally {
        setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
        {/* Header Flotante (Absolute para no mover el centro) */}
        <View style={styles.floatingHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Modo Holograma</Text>
            <View style={{width: 40}}/>
        </View>

        {/* --- ÁREA DE PROYECCIÓN (Fondo Negro Absoluto) --- */}
        <View style={styles.hologramContainer}>
            {/* */}
            <View style={styles.centerGuide} />

            {/* IMAGEN SUPERIOR (Reflejo Frontal) - Rota 180° (boca abajo) */}
            <HologramFace 
                imageUri={scanData.hologramImage} 
                rotation="180deg" 
                positionStyle={{ top: 20, alignSelf: 'center' }} 
            />

            {/*  IMAGEN INFERIOR (Reflejo Trasero) - Rota 0° (Normal) */}
            <HologramFace 
                imageUri={scanData.hologramImage} 
                rotation="0deg" 
                positionStyle={{ bottom: 20, alignSelf: 'center' }} 
            />

            {/* IMAGEN IZQUIERDA - Rota 90° */}
            <HologramFace 
                imageUri={scanData.hologramImage} 
                rotation="90deg" 
                positionStyle={{ left: 10, top: '40%' }} // Ajuste manual al centro vertical
            />

            {/* IMAGEN DERECHA - Rota -90° */}
            <HologramFace 
                imageUri={scanData.hologramImage} 
                rotation="-90deg" 
                positionStyle={{ right: 10, top: '40%' }} 
            />
        </View>

        {/* --- CONTROLES INFERIORES --- */}
        <View style={styles.infoPanel}>
            <Text style={styles.resultTitle}>{scanData.toolName}</Text>
            
            <View style={styles.buttonRow}>
                <TouchableOpacity 
                    style={[styles.buttonPrimary, {flex: 1, marginRight: 10}]} 
                    onPress={handleSave}
                >
                    {saving ? <ActivityIndicator color="white"/> : <Text style={styles.buttonTextPrimary}>Guardar</Text>}
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.buttonSecondary, {flex: 1}]} 
                    onPress={() => navigation.navigate('Detail', { item: { title: scanData.toolName, stlFile: scanData.stlFile } })}
                >
                    <Text style={styles.buttonTextSecondary}>Ver 3D</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
}