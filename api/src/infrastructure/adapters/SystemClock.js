const Clock = require('../../domain/ports/Clock');

/**
 * SystemClock Adapter
 * Implementa el port Clock usando el tiempo del sistema
 */
class SystemClock extends Clock {
  /**
   * Obtiene la fecha/hora actual del sistema
   * @returns {Date}
   */
  now() {
    return new Date();
  }
}

module.exports = SystemClock;
