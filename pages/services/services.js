import api from '../api/api';

// Récupérer les classes d'un professeur
export const fetchClasses = async () => {
  try {
    const response = await api.get('/classes/professeur');
    return response.data.classes;
  } catch (error) {
    console.error('Erreur lors de la récupération des classes:', error.response?.data || error.message);
    throw error;
  }
};
export const deleteClass = async (classId) => {
  try {
    const response = await api.delete(`/classes/supprimer/${classId}`); // Utilisez des backticks
    return response.data; // Retourne la réponse du serveur (message et classe supprimée)
  } catch (error) {
    throw new Error(`Erreur lors de la suppression de la classe: ${error.message}`);
  }
};