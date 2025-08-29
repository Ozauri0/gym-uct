const BaseRepository = require('./BaseRepository');
const Sala = require('../models/Sala');

class SalaRepo extends BaseRepository {
  constructor() {
    super(Sala);
  }

  async findActivas(options = {}) {
    return this.find({ activa: true }, options);
  }

  async findBySector(sector, options = {}) {
    return this.find({ sector }, options);
  }
}

module.exports = new SalaRepo();
module.exports.SalaRepo = SalaRepo;
