const mongoose = require('mongoose');

const AsistenciaSchema = new mongoose.Schema({
  jugador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jugador',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  asistio: {
    type: Boolean,
    required: true,
    default: true
  },
  motivoAusencia: {
    type: String
  },
  observaciones: {
    type: String
  }
}, {
  timestamps: true
});

// Índice compuesto para evitar duplicados de asistencia para un jugador en una fecha
AsistenciaSchema.index({ jugador: 1, fecha: 1 }, { unique: true });

module.exports = mongoose.model('Asistencia', AsistenciaSchema);
