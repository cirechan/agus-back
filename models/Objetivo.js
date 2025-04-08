const mongoose = require('mongoose');

const ObjetivoSchema = new mongoose.Schema({
  equipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  },
  temporada: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Temporada',
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true,
    enum: ['Cuantitativo', 'Cualitativo']
  },
  estado: {
    type: String,
    required: true,
    enum: ['Pendiente', 'EnProgreso', 'Cumplido', 'NoCumplido'],
    default: 'Pendiente'
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Objetivo', ObjetivoSchema);
