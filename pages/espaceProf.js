import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Modal,
  Alert,
  Image,
  Linking,
  Animated,Button,
} from 'react-native';
import { fetchClasses, deleteClass } from './services/services';
import Icon from 'react-native-vector-icons/FontAwesome';

const EspaceProf = ({ navigation }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const fadeInAnim = useRef(new Animated.Value(0)).current;

  // Couleurs et images associées aux classes
  const classColors = ['#FFB6C1', '#ADD8E6', '#90EE90', '#FFD700', '#FFA07A'];
  const classImages = [
    'https://via.placeholder.com/160/FFB6C1',
    'https://via.placeholder.com/160/ADD8E6',
    'https://via.placeholder.com/160/90EE90',
    'https://via.placeholder.com/160/FFD700',
    'https://via.placeholder.com/160/FFA07A',
  ];

  const getClasses = async () => {
    try {
      const fetchedClasses = await fetchClasses();
      setClasses(fetchedClasses);
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      setError(`Erreur: ${err.message || "Impossible de récupérer les classes."}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getClasses();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    getClasses();
  };

  const handleDeleteClass = async (classId) => {
    // Boîte de dialogue de confirmation
    Alert.alert(
      'Confirmer la suppression',
      'Êtes-vous sûr de vouloir supprimer cette classe ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteClass(classId);
              setClasses(classes.filter((item) => item._id !== classId));
              Alert.alert('Succès', 'La classe a été supprimée avec succès.');
              setSelectedClassId(null); // Réinitialiser la sélection après suppression
            } catch (err) {
              Alert.alert('Erreur', `Impossible de supprimer la classe: ${err.message}`);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleLongPress = (classId) => {
    setSelectedClassId(classId); // Activer la sélection de la classe
  };

  const handleChoice = (choice) => {
    setModalVisible(false);
    if (choice === 'class') {
      navigation.navigate('AjouterCarteScreen');
    } else if (choice === 'test') {
      navigation.navigate('TestScreen');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (classes.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Aucune classe disponible pour le moment.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Liste des Classes</Text>

      <FlatList
        data={classes}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => {
          const backgroundColor = classColors[index % classColors.length];
          const imageUri = classImages[index % classImages.length];
          const isSelected = selectedClassId === item._id;

          return (
            <Card
              item={item}
              backgroundColor={backgroundColor}
              imageUri={imageUri}
              isSelected={isSelected}
              onLongPress={() => handleLongPress(item._id)}
              onDelete={() => handleDeleteClass(item._id)}
            />
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0000ff']} />
        }
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Icon name="plus" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisissez une action :</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleChoice('class')}
            >
              <Text style={styles.modalButtonText}>Ajouter une nouvelle classe</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleChoice('test')}
            >
              <Text style={styles.modalButtonText}>Ajouter un nouveau test</Text>
            </TouchableOpacity>
            <Button title="Annuler" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Composant Card avec animations
const Card = ({ item, backgroundColor, imageUri, isSelected, onLongPress, onDelete }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={onLongPress}
      activeOpacity={0.9}
    >
      <Animated.View style={[styles.card, { backgroundColor, transform: [{ scale: scaleAnim }] }]}>
        {isSelected && (
          <TouchableOpacity style={styles.trashIcon} onPress={onDelete}>
            <Icon name="trash" size={24} color="#ff4444" />
          </TouchableOpacity>
        )}
        <View style={styles.cardTop}>
          <Image
            alt="class-image"
            resizeMode="cover"
            style={styles.cardImg}
            source={{ uri: imageUri }}
          />
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
          {item.route_fichier && (
            <TouchableOpacity
              onPress={() => Linking.openURL(`http://100.103.108.58:5000/${item.route_fichier}`)}
            >
              <Text style={styles.cardFile}>📄 Télécharger le fichier</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginVertical: 20,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  /** Card */
  card: {
    position: 'relative',
    width: '90%',
    borderRadius: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e6e6e6',
  },
  cardTop: {
    width: '100%',
    height: 180,
    backgroundColor: '#d9e4f5',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardBody: {
    padding: 16,
    backgroundColor: '#fdfdfd',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    marginBottom: 12,
  },
  cardFile: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
  trashIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ea266d',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#ea266d',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EspaceProf;