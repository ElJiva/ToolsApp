import { StyleSheet, Dimensions } from 'react-native';
import Colors from './Colors';

const { width, height } = Dimensions.get('window');

const HOLOGRAM_AREA_SIZE = width * 0.9; 

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  // Header flotante para no ocupar espacio del holograma
  floatingHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  headerTitle: {
    color: 'rgba(255,255,255,0.5)', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconBtn: {
    padding: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },

  // --- ZONA HOLOGRAMA ---
  hologramContainer: {
    width: width,
    height: width, 
    marginTop: (height - width) / 2 - 50, 
    // backgroundColor: '#111',
  },
  
  // Cada cara del holograma
  hologramFace: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(255,0,0,0.1)', 
  },
  faceImage: {
    width: '100%',
    height: '100%',
    tintColor: Colors.PRIMARY, 
  },
  
  // Un puntito en el centro para saber donde poner la pirámide
  centerGuide: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 6,
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    transform: [{translateX: -3}, {translateY: -3}]
  },

  // Panel Inferior
  infoPanel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: '#161B22',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  resultTitle: {
    color: Colors.TEXT_WHITE,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonPrimary: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonTextPrimary: {
    color: Colors.TEXT_WHITE,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: Colors.CARD_BG,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonTextSecondary: {
    color: Colors.PRIMARY,
    fontWeight: 'bold',
  },
  
  errorContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTitle: { color: 'white', fontSize: 18 }
});