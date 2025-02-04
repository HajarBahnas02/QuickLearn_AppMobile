const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Référence vers User
  route_fichier: { type: String },
});

const Class = mongoose.model('Class', classSchema);
module.exports = Class;
