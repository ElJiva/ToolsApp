import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Dimensions,
  Image // Si tuvieras una imagen real, usarías esto
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const PRIMARY_COLOR = '#3B82F6'; // El azul brillante de tu app

export default function HomeScreen({ navigation }) {
  
  const handleStart = () => {
    // Usamos 'replace' en lugar de 'navigate'.
    // Esto reemplaza la pantalla actual en el historial, 
    // así el usuario no puede volver aquí con el botón "atrás".
    navigation.replace('Scanner');
  };

  return (
    <View style={styles.container}>
      
      {/* Contenido Superior (Icono y Textos) */}
      <View style={styles.contentContainer}>
        
        {/* Placeholder del Logo/Imagen Central */}
        <View style={styles.logoContainer}>
            {/* Si tuvieras tu imagen: 
            <Image source={require('../../assets/tu-imagen.png')} style={styles.logoImage} /> 
            */}
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
    backgroundColor: '#0F1218', // Fondo oscuro principal
    paddingHorizontal: 30,
    justifyContent: 'space-between', // Distribuye espacio entre contenido y botón
    paddingVertical: 50,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50, // Un pequeño ajuste para subirlo visualmente
  },
  // Logo Simulado
  logoContainer: {
    width: 180,
    height: 180,
    backgroundColor: 'rgba(59, 130, 246, 0.1)', // Azul muy transparente
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)', // Borde azul sutil
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
    color: '#8E9BB3', // Gris azulado claro
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