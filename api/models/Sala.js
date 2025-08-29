const mongoose = require('mongoose');

const SalaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la sala es obligatorio'],
    unique: true,
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  sector: {
    type: String,
    enum: {
      values: ['pesas', 'maquinas'],
      message: 'El sector {VALUE} no es válido'
    },
    required: [true, 'El sector es obligatorio'],
    index: true
  },
  capacidad: {
    type: Number,
    required: [true, 'La capacidad es obligatoria'],
    min: [1, 'Capacidad mínima 1'],
    max: [200, 'Capacidad máxima 200']
  },
  ubicacion: {
    type: String,
    trim: true,
    maxlength: [120, 'La ubicación no puede exceder 120 caracteres']
  },
  activa: {
    type: Boolean,
    default: true
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [200, 'La descripción no puede exceder 200 caracteres']
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índices
SalaSchema.index({ nombre: 1 }, { unique: true, collation: { locale: 'es', strength: 2 } });
SalaSchema.index({ sector: 1, activa: 1 });

module.exports = mongoose.model('Sala', SalaSchema);

