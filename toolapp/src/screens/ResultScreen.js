import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function ResultScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla de Resultados (Pendiente)</Text>
      <Button title="Volver" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  text: { color: 'white', marginBottom: 20 }
});