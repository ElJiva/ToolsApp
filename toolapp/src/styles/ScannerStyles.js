import { StyleSheet, Dimensions } from 'react-native';
import Colors from './Colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BACKGROUND,
  },
  permissionText: { 
    color: Colors.TEXT_WHITE, 
    marginBottom: 20 
  },
  btnPermission: { 
    backgroundColor: Colors.PRIMARY, 
    padding: 10, 
    borderRadius: 5 
  },
  btnText: { color: Colors.TEXT_WHITE },

  // Sección Cámara
  cameraSection: {
    flex: 2,
    position: 'relative',
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 40,
    zIndex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: Colors.TEXT_WHITE,
    fontSize: 18,
    fontWeight: '600',
  },
  flashButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.OVERLAY,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Retícula
  scannerFrameContainer: {
    alignSelf: 'center',
    width: width * 0.7,
    height: width * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: Colors.PRIMARY,
    borderWidth: 4,
  },
  // Posiciones de esquinas
  topLeft: { top: 0, left: 0, borderBottomWidth: 0, borderRightWidth: 0 },
  topRight: { top: 0, right: 0, borderBottomWidth: 0, borderLeftWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderTopWidth: 0, borderRightWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderTopWidth: 0, borderLeftWidth: 0 },

  // Panel Inferior
  bottomPanel: {
    flex: 1.2,
    backgroundColor: Colors.BACKGROUND,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  subInstruction: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 10,
  },
  captureBtnOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  captureBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#1F2430',
    paddingTop: 15,
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, marginTop: 4, color: Colors.TEXT_GRAY },
});