const mongoose = require('mongoose');

const PartidoSchema = new mongoose.Schema({
  equipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  },
  rival: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  hora: {
    type: String,
    required: true
  },
  ubicacion: {
    type: String,
    enum: ['casa', 'fuera'],
    required: true
  },
  temporada: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Temporada',
    required: true
  },
  vestuarioLocal: {
    type: Number,
    required: function() {
      return this.ubicacion === 'casa';
    }
  },
  vestuarioVisitante: {
    type: Number,
    required: function() {
      return this.ubicacion === 'casa';
    }
  },
  equipacion: {
    color: {
      type: String,
      enum: ['roja', 'azul', 'blanca', 'negra'],
      required: true
    },
    tipo: {
      type: String,
      enum: ['principal', 'alternativa'],
      default: 'principal'
    }
  },
  campo: {
    type: String,
    required: function() {
      return this.ubicacion === 'fuera';
    }
  },
  resultado: {
    golesLocal: {
      type: Number,
      min: 0
    },
    golesVisitante: {
      type: Number,
      min: 0
    },
    jugado: {
      type: Boolean,
      default: false
    }
  },
  observaciones: {
    type: String
  }
}, {
  timestamps: true
});

// Índice compuesto para evitar duplicados de partidos para un equipo en una fecha/hora
PartidoSchema.index({ equipo: 1, fecha: 1, hora: 1 }, { unique: true });

module.exports = mongoose.model('Partido', PartidoSchema);
