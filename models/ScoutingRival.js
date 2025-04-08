const mongoose = require('mongoose');

const ScoutingRivalSchema = new mongoose.Schema({
  nombreJugador: {
    type: String,
    required: true
  },
  dorsal: {
    type: Number,
    required: true
  },
  equipoRival: {
    type: String,
    required: true
  },
  posicion: {
    type: String,
    required: true,
    enum: ['Portero', 'Defensa', 'Centrocampista', 'Delantero']
  },
  valoracionGeneral: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  observaciones: {
    type: String
  },
  enSeguimiento: {
    type: Boolean,
    default: false
  },
  fechaObservacion: {
    type: Date,
    default: Date.now
  },
  equipoObservador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ScoutingRival', ScoutingRivalSchema);
