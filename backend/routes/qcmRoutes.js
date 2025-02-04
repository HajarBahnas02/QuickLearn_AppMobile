const express = require('express');
const router = express.Router();
const QCM = require('../models/qcmModel');

// Route pour créer un QCM (POST)
router.post('/', async (req, res) => {
  try {
    const newQCM = new QCM(req.body);
    await newQCM.save();
    res.status(201).send({ message: 'QCM créé avec succès', qcm: newQCM });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erreur serveur' });
  }
});

// Route pour récupérer tous les QCM (GET)
router.get('/', async (req, res) => {
  try {
    const qcms = await QCM.find(); // Récupérer tous les QCM de la base de données
    if (qcms.length === 0) {
      return res.status(404).send({ message: 'Aucun QCM trouvé' });
    }
    res.status(200).send({ message: 'QCM récupérés avec succès', qcms });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erreur serveur' });
  }
});

// Route pour récupérer un QCM spécifique par son ID (GET)
router.get('/:id', async (req, res) => {
  try {
    const qcm = await QCM.findById(req.params.id); // Récupérer un QCM par son ID
    if (!qcm) {
      return res.status(404).send({ message: 'QCM non trouvé' });
    }
    res.status(200).send({ message: 'QCM récupéré avec succès', qcm });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Erreur serveur' });
  }
});

module.exports = router;