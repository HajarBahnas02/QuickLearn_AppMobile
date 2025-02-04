import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import LoginStudentScreen from './pages/loginStudent';
import LoginProfScreen from './pages/loginProf';
import EspaceProfScreen from './pages/espaceProf';
import Accueil from './pages/Accueil';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import EspaceEtudiant from './pages/espaceEtudiant';
import ProfileScreen from './pages/ProfileScreen';
import PasserTestScreen from './pages/PasserTestScreen';
import addTestScreen from './pages/ajouterTest';
import TestScreen from './pages/TestScreen';
import AjouterCarteScreen from './pages/ajouterCarte'; // Importation de la page AjouterCarte

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Onglets pour les étudiants
function EspaceEtudiantTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Test') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        headerLeft: () => (
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}  // Retour à l'écran précédent
            style={{ marginLeft: 10 }}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={EspaceEtudiant} options={{ title: 'Espace Étudiant' }} />
      <Tab.Screen name="Profil" component={ProfileScreen} options={{ title: 'Profil' }} />
      <Tab.Screen name="Test" component={PasserTestScreen} options={{ title: 'Test' }} />
    </Tab.Navigator>
  );
}

// Onglets pour les professeurs
function EspaceProfTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AjouterTest') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        headerLeft: () => (
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}  // Retour à l'écran précédent
            style={{ marginLeft: 10 }}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={EspaceProfScreen} options={{ title: 'Espace Professeur' }} />
      <Tab.Screen name="AjouterTest" component={addTestScreen} options={{ title: 'Ajouter Test' }} />
      <Tab.Screen name="Profil" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
}

// Application principale
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Accueil">
        <Stack.Screen
          name="Accueil"
          component={Accueil}
          options={{ title: 'Accueil' }}
        />
        <Stack.Screen
          name="LoginStudentScreen"
          component={LoginStudentScreen}
          options={{ title: 'Login Étudiant' }}
        />
        <Stack.Screen
          name="LoginProfScreen"
          component={LoginProfScreen}
          options={{ title: 'Login Professeur' }}
        />
        <Stack.Screen
          name="EspaceEtudiant"
          component={EspaceEtudiantTab}
          options={{ headerShown: false }}  // Pas d'en-tête pour les onglets
        />
        <Stack.Screen
          name="EspaceProfScreen"
          component={EspaceProfTab}
          options={{ headerShown: false }}  // Pas d'en-tête pour les onglets
        />
        <Stack.Screen
          name="TestScreen"
          component={TestScreen}
          options={{ title: 'Détails du Test' }}
        />
        <Stack.Screen
          name="AjouterCarteScreen"
          component={AjouterCarteScreen}
          options={{ title: 'Ajouter Carte' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
