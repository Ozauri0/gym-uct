const Clock = require('../../src/domain/ports/Clock');

/**
 * MockClock
 * Implementación mock del Clock para testing con tiempo controlado
 */
class MockClock extends Clock {
  constructor(initialTime = new Date()) {
    super();
    this.currentTime = new Date(initialTime);
  }

  now() {
    return new Date(this.currentTime);
  }

  // Métodos de utilidad para testing
  setTime(time) {
    this.currentTime = new Date(time);
  }

  advanceTime(milliseconds) {
    this.currentTime = new Date(this.currentTime.getTime() + milliseconds);
  }

  advanceMinutes(minutes) {
    this.advanceTime(minutes * 60 * 1000);
  }

  advanceHours(hours) {
    this.advanceTime(hours * 60 * 60 * 1000);
  }

  advanceDays(days) {
    this.advanceTime(days * 24 * 60 * 60 * 1000);
  }

  reset() {
    this.currentTime = new Date();
  }
}

module.exports = MockClock;
