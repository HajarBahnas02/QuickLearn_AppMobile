import React, { useState, useEffect } from 'react';

const TestList = ({ onTestSelect }) => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const fetchTests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://192.168.0.1:5000/api/qcms');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des tests');
      }
      const data = await response.json();
      setTests(data.qcms);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  if (loading) {
    return <p style={styles.loading}>Chargement en cours...</p>;
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.error}>Erreur : {error}</p>
        <button style={styles.button} onClick={fetchTests}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Tests Disponibles</h2>
      <p style={styles.subtitle}>
        Sélectionnez un test pour évaluer vos connaissances et améliorer vos compétences.
      </p>
      <ul style={styles.list}>
        {tests.map((test) => (
          <li
            key={test._id}
            style={{
              ...styles.listItem,
              ...(hoveredItem === test._id && styles.listItemHover),
            }}
            onClick={() => onTestSelect(test)}
            onMouseEnter={() => setHoveredItem(test._id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {test.qcmName}
          </li>
        ))}
      </ul>
      <button style={styles.button} onClick={fetchTests}>
        Recharger la liste
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#eef6ff',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '700px',
    margin: '40px auto',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '20px',
  },
  list: {
    listStyle: 'none',
    padding: '0',
    margin: '0 0 20px 0',
  },
  listItem: {
    padding: '15px',
    marginBottom: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    fontSize: '18px',
    color: '#333',
  },
  listItemHover: {
    backgroundColor: '#dcefff',
    transform: 'scale(1.03)',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  buttonHover: {
    backgroundColor: '#1668c1',
  },
  loading: {
    fontSize: '18px',
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    textAlign: 'center',
  },
  error: {
    fontSize: '18px',
    color: '#d32f2f',
    marginBottom: '10px',
  },
};

export default TestList;
