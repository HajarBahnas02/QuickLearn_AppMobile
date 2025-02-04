import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PasserTestScreen = ({ navigation }) => {
  const [qcms, setQcms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQcms = async () => {
      try {
        const response = await fetch('http://100.103.108.58:5000/api/qcms');
        const data = await response.json();
        if (data.qcms) {
          setQcms(data.qcms);
        }
      } catch (error) {
        setError('Erreur lors de la récupération des QCM');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQcms();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6a1b9a" />
        <Text style={styles.loadingText}>Chargement des QCM...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Tester vos connaissances</Text>
      {qcms.length > 0 ? (
        qcms.map((qcm) => (
          <TouchableOpacity
            key={qcm._id}
            style={styles.qcmCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('TestScreen', { qcmId: qcm._id })}
          >
           <LinearGradient
  colors={['#6a1b9a', '#00bcd4']}
  style={styles.gradientBackground}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
  <Text style={styles.qcmName}>{qcm.qcmName}</Text>
</LinearGradient>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noQcmText}>Aucun QCM disponible pour le moment. Revenez plus tard !</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6a1b9a',
  },
  qcmCard: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  gradientBackground: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qcmName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  noQcmText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6a1b9a',
  },
  errorText: {
    fontSize: 16,
    color: '#e53935',
    textAlign: 'center',
  },
});

export default PasserTestScreen;