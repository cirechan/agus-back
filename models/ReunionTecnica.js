const mongoose = require('mongoose');

const ReunionTecnicaSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  participantes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario'
    }],
    default: []
  },
  acta: {
    type: String,
    required: true
  },
  acuerdos: {
    type: String
  },
  equiposInvolucrados: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipo'
    }],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ReunionTecnica', ReunionTecnicaSchema);
