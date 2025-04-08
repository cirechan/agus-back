const mongoose = require('mongoose');

const JugadorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  apellidos: {
    type: String,
    required: true
  },
  fechaNacimiento: {
    type: Date,
    required: true
  },
  posicion: {
    type: String,
    required: true,
    enum: ['Portero', 'Defensa', 'Centrocampista', 'Delantero']
  },
  equipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  },
  dorsal: {
    type: Number
  },
  observaciones: {
    type: String
  },
  foto: {
    type: String // URL o ruta a la imagen
  },
  temporadasAnteriores: {
    type: [{
      temporada: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Temporada'
      },
      equipo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipo'
      }
    }],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Jugador', JugadorSchema);
