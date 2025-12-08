import { StyleSheet, Dimensions } from 'react-native';
import Colors from './Colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  logoContainer: {
    width: 180,
    height: 180,
    backgroundColor: 'rgba(245, 158, 11, 0.1)', 
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.TEXT_WHITE,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.TEXT_GRAY,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    width: '100%',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: Colors.TEXT_WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
});