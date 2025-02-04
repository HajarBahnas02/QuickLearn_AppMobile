import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const loginProf = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [buttonScale] = useState(new Animated.Value(1));
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        navigation.navigate('EspaceProfScreen');
      }
    };

    checkToken();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setEmailError('');
    setPasswordError('');
    if (!email) {
      setEmailError('Veuillez entrer votre email.');
    } else if (!validateEmail(email)) {
      setEmailError('Adresse email invalide.');
    }

    if (!password) {
      setPasswordError('Veuillez entrer votre mot de passe.');
    }

    if (!email || !password || !validateEmail(email)) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://100.103.108.58:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        const { role, token } = data;
        await AsyncStorage.setItem('token', token);
        const storedToken = await AsyncStorage.getItem('token');
        console.log('Token stocké :', storedToken);

        if (role === 'professeur') {
          navigation.navigate('EspaceProfScreen');
        } else {
          setPasswordError('Rôle inconnu.');
        }
      } else {
        setPasswordError(data.message || 'Identifiants invalides.');
      }
    } catch (error) {
      console.error('Erreur de connexion réseau :', error);

      if (error.response && error.response.status === 401) {
        setPasswordError('Email ou mot de passe incorrect.');
      } else {
        setPasswordError('Une erreur s\'est produite. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
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
      <Image source={require('./../assets/images/prof.png')} style={styles.image} />
      <Text style={styles.title}>Bienvenue dans l'Espace Professeur</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          cursorColor="#007BFF"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>
      <View style={styles.inputContainerPassword}>
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIcon}
        >
          <Icon
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              animateButtonPress();
              handleLogin();
            }}
          >
            <Text style={styles.buttonText}>Se connecter</Text>
          </TouchableOpacity>
        )}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#4A4A4A',
    textAlign: 'center',
    letterSpacing: 1,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  inputContainerPassword: {
    width: '100%',
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 55,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  errorText: {
    color: '#FF4D4F',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#45a049',
    width: '100%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    paddingLeft : 120,
    paddingRight : 110,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
   
  },
  registerLink: {
    marginTop: 20,
  },
  registerText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '500',
  },
  image: {
    width: 250,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  loadingContainer: {
    backgroundColor: '#2563EB',
    width: '100%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
});

export default loginProf;