/**
 * Clock Port
 * Define el contrato para obtener tiempo actual (útil para testing)
 */
class Clock {
  /**
   * Obtiene la fecha/hora actual
   * @returns {Date}
   */
  now() {
    throw new Error('Method now must be implemented');
  }
}

module.exports = Clock;
