const jwt = require('jsonwebtoken');
const PRIVATE_KEY = "cQ0qlbilGGZPF8pU";

module.exports = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1]; // Extraire le token

  console.log('Token reçu:', token);  // Log du token reçu

  if (!token) {
    return res.status(403).json({ message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, PRIVATE_KEY);
    console.log('Token décodé:', decoded);  // Log du token décodé
    req.user = decoded;  
    next();
  } catch (err) {
    console.error('Erreur lors de la vérification du token:', err);  // Log d'erreur
    return res.status(401).json({ message: 'Token invalide' });
  }
};