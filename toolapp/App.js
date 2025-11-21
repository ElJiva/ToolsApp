import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, {useState, useEffect} from 'react';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const API_URL = '';
export default function App(){
  const [data,setData] = useState9null;

  const fetchDatos = async()=> {
    try{
      const response = await fetch(API_URL);

      const json = await response.json();

      setData(json)
    }catch(error){
      console.error("Error al obtener datos:");
    }
  }
}
