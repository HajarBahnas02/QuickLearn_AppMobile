const express = require('express');
const { createClass } = require('../controllers/classController');
const { authenticateJWT, verifyProfessor } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.post('/', authenticateJWT, verifyProfessor, upload.single('fichier'), createClass);

module.exports = router;