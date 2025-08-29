const BaseRepository = require('./BaseRepository');
const User = require('../models/User');

class UserRepo extends BaseRepository {
  constructor() {
    super(User);
  }

  // Específicos de dominio
  async findByEmail(email, options = {}) {
    let query = this.model.findOne({ email: email.toLowerCase() });
    if (options.select) query = query.select(options.select);
    if (options.populate) query = query.populate(options.populate);
    if (options.lean) query = query.lean(options.lean === true ? {} : options.lean);
    return query.exec();
  }

  async findByRut(rut, options = {}) {
    let query = this.model.findOne({ rut: rut ? rut.toUpperCase() : rut });
    if (options.select) query = query.select(options.select);
    if (options.populate) query = query.populate(options.populate);
    if (options.lean) query = query.lean(options.lean === true ? {} : options.lean);
    return query.exec();
  }

  async findActivos(options = {}) {
    return this.find({ activo: true }, options);
  }
}

module.exports = new UserRepo();
module.exports.UserRepo = UserRepo;
