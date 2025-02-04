import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  Text,
  Linking,
  Animated,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

export default function Classes() {
  const navigation = useNavigation();
  const [classes, setClasses] = useState([]);
  const [saved, setSaved] = useState([]);
  const fadeInAnim = useRef(new Animated.Value(0)).current; // Animation de fondu

  // Couleurs et images associées aux classes
  const classColors = ['#FFB6C1', '#ADD8E6', '#90EE90', '#FFD700', '#FFA07A'];
  const classImages = [
    'https://via.placeholder.com/160/FFB6C1',
    'https://via.placeholder.com/160/ADD8E6',
    'https://via.placeholder.com/160/90EE90',
    'https://via.placeholder.com/160/FFD700',
    'https://via.placeholder.com/160/FFA07A',
  ];

  useEffect(() => {
    // Appel de l'API pour récupérer toutes les classes
    fetch('http://100.103.108.58:5000/api/classes/public')
      .then((response) => response.json())
      .then((data) => {
        if (data.classes) {
          setClasses(data.classes);
        }
        // Animation lors du chargement
        Animated.timing(fadeInAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      })
      .catch((error) =>
        console.error('Erreur lors de la récupération des classes:', error)
      );
  }, []);

  const handleSave = (id) => {
    if (saved.includes(id)) {
      setSaved(saved.filter((val) => val !== id));
    } else {
      setSaved([...saved, id]);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <Text style={styles.headerTitle}>Liste des Classes</Text>

      <ScrollView contentContainerStyle={styles.content}>
        {classes.map(({ _id, name, description, route_fichier }, index) => {
          const isSaved = saved.includes(_id);
          const backgroundColor = classColors[index % classColors.length];
          const imageUri = classImages[index % classImages.length];

          return (
            <Card
              key={_id}
              id={_id}
              name={name}
              description={description}
              route_fichier={route_fichier}
              backgroundColor={backgroundColor}
              imageUri={imageUri}
              isSaved={isSaved}
              handleSave={handleSave}
            />
          );
        })}
      </ScrollView>

      {/* Bouton flottant pour accéder aux tests */}
    </SafeAreaView>
  );
}

// Composant Card avec animations
const Card = ({ id, name, description, route_fichier, backgroundColor, imageUri, isSaved, handleSave }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current; // Animation de zoom
  const heartScaleAnim = useRef(new Animated.Value(1)).current; // Animation du cœur

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

  const handleHeartPress = () => {
    Animated.sequence([
      Animated.spring(heartScaleAnim, {
        toValue: 1.2,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(heartScaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
    handleSave(id);
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View style={[styles.card, { backgroundColor, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.cardLikeWrapper}>
          <TouchableOpacity onPress={handleHeartPress}>
            <Animated.View style={{ transform: [{ scale: heartScaleAnim }] }}>
              <FontAwesome
                color={isSaved ? '#ea266d' : '#222'}
                name="heart"
                solid={isSaved}
                size={20}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>

        <View style={styles.cardTop}>
          <Image
            alt="class-image"
            resizeMode="cover"
            style={styles.cardImg}
            source={{ uri: imageUri }}
          />
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{name}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
          {route_fichier && (
            <TouchableOpacity
              onPress={() => Linking.openURL(`http://100.103.108.58:5000/${route_fichier}`)}
            >
              <Text style={styles.cardFile}>📄 Télécharger le fichier</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Composant FloatingButton avec animations
const FloatingButton = ({ onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
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
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Animated.View style={[styles.floatingButton, { transform: [{ scale: scaleAnim }] }]}>
        <FontAwesome name="tasks" size={24} color="#fff" />
      </Animated.View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A90E2",
    textAlign: "center",
    marginVertical: 20,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  /** Card */
  card: {
    position: "relative",
    width: 280,
    height: 280, // Hauteur fixe pour uniformiser les cartes
    borderRadius: 16,
    backgroundColor: "#fff",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  cardLikeWrapper: {
    position: "absolute",
    zIndex: 2,
    top: 12,
    right: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  cardTop: {
    width: "100%",
    height: "50%", // Utiliser la moitié de la carte pour l'image
    backgroundColor: "#d9e4f5",
  },
  cardImg: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardBody: {
    flex: 1, // Remplir l'espace restant de la carte
    padding: 16,
    backgroundColor: "#fdfdfd",
    justifyContent: "space-between", // Espacer le contenu
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    marginBottom: 12,
    flexGrow: 1, // Permettre à la description de prendre plus d'espace si nécessaire
    overflow: "hidden", // Gérer les débordements
    textOverflow: "ellipsis",
  },
  cardFile: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E90FF",
    textDecorationLine: "underline",
  },
  /** Floating Button */
  floatingButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});
