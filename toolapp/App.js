import React from 'react';
import { StatusBar } from 'expo-status-bar';
// Importamos el archivo de rutas que creamos en el paso anterior
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <>
      {/* Barra de estado blanca/clara para fondo oscuro */}
      <StatusBar style="light" />
      {/* Cargamos el navegador que decide qué pantalla mostrar */}
      <AppNavigator />
    </>
  );
}