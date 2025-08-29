const BaseRepository = require('./BaseRepository');
const Reserva = require('../models/Reserva');

class ReservaRepo extends BaseRepository {
  constructor() {
    super(Reserva);
  }

  // Conveniencia: siempre que se solicite populate por defecto usuario y sala
  async findById(id, options = {}) {
    const defaultPopulate = [
      { path: 'usuario', select: 'name email role activo' },
      { path: 'sala', select: 'nombre sector capacidad activa' }
    ];
    const populate = options.populate || defaultPopulate;
    return super.findById(id, { ...options, populate });
  }

  async find(filter = {}, options = {}) {
    const defaultPopulate = [
      { path: 'usuario', select: 'name email role activo' },
      { path: 'sala', select: 'nombre sector capacidad activa' }
    ];
    const populate = options.populate || defaultPopulate;
    return super.find(filter, { ...options, populate });
  }

  // Específicos de dominio
  async findByUsuario(userId, options = {}) {
    return this.find({ usuario: userId }, options);
  }

  async findBySala(salaId, options = {}) {
    return this.find({ sala: salaId }, options);
  }

  async findConflictos({ salaId, inicio, fin }, options = {}) {
    // detecta reservas con solapamiento en el rango dado
    return this.find({
      sala: salaId,
      estado: 'reservada',
      $or: [
        { inicio: { $lt: fin }, fin: { $gt: inicio } }, // cualquier solape
      ]
    }, options);
  }
}

module.exports = new ReservaRepo();
module.exports.ReservaRepo = ReservaRepo;
