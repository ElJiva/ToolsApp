import { StyleSheet } from 'react-native';
import Colors from './Colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
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
    color: Colors.TEXT_WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.CARD_BG,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.TEXT_WHITE,
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  
  // Tarjetas de la lista
  card: {
    backgroundColor: Colors.CARD_BG,
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
    color: Colors.TEXT_WHITE,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDate: {
    color: Colors.TEXT_GRAY,
    fontSize: 12,
  },
  actionIconArea: {
    padding: 5,
  },
  
  // Estados Carga/Vacío
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.TEXT_GRAY,
    marginTop: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
    opacity: 0.7,
  },
  emptyText: {
    color: Colors.TEXT_MUTED,
    fontSize: 16,
    marginTop: 10,
  }
});