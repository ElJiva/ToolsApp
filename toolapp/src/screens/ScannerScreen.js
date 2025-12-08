import React, { useState, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, ActivityIndicator, Alert 
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


import { detectTool } from '../services/api';
import styles from '../styles/ScannerStyles';
import Colors from '../styles/Colors'; 

export default function ScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState('off');
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) return <View style={styles.container} />;
  
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

  const handleCapture = async () => {
    if (cameraRef.current && !loading) {
      setLoading(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
            quality: 0.7,
            base64: false,
        });

        console.log("Enviando foto:", photo.uri);
        const result = await detectTool(photo.uri);
        
        setLoading(false);
        navigation.navigate('Result', { scanData: result, photoUri: photo.uri });

      } catch (error) {
        setLoading(false);
        Alert.alert("Error", "No pudimos conectar con el servidor. Revisa tu IP.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraSection}>
        <CameraView 
          ref={cameraRef} 
          style={styles.cameraOverlay} 
          facing="back" 
          flash={flash}
        >
            {/* UI sobre la cámara */}
            <View style={styles.cameraOverlay}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.flashButton} onPress={() => setFlash(f => f === 'off' ? 'on' : 'off')}>
                        <Ionicons name={flash === 'on' ? "flash" : "flash-off"} size={20} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Escanear Herramienta</Text>
                    <View style={{ width: 40 }} /> 
                </View>

                <View style={styles.scannerFrameContainer}>
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />
                </View>
            </View>
        </CameraView>

        {loading && (
            <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
                <Text style={{color: 'white', marginTop: 10, fontWeight: 'bold'}}>Analizando con IA...</Text>
            </View>
        )}
      </View>

      <View style={styles.bottomPanel}>
        <Text style={styles.subInstruction}>Centre la herramienta y capture</Text>
        
        <TouchableOpacity 
          style={[styles.captureBtnOuter, loading && {opacity: 0.5}]}
          onPress={handleCapture}
          disabled={loading}
        >
          <View style={styles.captureBtnInner}>
            <Ionicons name="camera" size={32} color="white" />
          </View>
        </TouchableOpacity>

        <View style={styles.navBar}>
          <TouchableOpacity style={styles.navItem}>
            <MaterialCommunityIcons name="line-scan" size={24} color={Colors.PRIMARY} />
            <Text style={[styles.navText, { color: Colors.PRIMARY }]}>Escanear</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navItem} 
            onPress={() => navigation.navigate('History')}
          >
            <MaterialCommunityIcons name="history" size={24} color={Colors.TEXT_GRAY} />
            <Text style={styles.navText}>Historial</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}