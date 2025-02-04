import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';

export default function Acceuil({ navigation }) {
  return (
    <LinearGradient colors={['#b3d9ff', '#ffffff']} style={styles.container}>
      
      {/* Titre principal avec animation */}
      <Animatable.Text 
        animation="fadeInDown" 
        duration={2000} 
        delay={300} 
        style={styles.welcomeText}
      >
        Bienvenue sur Quick Learn
      </Animatable.Text>

      {/* Animation Lottie */}
      <View style={styles.animationContainer}>
        <LottieView
          source={require('./../assets/animations/Anim-acceuil.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>

      {/* Phrase attractive animée */}
      <Animatable.Text 
        animation="fadeInUp"
        duration={2000}
        delay={500}
        style={styles.attractiveText}
      >
        Apprenez, progressez et réussissez avec{"\n"}
        <Animatable.Text 
          animation="pulse"
          iterationCount="infinite"
          easing="ease-in-out"
          duration={1500}
          style={styles.quickLearnText}
        >
          Quick Learn
        </Animatable.Text>
      </Animatable.Text>

      {/* Boutons animés */}
      <View style={styles.buttonContainer}>
        <Animatable.View animation="bounceIn" delay={700}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('LoginStudentScreen')}
            activeOpacity={0.7}
          >
            <LinearGradient colors={['#00509E', '#003366']} style={styles.gradient}>
              <Icon name="graduation-cap" size={24} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Étudiant</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="bounceIn" delay={900}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('LoginProfScreen')}
            activeOpacity={0.7}
          >
            <LinearGradient colors={['#00509E', '#003366']} style={styles.gradient}>
              <Icon name="book" size={24} color="#fff" style={styles.icon} />
              <Text style={styles.buttonText}>Professeur</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  animationContainer: {
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  attractiveText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 15,
    lineHeight: 28,
  },
  quickLearnText: {
    fontWeight: 'bold',
    color: '#00509E',
    fontSize: 22,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent : 'center',
    marginTop: 20,
  },
  button: {
    borderRadius: 30,
    overflow: 'hidden',
    width: '90%',
    backgroundColor: '#00509E',
    justifyContent: 'center',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  icon: {
    marginRight: 12,
  },
});
