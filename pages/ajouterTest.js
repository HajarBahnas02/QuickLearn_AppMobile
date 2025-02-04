import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AjouterTestScreen = ({ navigation }) => {
  const [qcmName, setQcmName] = useState('');
  const [question, setQuestion] = useState('');
  const [choices, setChoices] = useState([]);
  const [newChoice, setNewChoice] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [questionsList, setQuestionsList] = useState([]);
  const [duration, setDuration] = useState(30);

  const addChoice = () => {
    if (!newChoice.trim()) {
      Alert.alert('Erreur', 'Le choix ne peut pas être vide.');
      return;
    }
    setChoices([...choices, newChoice]);
    setNewChoice('');
  };

  const addQuestion = () => {
    if (!question.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir une question.');
      return;
    }
    if (choices.length < 2) {
      Alert.alert('Erreur', 'Ajoutez au moins deux choix.');
      return;
    }
    if (correctAnswer === null) {
      Alert.alert('Erreur', 'Veuillez sélectionner une réponse correcte.');
      return;
    }

    const newQuestion = {
      question,
      choices: [...choices],
      correctAnswer,
    };

    setQuestionsList([...questionsList, newQuestion]);

    setQuestion('');
    setChoices([]);
    setCorrectAnswer(null);
  };

  const saveTest = async () => {
    if (!qcmName.trim()) {
      Alert.alert('Erreur', 'Veuillez donner un nom au QCM.');
      return;
    }
    if (questionsList.length === 0) {
      Alert.alert('Erreur', 'Ajoutez au moins une question au QCM.');
      return;
    }
    if (duration <= 0) {
      Alert.alert('Erreur', 'La durée du test doit être supérieure à 0 minute.');
      return;
    }

    const completeQCM = {
      qcmName,
      questions: questionsList.map((question) => ({
        question: question.question,
        choices: question.choices,
        correctAnswer: question.correctAnswer,
      })),
      duration: parseInt(duration),
    };

    console.log("Données envoyées :", JSON.stringify(completeQCM, null, 2));

    try {
      const response = await fetch('http://100.103.108.58:5000/api/qcms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeQCM),
      });

      const textResponse = await response.text();
      console.log('Réponse brute du serveur:', textResponse);

      if (response.ok) {
        try {
          const data = JSON.parse(textResponse);
          console.log('QCM sauvegardé sur le serveur :', data);
          Alert.alert('Succès', `Le QCM "${qcmName}" a été sauvegardé avec succès.`);
          setQcmName('');
          setQuestionsList([]);
          setDuration(30);
          navigation.goBack();
        } catch (e) {
          console.error('Erreur de parsing JSON:', e);
          Alert.alert('Erreur', 'La réponse du serveur n\'est pas un JSON valide.');
        }
      } else {
        console.error('Erreur serveur:', textResponse);
        Alert.alert('Erreur', `Une erreur est survenue lors de l’enregistrement : ${textResponse}`);
      }
    } catch (error) {
      console.error('Erreur lors de la requête :', error);
      Alert.alert('Erreur', 'Impossible de se connecter au serveur.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>NOUVEAU QCM</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom du QCM"
        value={qcmName}
        onChangeText={setQcmName}
      />

      <View style={styles.durationContainer}>
        <Text style={styles.subTitle}>Durée du test (en minutes) :</Text>
        <TextInput
          style={styles.input}
          placeholder="Durée en minutes"
          value={duration.toString()}
          onChangeText={(text) => {
            const newDuration = parseInt(text) || 0;
            setDuration(newDuration);
          }}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.questionContainer}>
        <TextInput
          style={styles.input}
          placeholder="Saisissez la question"
          value={question}
          onChangeText={setQuestion}
        />

        {choices.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.choiceItem, correctAnswer === index && styles.correctChoice]}
            onPress={() => setCorrectAnswer(index)}
          >
            <Text style={styles.choiceText}>{item}</Text>
            {correctAnswer === index && (
              <Ionicons name="checkmark-circle" size={24} color="#28a745" />
            )}
          </TouchableOpacity>
        ))}
       
      </View>

      <View style={styles.choiceContainer}>
        <TextInput
          style={styles.choiceInput}
          placeholder="Saisissez un choix"
          value={newChoice}
          onChangeText={setNewChoice}
        />
        <TouchableOpacity style={styles.addButton} onPress={addChoice}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addQuestionButton} onPress={addQuestion}>
        <Text style={styles.addQuestionButtonText}>Ajouter la question</Text>
      </TouchableOpacity>

      <Text style={styles.subTitle}>Questions ajoutées :</Text>
      {questionsList.map((item, index) => (
        <View key={index} style={styles.questionItem}>
          <Text style={styles.questionText}>
            {index + 1}. {item.question}
          </Text>
        </View>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={saveTest}>
        <Text style={styles.saveButtonText}>Enregistrer le QCM</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f4f8', // Gris clair pour fond
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4a90e2', // Bleu
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d1d1', // Gris clair pour bordure
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff', // Fond blanc
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  durationContainer: {
    marginBottom: 5,
  },
  questionContainer: {
    marginBottom: 20,
  },
  choiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  choiceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d1d1', // Gris clair
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#4a90e2', // Bleu pour bouton d'ajout
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: '#ccc', // Gris clair
    borderRadius: 35,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  correctChoice: {
    borderColor: '#28a745',
    backgroundColor: '#e8f5e9',
  },
  choiceText: {
    fontSize: 16,
    color: '#000',
  },
  addQuestionButton: {
    backgroundColor: '#4a90e2', // Bleu
    padding: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addQuestionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  questionItem: {
    padding: 12,
    borderWidth: 2,
    borderColor: '#28a745', // Vert
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  questionText: {
    fontSize: 16,
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#ea266d', // Rose
    padding: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AjouterTestScreen;
