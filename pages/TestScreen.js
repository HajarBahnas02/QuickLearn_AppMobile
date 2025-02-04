import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Modal, 
  Pressable 
} from 'react-native';
import LottieView from 'lottie-react-native'; // Importer Lottie

const TestScreen = ({ route, navigation }) => {
  const { qcmId } = route.params; // Récupérer l'ID du QCM
  const [qcm, setQcm] = useState(null); // État pour stocker le QCM
  const [loading, setLoading] = useState(true); // État pour gérer le chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs
  const [timeLeft, setTimeLeft] = useState(0); // Temps restant en secondes
  const [userAnswers, setUserAnswers] = useState([]); // Réponses de l'étudiant
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false); // État pour afficher l'animation
  const [isResultModalVisible, setIsResultModalVisible] = useState(false); // État pour afficher le modal de résultat

  // Animation de vibration pour le timer
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Appel API pour récupérer les détails du QCM
  useEffect(() => {
    const fetchQcm = async () => {
      try {
        const response = await fetch(`http://100.103.108.58:5000/api/qcms/${qcmId}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du QCM');
        }
        const data = await response.json();
        console.log("Données QCM récupérées :", data); // Log pour vérifier les données
        if (data.qcm) {
          setQcm(data.qcm);
          setTimeLeft(data.qcm.duration * 60); // Initialiser le temps restant
        } else {
          throw new Error('Aucun QCM trouvé');
        }
      } catch (error) {
        setError(error.message);
        console.error("Erreur d'API :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQcm();
  }, [qcmId]);

  // Compte à rebours
  useEffect(() => {
    if (!qcm) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [qcm]);

  // Animation de vibration lorsque le temps est critique
  useEffect(() => {
    if (timeLeft <= 30 && timeLeft > 0) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [timeLeft]);

  // Gérer la fin du temps
  useEffect(() => {
    if (timeLeft === 0 && qcm) {
      handleSubmit(); // Soumettre automatiquement le QCM
    }
  }, [timeLeft]);

  // Enregistrer les réponses de l'étudiant
  const handleAnswerSelection = (questionIndex, choiceIndex) => {
    setUserAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[questionIndex] = choiceIndex;
      return newAnswers;
    });
  };

  // Calculer le score
  const calculateScore = () => {
    let correctAnswers = 0;
    qcm.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    const totalQuestions = qcm.questions.length;
    const score = (correctAnswers / totalQuestions) * 100;
    return { correctAnswers, totalQuestions, score };
  };

  // Soumettre le QCM
  const handleSubmit = () => {
    const { correctAnswers, totalQuestions, score } = calculateScore();
    setShowSuccessAnimation(true);

    // Afficher le modal après l'animation
    setTimeout(() => {
      setShowSuccessAnimation(false);
      setIsResultModalVisible(true);
    }, 3000); // Durée de l'animation
  };

  // Fermer le modal de résultat
  const closeModal = () => {
    setIsResultModalVisible(false);
    navigation.goBack();
  };

  if (loading) {
    return <Text>Chargement en cours...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!qcm || !qcm.questions || !Array.isArray(qcm.questions)) {
    return <Text>Aucun QCM trouvé ou les données sont invalides</Text>;
  }

  // Convertir le temps restant en minutes et secondes
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <View style={styles.container}>
      {/* Barre de progression fixe en haut */}
      <View style={styles.fixedProgressBarContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: `${(timeLeft / (qcm.duration * 60)) * 100}%`,
              backgroundColor:
                timeLeft > 60
                  ? '#4caf50'
                  : timeLeft > 30
                  ? '#ff9800'
                  : '#f44336',
              transform: [{ translateX: shakeAnim }],
            },
          ]}
        />
      </View>

      {/* Nom du QCM fixe en haut */}
      <View style={styles.fixedHeader}>
        <Text style={styles.qcmTitle}>{qcm.qcmName}</Text>
        <Text style={styles.timerText}>Temps restant : {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</Text>
      </View>

      {/* ScrollView pour les questions */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {qcm.questions.map((question, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.question}</Text>
            {question.choices.map((choice, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.choiceButton,
                  userAnswers[index] === i && question.correctAnswer === i
                    ? styles.correctChoice
                    : userAnswers[index] === i
                    ? styles.incorrectChoice
                    : null,
                ]}
                onPress={() => handleAnswerSelection(index, i)}
                disabled={timeLeft === 0}
              >
                <Text style={styles.choiceText}>{choice}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Bouton de soumission */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={timeLeft > 0 ? false : true}>
          <Text style={styles.submitButtonText}>Soumettre</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Animation de réussite */}
      {showSuccessAnimation && (
        <LottieView
          source={require('../assets/animations/Animation.json')} // Assurez-vous d'avoir un fichier JSON d'animation
          autoPlay
          loop={false}
          style={styles.animation}
        />
      )}

      {/* Modal de résultat */}
      <Modal visible={isResultModalVisible} transparent animationType="fade">
  <Pressable style={styles.modalOverlay} onPress={closeModal}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Résultat du test :</Text>
      <Text style={styles.modalText}>
        Vous avez répondu correctement à {calculateScore().correctAnswers} sur {qcm.questions.length} questions.
      </Text>
      <Text style={styles.modalText}>
        Score :{" "}
        <Text style={[styles.scoreText, { fontWeight: "bold", color: "red" }]}>
          {calculateScore().score.toFixed(2)}%
        </Text>
      </Text>
      <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
        <Text style={styles.modalButtonText}>OK</Text>
      </TouchableOpacity>
    </View>
  </Pressable>
</Modal>

    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  fixedProgressBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: '#e0e0e0',
    zIndex: 1,
  },
  progressBar: {
    height: '100%',
  },
  fixedHeader: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
  },
  qcmTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
  },
  timerText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  scrollContent: {
    paddingTop: 120,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  questionContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#374151',
  },
  choiceButton: {
    padding: 14,
    marginVertical: 6,
    backgroundColor: '#e0f2f1',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b2dfdb',
  },
  correctChoice: {
    backgroundColor: '#4caf50',
    borderColor: '#388e3c',
  },
  incorrectChoice: {
    backgroundColor: '#f44336',
    borderColor: '#d32f2f',
  },
  choiceText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#004d40',
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: '#2196f3',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  animation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
   modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5, // Ombrage sur Android
    shadowColor: '#000', // Ombrage sur iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    maxWidth: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 20,
    color: 'red',
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: '#2196f3',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignSelf: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
export default TestScreen;