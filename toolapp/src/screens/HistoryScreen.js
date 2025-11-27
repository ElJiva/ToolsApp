import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  LayoutAnimation, // Para animaciones suaves al borrar
  Platform,
  UIManager
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Habilitar animaciones en Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// DATOS INICIALES
const INITIAL_DATA = [
  {
    id: '1',
    title: 'Martillo de Garra',
    date: '25 de Octubre de 2023, 10:15 am',
    icon: 'hammer', 
  },
  {
    id: '2',
    title: 'Destornillador Phillips',
    date: '24 de Octubre de 2023, 03:30 pm',
    icon: 'screwdriver',
  },
  {
    id: '3',
    title: 'Llave Inglesa',
    date: '24 de Octubre de 2023, 09:00 am',
    icon: 'wrench',
  },
  {
    id: '4',
    title: 'Taladro Percutor',
    date: '22 de Octubre de 2023, 11:20 am',
    icon: 'screw-machine-flat-top',
  },
];

export default function HistoryScreen({ navigation }) {
  // 1. ESTADOS
  const [historyData, setHistoryData] = useState(INITIAL_DATA); // La lista de datos
  const [searchText, setSearchText] = useState(''); // Texto del buscador
  const [isEditing, setIsEditing] = useState(false); // ¿Estamos en modo borrar?

  // 2. LÓGICA DE FILTRADO (Buscador)
  const filteredData = historyData.filter(item => 
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  // 3. LÓGICA DE BORRADO
  const deleteItem = (idToDelete) => {
    // Animación bonita al borrar
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // Filtramos la lista para quitar el item con ese ID
    setHistoryData(prevData => prevData.filter(item => item.id !== idToDelete));
  };

  // 4. RENDERIZADO DE CADA ITEM
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      // Si estamos editando, desactivamos la navegación al detalle para evitar confusiones
      disabled={isEditing}
      onPress={() => navigation.navigate('Detail', { item })}
    >
      {/* Miniatura */}
      <View style={styles.thumbnailContainer}>
         <MaterialCommunityIcons name={item.icon} size={24} color="#111" />
      </View>

      {/* Textos Centrales */}
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDate}>{item.date}</Text>
      </View>

      {/* ICONO DE ACCIÓN (Cambia según el modo) */}
      <TouchableOpacity 
        onPress={() => {
          if (isEditing) {
            deleteItem(item.id); // Si estamos editando, BORRA
          } else {
            // Si no, aquí podrías abrir un menú de opciones (future feature)
          }
        }}
        style={styles.actionIconArea}
      >
        <MaterialCommunityIcons 
          name={isEditing ? "trash-can-outline" : "dots-vertical"} 
          size={24} 
          // Rojo si edita, Gris si es normal
          color={isEditing ? "#EF4444" : "#8E9BB3"} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Historial de Escaneos</Text>
        
        {/* BOTÓN DE EDITAR (Toggle) */}
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <MaterialCommunityIcons 
            // Cambia el icono: Lápiz (Editar) <-> Check (Listo)
            name={isEditing ? "check" : "square-edit-outline"} 
            size={24} 
            color={isEditing ? "#10B981" : "#F59E0B"} // Verde si está confirmando, Naranja normal
          />
        </TouchableOpacity>
      </View>

      {/* BARRA DE BÚSQUEDA */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E9BB3" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre de herramienta"
          placeholderTextColor="#6D7A94"
          value={searchText}
          onChangeText={text => setSearchText(text)}
        />
        {/* Botón X pequeña para limpiar búsqueda si hay texto */}
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
             <Ionicons name="close-circle" size={18} color="#6D7A94" />
          </TouchableOpacity>
        )}
      </View>

      {/* LISTA */}
      <FlatList
        data={filteredData} // Usamos la lista filtrada
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // Mensaje si no hay resultados
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron herramientas</Text>
          </View>
        }
      />
      
    </View>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1218',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E232E',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 25,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#1E232E',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
  },
  thumbnailContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDate: {
    color: '#8E9BB3',
    fontSize: 12,
  },
  actionIconArea: {
    padding: 5, // Más área para tocar
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#6D7A94',
    fontSize: 16,
  }
});