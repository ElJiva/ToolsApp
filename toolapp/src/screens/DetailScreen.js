import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const ACCENT_COLOR = '#F59E0B';

export default function DetailScreen({ route, navigation }) {
  const { item } = route.params || {}; 
  const toolName = item?.title || "Martillo de Garra";
  
  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{toolName}</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2558/2558162.png' }} 
            style={styles.toolImage}
            resizeMode="contain"
          />
          <Text style={styles.modelTitle}>Modelo 3D Interactivo</Text>
          <Text style={styles.modelSubtitle}>Arrastra para rotar, pellizca para hacer zoom.</Text>
        </View>

        <View style={styles.bottomSheet}>
          <View style={styles.dragHandle} />

          <Text style={styles.categoryTitle}>Herramienta de percusión</Text>
          
          <Text style={styles.descriptionText}>
            Un martillo de garra se utiliza principalmente para clavar y extraer clavos de la madera y otros materiales. Es fundamental en carpintería básica.
          </Text>

          <View style={styles.featuresList}>
            <FeatureItem text="Cabeza para golpear con precisión." />
            <FeatureItem text="Garra curvada para extraer clavos." />
            <FeatureItem text="Mango ergonómico para un agarre seguro." />
          </View>
        </View>

      </ScrollView>

      <View style={styles.fabContainer}>
        <TouchableOpacity style={[styles.fab, { marginBottom: 15, backgroundColor: '#333' }]}>
           <MaterialCommunityIcons name="cube-scan" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.fab, { backgroundColor: ACCENT_COLOR }]}>
           <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

    </View>
  );
}

const FeatureItem = ({ text }) => (
  <View style={styles.featureRow}>
    <Ionicons name="checkmark-circle-outline" size={24} color={ACCENT_COLOR} style={{ marginRight: 10 }} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1218',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  toolImage: {
    width: 200,
    height: 200,
    marginBottom: 15,
  },
  modelTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modelSubtitle: {
    color: '#8E9BB3',
    fontSize: 12,
  },
  bottomSheet: {
    backgroundColor: '#161B22',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    minHeight: 400,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#2E3A59',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  categoryTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    color: '#8E9BB3',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
  featuresList: {
    marginTop: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureText: {
    color: '#E4E9F2',
    fontSize: 14,
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: height * 0.35,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});