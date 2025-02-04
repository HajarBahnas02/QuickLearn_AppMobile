const QCM = require('../models/qcmModel');
exports.createQCM = async (req, res) => {
  try {
        console.log('Données reçues (stringify):', JSON.stringify(req.body, null, 2));

    // Vérifier si req.body est un objet
    if (typeof req.body !== 'object') {
      return res.status(400).json({ message: 'Données invalides' });
    }

    const { qcmName, questions } = req.body;

    // Vérification des données (comme dans votre code original)
    if (!qcmName || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Nom du QCM et questions requis.' });
    }

    const newQCM = new QCM({ qcmName, questions });
    await newQCM.save();

    res.status(201).json({ message: 'QCM créé avec succès', qcm: newQCM });
  } catch (error) {
    console.error('Erreur lors de la création du QCM :', error);
    if (error instanceof SyntaxError) {
      return res.status(400).json({ message: 'Données JSON invalides' });
    }
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};