import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Instance Axios
const api = axios.create({
  baseURL: 'http://100.103.108.58:5000/api', // Remplacez par l'URL de votre backend
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Préfixe 'Bearer' requis par la norme JWT
 
    }
      return config;
    },
    (error) => Promise.reject(error)
  );
  

export default api;