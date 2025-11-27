import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Dimensions,
  Image 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const PRIMARY_COLOR = '#F59E0B'; 

export default function HomeScreen({ navigation }) {
  
  const handleStart = () => {
    navigation.replace('Scanner');
  };

  return (
    <View style={styles.container}>
      
      {}
      <View style={styles.contentContainer}>
        
        {}
        <View style={styles.logoContainer}>
            {}
            <MaterialCommunityIcons name="tools" size={100} color="white" />
        </View>
        
        <Text style={styles.title}>
          Bienvenido a{'\n'}ToolScan 3D
        </Text>
        
        <Text style={styles.subtitle}>
          La forma más rápida de identificar y explorar tus herramientas en 3D.
        </Text>

      </View>

      {/* Botón Inferior */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleStart} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Empezar</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1218', 
    paddingHorizontal: 30,
    justifyContent: 'space-between', 
    paddingVertical: 50,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50, 
  },
  // Logo Simulado
  logoContainer: {
    width: 180,
    height: 180,
    backgroundColor: 'rgba(59, 130, 246, 0.1)', 
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)', 
  },

  // Textos
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E9BB3', 
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },

  // Botón
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  button: {
    backgroundColor: PRIMARY_COLOR,
    width: '100%',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});