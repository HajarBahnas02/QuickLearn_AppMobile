import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = ({ navigation }) => {
    const [profile, setProfile] = useState(null);
    const [imageUri, setImageUri] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    navigation.navigate('Login');
                    return;
                }

                const response = await fetch('http://100.103.108.63:5000/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();

                if (data.error) {
                    Alert.alert('Erreur', data.error);
                    navigation.navigate('Login');
                    return;
                }

                setProfile(data);
            } catch (error) {
                Alert.alert('Erreur', 'Une erreur est survenue lors de la récupération du profil');
            }
        };

        fetchProfile();
    }, []);

    const selectImage = async () => {
        launchImageLibrary({}, async (response) => {
            if (response.assets && response.assets.length > 0) {
                const uri = response.assets[0].uri;
                setImageUri(uri);
                await AsyncStorage.setItem('profileImage', uri);
                Alert.alert('Succès', 'Image de profil mise à jour avec succès!');
            }
        });
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        navigation.navigate('Accueil');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Zone colorée réduite en largeur avec bordures arrondies */}
            <View style={styles.header}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={imageUri ? { uri: imageUri } : require('./../assets/images/acceuil.png')}
                        style={styles.profileImage}
                    />
                    {/* Bouton d'édition à côté de l'image */}
                    <TouchableOpacity style={styles.editButton} onPress={selectImage}>
                        <Icon name="edit" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.profileName}>
                    {profile ? `${profile.nom} ${profile.prenom}` : 'Nom non disponible'}
                </Text>
                <Text style={styles.profileRole}>
                    {profile ? profile.role : 'Chargement...'}
                </Text>
            </View>

            {/* Informations personnelles */}
            {profile && (
                <View style={styles.infoContainer}>
                    <Text style={styles.sectionTitle}>Informations personnelles</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Nom :</Text>
                        <Text style={styles.value}>{profile.nom}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Prenom :</Text>
                        <Text style={styles.value}>{profile.prenom}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Email :</Text>
                        <Text style={styles.value}>{profile.email}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Rôle :</Text>
                        <Text style={styles.value}>{profile.role}</Text>
                    </View>
                </View>
            )}

            {/* Bouton de déconnexion */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Déconnexion</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f7f9fc',
        alignItems: 'center',
        paddingVertical: 30,
    },
    header: {
        width: '90%',
        backgroundColor: '#4A90E2',
        paddingVertical: 20,
        alignItems: 'center',
        borderRadius: 20, // Ajout des bords arrondis sur tous les côtés
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    profileImageContainer: {
        position: 'relative',
        marginTop: -50,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#fff',
    },
    editButton: {
        position: 'absolute',
        bottom: 5,
        right: -5,
        backgroundColor: '#FF5A5F',
        borderRadius: 20,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
    },
    profileRole: {
        fontSize: 14,
        color: '#d9e5f5',
        marginTop: 5,
    },
    infoContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4A90E2',
        marginBottom: 15,
        
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: '#666',
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 10,
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: '#FF5A5F',
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    logoutButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default ProfileScreen;
