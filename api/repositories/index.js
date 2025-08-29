const { UserRepo } = require('./UserRepo');
const { ReservaRepo } = require('./ReservaRepo');
const { SalaRepo } = require('./SalaRepo');

module.exports = {
  UserRepo: new UserRepo(),
  ReservaRepo: new ReservaRepo(),
  SalaRepo: new SalaRepo(),
  // También exportamos las clases por si se desean instancias personalizadas
  Classes: { UserRepo, ReservaRepo, SalaRepo }
};
