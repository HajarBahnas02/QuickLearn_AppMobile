const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  choices: { type: [String], required: true },
  correctAnswer: { type: Number, required: true } // Index de la réponse correcte
});

const qcmSchema = new mongoose.Schema({
  qcmName: { type: String, required: true },
  questions: [questionSchema], 
  duration: { type: Number, required: true } 
});

const QCM = mongoose.model('QCM', qcmSchema);

module.exports = QCM;
