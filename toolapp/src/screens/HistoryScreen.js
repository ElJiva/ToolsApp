import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, TextInput, 
  ActivityIndicator, RefreshControl, Platform, LayoutAnimation, UIManager
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { getHistory } from '../services/api';
import styles from '../styles/HistoryStyles';
import Colors from '../styles/Colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HistoryScreen({ navigation }) {
  const [historyData, setHistoryData] = useState([]); 
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getHistory();
      const formattedData = data.map(item => ({
        id: item.id.toString(),
        title: item.herramienta_detectada,
        date: item.fecha,
        confidence: item.confianza,
        icon: getIconName(item.herramienta_detectada),
      }));
      setHistoryData(formattedData.reverse());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getIconName = (name) => {
    const n = name ? name.toLowerCase() : '';
    if (n.includes('martillo')) return 'hammer';
    if (n.includes('destornillador')) return 'screwdriver';
    if (n.includes('llave')) return 'wrench';
    return 'tools';
  };

  useEffect(() => { fetchData(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const filteredData = historyData.filter(item => 
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const deleteItem = (idToDelete) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setHistoryData(prevData => prevData.filter(item => item.id !== idToDelete));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      disabled={isEditing}
      onPress={() => navigation.navigate('Detail', { item })}
    >
      <View style={styles.thumbnailContainer}>
         <MaterialCommunityIcons name={item.icon} size={24} color="#111" />
      </View>

      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDate}>{item.date}</Text>
      </View>

      <TouchableOpacity 
        onPress={() => { if (isEditing) deleteItem(item.id); }}
        style={styles.actionIconArea}
      >
        <MaterialCommunityIcons 
          name={isEditing ? "trash-can-outline" : "chevron-right"} 
          size={24} 
          color={isEditing ? Colors.DANGER : Colors.TEXT_MUTED} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <MaterialCommunityIcons 
            name={isEditing ? "check" : "square-edit-outline"} 
            size={24} 
            color={Colors.PRIMARY} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.TEXT_GRAY} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar herramienta..."
          placeholderTextColor={Colors.TEXT_MUTED}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
             <Ionicons name="close-circle" size={18} color={Colors.TEXT_MUTED} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
            <Text style={styles.loadingText}>Cargando historial...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                tintColor={Colors.PRIMARY}
                colors={[Colors.PRIMARY]} 
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="history" size={60} color="#2A3040" />
              <Text style={styles.emptyText}>No hay escaneos recientes</Text>
            </View>
          }
        />
      )}
    </View>
  );
}