import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState('off'); // 'off' | 'on'

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Necesitamos acceso a la cámara</Text>
        <TouchableOpacity style={styles.btnPermission} onPress={requestPermission}>
          <Text style={styles.btnText}>Dar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  };

  return (
    <View style={styles.container}>
      
      {/* SECCIÓN SUPERIOR: Contenedor de la Cámara */}
      <View style={styles.cameraSection}>
        
        {/* CAPA 1: La Cámara (Fondo) */}
        <CameraView 
          style={StyleSheet.absoluteFillObject} 
          facing="back" 
          flash={flash}
        />

        {/* CAPA 2: Interfaz sobre la cámara (Header y Retícula) */}
        <View style={styles.cameraOverlay}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
              <Ionicons 
                name={flash === 'on' ? "flash" : "flash-off"} 
                size={20} 
                color="white" 
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Escanear Herramienta</Text>
            <View style={{ width: 40 }} /> 
          </View>

          {/* Retícula Central */}
          <View style={styles.scannerFrameContainer}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
            
            <View style={styles.instructionBadge}>
              <Text style={styles.instructionText}>Apunte la cámara a la herramienta</Text>
            </View>
          </View>

        </View>
      </View>

      {/* SECCIÓN INFERIOR: Panel Oscuro de Controles */}
      <View style={styles.bottomPanel}>
        
        <Text style={styles.subInstruction}>Centre la herramienta en el recuadro</Text>
        
        {/* Barra de Progreso */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Escaneando...</Text>
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        {/* Botón Captura */}
        <TouchableOpacity 
          style={styles.captureBtnOuter}
          onPress={() => navigation.navigate('Result')} 
        >
          <View style={styles.captureBtnInner}>
            <Ionicons name="camera" size={32} color="white" />
          </View>
        </TouchableOpacity>

        {/* Navegación Inferior */}
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem}>
            <MaterialCommunityIcons name="line-scan" size={24} color="#F59E0B" />
            <Text style={[styles.navText, { color: '#F59E0B' }]}>Escanear</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => navigation.navigate('History')}
          >
            <MaterialCommunityIcons name="history" size={24} color="#888" />
            <Text style={styles.navText}>Historial</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  permissionText: { color: 'white', marginBottom: 20 },
  btnPermission: { backgroundColor: '#F59E0B', padding: 10, borderRadius: 5 },
  btnText: { color: 'white' },

  // --- SECCIÓN CÁMARA ---
  cameraSection: {
    flex: 2, // Ocupa 2/3 de la pantalla
    position: 'relative', // Necesario para que lo de adentro se posicione absolutamente
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject, // Ocupa todo el espacio de cameraSection
    justifyContent: 'space-between', // Separa header de retícula
    paddingTop: 50, 
    paddingBottom: 40,
    zIndex: 1, // Asegura que esté encima de la cámara
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  flashButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Retícula
  scannerFrameContainer: {
    alignSelf: 'center',
    width: width * 0.7,
    height: width * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Ajuste visual
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#F59E0B',
    borderWidth: 4,
  },
  topLeft: { top: 0, left: 0, borderBottomWidth: 0, borderRightWidth: 0 },
  topRight: { top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0 },
  
  instructionBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  instructionText: {
    color: 'white',
    fontSize: 12,
  },

  // --- PANEL INFERIOR ---
  bottomPanel: {
    flex: 1.2,
    backgroundColor: '#0F1218', 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  subInstruction: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 10,
  },
  progressContainer: {
    width: '85%',
    marginBottom: 20,
  },
  progressLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#2A3040',
    borderRadius: 4,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    width: '40%', 
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  
  captureBtnOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  captureBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },

  navBar: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#1F2430',
    paddingTop: 15,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#888',
  },
});