import { StyleSheet, Dimensions } from 'react-native';
import Colors from './Colors';

const { height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
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
    color: Colors.TEXT_WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Visor 3D / Imagen
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
    color: Colors.TEXT_WHITE,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modelSubtitle: {
    color: Colors.TEXT_GRAY,
    fontSize: 12,
  },
  
  // Bottom Sheet (Info)
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
    backgroundColor: Colors.BORDER,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  categoryTitle: {
    color: Colors.TEXT_WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    color: Colors.TEXT_GRAY,
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
  
  // Botones Flotantes 
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