const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombreUsuario: {
    type: String,
    required: true,
    unique: true
  },
  rol: {
    type: String,
    required: true,
    enum: ['Entrenador', 'Coordinador', 'Administrador'],
    default: 'Entrenador'
  },
  equipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
