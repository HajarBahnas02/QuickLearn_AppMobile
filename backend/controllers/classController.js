const Class = require('../models/classModel');

exports.createClass = async (req, res) => {
  try {
    console.log('Fichier reçu :', req.file); 
    console.log('Données reçues :', req.body); 

    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier reçu.' });
    }

    const { titre, description } = req.body;
    const route_fichier = `uploads/${req.file.filename.replace(/\\/g, '/')}`;
    const professeur_id = req.user.id; // ID du professeur depuis le token
    const newClass = new Class({ titre, description, route_fichier, professeur_id });
    await newClass.save();
    res.status(201).json({ message: 'Classe créée avec succès', classe: newClass });
  } catch (error) {
    console.error('Erreur lors de la création de la classe :', error);
    res.status(500).json({ message: 'Erreur lors de la création de la classe', error });
  }
};
