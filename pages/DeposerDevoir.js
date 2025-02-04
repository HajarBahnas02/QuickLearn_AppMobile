import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import DocumentPicker from "react-native-document-picker";
import axios from "axios";


const DeposerDevoir = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  // Fonction pour choisir un fichier
  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles], // Accepter tous les types de fichiers
      });
      setSelectedFile(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert("Opération annulée", "Aucun fichier sélectionné.");
      } else {
        console.error(err);
        Alert.alert("Erreur", "Une erreur est survenue lors de la sélection du fichier.");
      }
    }
  };

  const uploadAssignment = async () => {
    if (!selectedFile) {
      Alert.alert("Erreur", "Veuillez d'abord sélectionner un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append("devoirFile", {
      uri: selectedFile.uri,
      type: selectedFile.type,
      name: selectedFile.name,
    });

    try {
      const response = await axios.post("http://100.103.108.58:5000/devoirs/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Alert.alert("Succès", response.data.message);
      setSelectedFile(null); // Réinitialiser après un upload réussi
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de soumettre le devoir. Vérifiez votre connexion.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Déposer votre devoir</Text>
      <Button title="Choisir un fichier" onPress={pickDocument} />
      {selectedFile && (
        <Text style={styles.fileName}>Fichier sélectionné : {selectedFile.name}</Text>
      )}
      <Button
        title="Soumettre le devoir"
        onPress={uploadAssignment}
        color="#28a745"
        disabled={!selectedFile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  fileName: {
    marginTop: 10,
    marginBottom: 20,
    color: "#555",
    fontStyle: "italic",
  },
});

export default DeposerDevoir;
