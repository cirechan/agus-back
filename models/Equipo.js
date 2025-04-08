const mongoose = require('mongoose');

const EquipoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    required: true,
    enum: ['Prebenjamín', 'Benjamín', 'Alevín', 'Infantil', 'Cadete', 'Juvenil', 'Regional']
  },
  temporada: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Temporada',
    required: true
  },
  entrenador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  limiteJugadores: {
    type: Number,
    default: function() {
      // Establecer límite según categoría
      if (this.categoria === 'Prebenjamín' || this.categoria === 'Benjamín') {
        return 15;
      } else {
        return 18;
      }
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Equipo', EquipoSchema);
