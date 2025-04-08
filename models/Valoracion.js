const mongoose = require('mongoose');

const ValoracionSchema = new mongoose.Schema({
  jugador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jugador',
    required: true
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  valoracionTecnica: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  valoracionTactica: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  valoracionFisica: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  valoracionActitudinal: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comentarios: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Valoracion', ValoracionSchema);
