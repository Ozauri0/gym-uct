const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Identificación institucional
  rut: {
    type: String,
    trim: true,
    match: [
      /^[0-9]{7,8}-[0-9kK]{1}$/,
      'Por favor ingresa un RUT válido (formato: 12345678-9)'
    ]
  },

  // Datos básicos
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/i,
      'Por favor ingresa un email válido'
    ]
  },
  hashedPassword: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },

  // Info académica
  carrera: {
    type: String,
    trim: true
  },

  // Rol y estado
  role: {
    type: String,
    enum: {
      values: ['alumno', 'trabajador', 'administrador', 'user', 'admin'],
      message: 'El rol {VALUE} no es válido'
    },
    default: 'alumno',
    required: true
  },
  activo: {
    type: Boolean,
    default: true
  },

  // Control de reservas por semana
  reservasSemanales: {
    type: Number,
    default: 0,
    min: [0, 'Las reservas semanales no pueden ser negativas'],
    max: [2, 'Máximo 2 reservas por semana']
  },

  // Auditoría
  ultimoAcceso: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índices
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ rut: 1 }, { unique: true, sparse: true });
UserSchema.index({ role: 1, activo: 1 });
UserSchema.index({ name: 1 });

// Métodos
UserSchema.methods.puedeReservar = function() {
  return this.reservasSemanales < 2 && this.activo;
};

// Estáticos
UserSchema.statics.buscarPorRut = function(rut) {
  return this.findOne({ rut: rut.toUpperCase() });
};

module.exports = mongoose.model('User', UserSchema);
