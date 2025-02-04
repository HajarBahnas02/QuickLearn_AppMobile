import React, { useState } from 'react'; 
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AjouterCarte({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [isPickingFile, setIsPickingFile] = useState(false);

  const handlePickFile = async () => {
    if (isPickingFile) return;
    setIsPickingFile(true);
    try {
      console.log('Début de la sélection du fichier');
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      console.log('Résultat du DocumentPicker:', JSON.stringify(result, null, 2));

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const selectedFile = {
          uri: asset.uri,
          name: asset.name || 'file.pdf',
          type: asset.mimeType || 'application/pdf',
        };

        setFile(selectedFile);
        console.log('Fichier sélectionné :', selectedFile);
        Alert.alert('Succès', `Fichier sélectionné : ${selectedFile.name}`);
      } else {
        console.warn('Aucun fichier sélectionné ou opération annulée.');
        Alert.alert('Annulé', 'Aucun fichier sélectionné ou opération annulée.');
      }
    } catch (error) {
      console.error('Erreur lors de la sélection du fichier:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner un fichier.');
    } finally {
      setIsPickingFile(false);
    }
  };

  const handleAddClass = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    if (!file || !file.uri) {
      Alert.alert('Erreur', 'Veuillez sélectionner un fichier valide.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Erreur', 'Utilisateur non authentifié.');
        return;
      }
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('fichier', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      });
      const response = await fetch('http://100.103.108.58:5000/api/classes', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Succès', 'Classe créée avec succès.');
        navigation.goBack();
      } else {
        const errorData = await response.json();
        Alert.alert('Erreur', errorData.message || 'Impossible de créer la classe.');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      Alert.alert('Erreur', 'Une erreur réseau est survenue.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Créer une nouvelle classe</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom de la classe"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description de la classe"
        value={description}
        onChangeText={setDescription}
      />

      <Button title="Choisir un fichier PDF" onPress={handlePickFile} disabled={isPickingFile} />
      {file && <Text style={styles.fileText}>Fichier sélectionné : {file.name}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleAddClass}>
        <Text style={styles.buttonText}>Créer</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f8ff',  // bleu clair pastel
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4a90e2', // bleu clair
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#a2c4e6',  // bleu plus clair
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 12,
    borderRadius: 8,
    width: '100%',
    backgroundColor: '#e6f0ff',  // fond bleu pâle
  },
  button: {
    backgroundColor: '#4a90e2', // bleu clair
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  fileText: {
    marginTop: 12,
    fontSize: 16,
    color: '#555',
  },
});
