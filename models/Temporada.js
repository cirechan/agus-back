const mongoose = require('mongoose');

const TemporadaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  activa: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Temporada', TemporadaSchema);
