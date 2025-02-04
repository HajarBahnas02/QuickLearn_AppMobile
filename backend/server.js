const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();  // Charger les variables d'environnement depuis le fichier .env
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const authMiddleware = require('./middlewares/authMiddleware');  // Assurez-vous que le middleware est bien dans ce dossier
const Class = require('./models/classModel');  // Assurez-vous que ce modèle existe
const User = require('./models/UserModel');
const app = express();
const port = 5000;
const PRIVATE_KEY = "cQ0qlbilGGZPF8pU";
const MONGODB_URI="mongodb+srv://hajarbahnas:cQ0qlbilGGZPF8pU@cluster0.bvzhw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const multer = require('multer');
const QCM = require('./models/qcmModel');
const qcmRoutes = require('./routes/qcmRoutes'); // Importez les routes QCM

app.use('/api/qcm', qcmRoutes);
// Middleware d'authentification (exemple)

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Accès non autorisé' });

  try {
    const user = jwt.verify(token, PRIVATE_KEY); // Vérifiez votre secret JWT
    req.user = user; // Associez les données utilisateur à req.user
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token invalide' });
  }
}
// Configurer le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Dossier où les fichiers seront enregistrés
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Nom unique pour éviter les conflits
  }
});

// Initialiser multer
const upload = multer({ storage });

app.use(express.json());

// Connexion à MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Exemple de login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur par son email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Identifiants incorrects' });
    }

    // Comparer le mot de passe fourni avec le mot de passe haché stocké
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants incorrects' });
    }

    // Générer un token JWT en incluant l'ID de l'utilisateur dans la payload
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // Ajouter user._id ici
      PRIVATE_KEY,
      { expiresIn: '3h' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
      email: user.email,
      role: user.role,
      prenom: user.prenom,
      id: user._id  // Retourner l'ID aussi dans la réponse
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Exemple de route d'enregistrement
app.post('/api/register', async (req, res) => {
    const { nom, prenom, email, role, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'L\'email est déjà utilisé' });
    }

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors du hachage du mot de passe' });
        }

        const newUser = new User({
            nom,
            prenom,
            email,
            password: hashedPassword,
            role,
            id: Math.floor(Math.random() * 10000)
        });

        try {
            await newUser.save();
            res.status(201).json({ message: 'Utilisateur enregistré avec succès', user: newUser });
        } catch (error) {
            res.status(400).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur', error });
        }
    });
});


app.post('/api/classes', authMiddleware, upload.single('fichier'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const professorId = req.user.id;

    if (!name || !description) {
      return res.status(400).json({ message: 'Le nom et la description sont requis.' });
    }

    // Créer la classe avec le chemin du fichier
    const newClass = new Class({
      name,
      description,
      professorId,
      route_fichier: req.file ? req.file.path : null // Ajouter le chemin du fichier
    });

    const savedClass = await newClass.save();
    res.status(201).json({ message: 'Classe créée avec succès', class: savedClass });
  } catch (error) {
    console.error('Erreur lors de la création de la classe:', error);
    res.status(500).json({ message: 'Erreur interne du serveur', error });
  }
});
app.use('/uploads', express.static('uploads'));
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/api/classes', authMiddleware, async (req, res) => {
  try {
    // Récupérer toutes les classes avec leurs informations
    const classes = await Class.find();

    res.status(200).json({
      message: 'Liste des classes récupérée avec succès',
      classes, // Cela inclut automatiquement route_fichier si présent
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des classes:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur',
      error: error.message,
    });
  }
});
//affichage des classes pour les étudiants
app.get('/api/classes/public', async (req, res) => {
  try {
    // Utilise `.populate()` pour joindre les données de l'utilisateur
    const classes = await Class.find().populate({
      path: 'professorId', // Chemin à peupler
      select: 'nom prenom email', // Champs à inclure dans la réponse
    });

    res.status(200).json({ message: 'Classes récupérées avec succès', classes });
  } catch (error) {
    console.error('Erreur lors de la récupération des classes :', error);
    res.status(500).json({ message: 'Erreur interne du serveur', error });
  }
});
app.get('/api/classes/professeur', authenticateToken, async (req, res) => {
  try {
    const professorId = req.user.id; // ID extrait du token

    // Vérifie si le professorId est défini
    if (!professorId) {
      return res.status(400).json({ message: 'Utilisateur non identifié.' });
    }

    const classes = await Class.find({ professorId }); // Filtre par professorId

    if (!classes.length) {
      return res.status(404).json({ message: 'Aucune classe trouvée.' });
    }

    res.json({ classes });
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});
app.delete('/api/classes/supprimer/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedClass = await Class.findByIdAndDelete(id);

    if (!deletedClass) {
      return res.status(404).json({ message: "Classe introuvable" });
    }

    res.status(200).json({ message: "Classe supprimée avec succès", deletedClass });
  } catch (error) {
    console.error("Erreur lors de la suppression de la classe :", error);
    res.status(500).json({ message: "Erreur interne du serveur", error });
  }
});
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

      res.json({
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role
      });
  } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error });
  }
});
// Routes
app.get('/api/qcm', async (req, res) => {
  try {
    const qcms = await QCM.find(); // Récupérer tous les QCM de la base
    if (!qcms || qcms.length === 0) {
      return res.status(404).json({ message: "Aucun QCM disponible pour l'instant." });
    }

    res.status(200).json({ 
      message: "Liste des QCM récupérée avec succès.", 
      qcms 
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des QCM :", error);
    res.status(500).json({ 
      message: "Erreur interne du serveur.", 
      error: error.message 
    });
  }
});

// Route POST pour ajouter un QCM
app.post('/api/qcm', authenticateToken, async (req, res) => {
  try {
    const { title, questions } = req.body; // Assurez-vous que le body contient les données nécessaires

    if (!title || !questions) {
      return res.status(400).json({ message: 'Le titre et les questions sont requis.' });
    }

    // Créer un nouvel objet QCM
    const newQCM = new QCM({
      title,
      questions,
      creatorId: req.user.id  // L'ID de l'utilisateur connecté, extrait du token
    });

    const savedQCM = await newQCM.save();
    res.status(201).json({
      message: 'QCM créé avec succès',
      qcm: savedQCM
    });
  } catch (error) {
    console.error("Erreur lors de la création du QCM :", error);
    res.status(500).json({
      message: "Erreur interne du serveur.",
      error: error.message
    });
  }
});

//logout 
app.post('/api/logout', authenticateToken, (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  blacklistedTokens.add(token);  // Ajoute le token à la liste noire
  res.status(200).json({ message: "Déconnexion réussie !" });
});

// Lancer le serveur
app.use('/api/qcms', qcmRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});