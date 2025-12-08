import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from '../styles/HomeStyles';

export default function HomeScreen({ navigation }) {
  
  const handleStart = () => {
    navigation.replace('Scanner');
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.contentContainer}>
        {}
        <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="tools" size={100} color="white" />
        </View>
        
        <Text style={styles.title}>
          Bienvenido a{'\n'}ToolScan 3D
        </Text>
        
        <Text style={styles.subtitle}>
          La forma más rápida de identificar y explorar tus herramientas en 3D.
        </Text>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleStart} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Empezar</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
}