const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReservaSchema = new Schema({
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio'],
    index: true
  },
  sala: {
    type: Schema.Types.ObjectId,
    ref: 'Sala',
    required: [true, 'La sala es obligatoria'],
    index: true
  },
  inicio: {
    type: Date,
    required: [true, 'La hora de inicio es obligatoria'],
    index: true
  },
  fin: {
    type: Date,
    required: [true, 'La hora de término es obligatoria'],
    index: true
  },
  estado: {
    type: String,
    enum: {
      values: ['reservada', 'cancelada', 'asistida'],
      message: 'El estado {VALUE} no es válido'
    },
    default: 'reservada',
    index: true
  },
  cambiosRestantes: {
    type: Number,
    default: 1,
    min: [0, 'No puede ser negativo'],
    max: [1, 'Máximo 1 cambio permitido']
  },
  motivoCancelacion: {
    type: String,
    trim: true,
    maxlength: [200, 'El motivo no puede exceder 200 caracteres']
  }
}, {
  timestamps: true,
  versionKey: false
});

// Validaciones
ReservaSchema.path('fin').validate(function(value) {
  if (!this.inicio || !value) return true;
  return value > this.inicio;
}, 'La hora de término debe ser posterior a la hora de inicio');

ReservaSchema.pre('validate', function(next) {
  if (this.inicio && this.fin) {
    const diffMins = Math.round((this.fin - this.inicio) / (1000 * 60));
    if (diffMins !== 60) {
      this.invalidate('fin', 'La reserva debe ser de 60 minutos');
    }
  }
  next();
});

// Índices
ReservaSchema.index({ usuario: 1, inicio: 1 }, { unique: true, name: 'uniq_usuario_inicio' });
ReservaSchema.index({ sala: 1, inicio: 1 }, { name: 'idx_sala_inicio' });
ReservaSchema.index({ usuario: 1, sala: 1, inicio: 1 }, { name: 'idx_usuario_sala_inicio' });

// Métodos
ReservaSchema.methods.puedeModificar = function() {
  return this.cambiosRestantes > 0 && this.estado === 'reservada';
};

module.exports = mongoose.model('Reserva', ReservaSchema);

