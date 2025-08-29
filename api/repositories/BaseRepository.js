class BaseRepository {
  /**
   * @param {import('mongoose').Model} model - Mongoose model to operate on
   */
  constructor(model) {
    if (!model) throw new Error('Se requiere un modelo de Mongoose para el repositorio');
    this.model = model;
  }

  /**
   * Buscar por id
   * @param {string} id
   * @param {object} options
   * @param {string|object} [options.select]
   * @param {object|string|Array} [options.populate]
   * @param {boolean|object} [options.lean]
   */
  async findById(id, options = {}) {
    let query = this.model.findById(id);
    if (options.select) query = query.select(options.select);
    if (options.populate) query = query.populate(options.populate);
    if (options.lean) query = query.lean(options.lean === true ? {} : options.lean);
    return query.exec();
  }

  /**
   * Buscar documentos
   * @param {object} filter
   * @param {object} options
   * @param {number} [options.limit]
   * @param {number} [options.skip]
   * @param {object|string} [options.sort]
   * @param {string|object} [options.select]
   * @param {object|string|Array} [options.populate]
   * @param {boolean|object} [options.lean]
   */
  async find(filter = {}, options = {}) {
    let query = this.model.find(filter);
    if (options.select) query = query.select(options.select);
    if (options.sort) query = query.sort(options.sort);
    if (typeof options.skip === 'number') query = query.skip(options.skip);
    if (typeof options.limit === 'number') query = query.limit(options.limit);
    if (options.populate) query = query.populate(options.populate);
    if (options.lean) query = query.lean(options.lean === true ? {} : options.lean);
    return query.exec();
  }

  /**
   * Crear documento
   * @param {object} data
   * @param {object} options
   * @param {boolean|object} [options.lean]
   */
  async create(data, options = {}) {
    const doc = await this.model.create(data);
    if (options.lean) {
      return this.model.findById(doc._id).lean(options.lean === true ? {} : options.lean).exec();
    }
    return doc;
  }

  /**
   * Actualizar por id
   * @param {string} id
   * @param {object} data
   * @param {object} options
   * @param {boolean} [options.upsert=false]
   * @param {boolean} [options.newDoc=true]
   * @param {boolean} [options.runValidators=true]
   * @param {string|object} [options.select]
   * @param {object|string|Array} [options.populate]
   * @param {boolean|object} [options.lean]
   */
  async update(id, data, options = {}) {
    const {
      upsert = false,
      newDoc = true,
      runValidators = true,
      select,
      populate,
      lean
    } = options;

    let query = this.model.findByIdAndUpdate(id, data, {
      new: newDoc,
      upsert,
      runValidators
    });

    if (select) query = query.select(select);
    if (populate) query = query.populate(populate);
    if (lean) query = query.lean(lean === true ? {} : lean);

    return query.exec();
  }

  /**
   * Eliminar por id
   * @param {string} id
   */
  async delete(id) {
    return this.model.findByIdAndDelete(id).exec();
  }
}

module.exports = BaseRepository;
