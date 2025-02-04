import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { LinearGradient } from 'expo-linear-gradient';

const LoginStudent = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [buttonScale] = useState(new Animated.Value(1));
  const [showPassword, setShowPassword] = useState(false); // État pour afficher/masquer le mot de passe

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

    if (!email) {
      setEmailError('Veuillez entrer votre email.');
    }

    if (!password) {
      setPasswordError('Veuillez entrer votre mot de passe.');
    }

    if (!email || !password) {
      return;
    }

    try {
      const response = await fetch('http://100.103.108.63:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        const { role, token } = data; 

        if (!token) {
          setPasswordError('Token non reçu.');
          return;
        }

        await AsyncStorage.setItem('token', token);
        console.log("Token stocké :", token); 

        if (role === 'etudiant') {
          navigation.navigate('EspaceEtudiant');
        } else {
          setPasswordError('Rôle inconnu.');
        }
      } else {
        setPasswordError(data.message || 'Identifiants invalides.');
      }
    } catch (error) {
      console.error('Erreur de connexion réseau :', error);
      setPasswordError('Une erreur s\'est produite, veuillez réessayer plus tard.');
    }
  };

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Image source={require('./../assets/images/student.jpg')} style={styles.image} />
      <Text style={styles.title}>Bienvenue dans l'Espace Étudiant</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Mot de passe"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword} // Basculer entre afficher/masquer le mot de passe
            value={password}
            onChangeText={setPassword}
            cursorColor="#3D85C6" // Curseur personnalisé pour le mot de passe
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)} // Basculer l'état
          >
            <Icon
              name={showPassword ? 'eye-slash' : 'eye'} // Changer l'icône en fonction de l'état
              size={20}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      </View>
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            animateButtonPress();
            handleLogin();
          }}
        >
          <LinearGradient
            colors={['#4CAF50', '#45a049']} // Nouveau dégradé de vert
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>Se connecter</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={styles.registerLink}
      >
        <Text style={styles.registerText}>Mot de passe oublié ? Se souvenir</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    backgroundColor: '#fff',
    padding: 30,
    
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    elevation: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: '#FF5A5F',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    overflow: 'hidden', // Pour que le dégradé respecte les bordures
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginLeft: 4,
    marginTop: 15,
  },
  gradient: {
    
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    paddingLeft : 60,
    paddingRight : 60,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 15,
  },
  registerText: {
    color: '#007BFF',
    fontSize: 16,
    alignItems: 'center',
    textAlign : 'center',
  },
  image: {
    width: 350,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 15,
   
  },
});

export default LoginStudent;