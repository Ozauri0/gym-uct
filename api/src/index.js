// Exports de Domain
const User = require('./src/domain/entities/User');
const Email = require('./src/domain/value-objects/Email');
const HashedPassword = require('./src/domain/value-objects/HashedPassword');

// Exports de Application
const RegisterUser = require('./src/application/use-cases/RegisterUser');
const AuthenticateUser = require('./src/application/use-cases/AuthenticateUser');
const RefreshSession = require('./src/application/use-cases/RefreshSession');
const Logout = require('./src/application/use-cases/Logout');
const RequestPasswordReset = require('./src/application/use-cases/RequestPasswordReset');
const ResetPassword = require('./src/application/use-cases/ResetPassword');

const PasswordPolicy = require('./src/application/policies/PasswordPolicy');
const SecurityPolicy = require('./src/application/policies/SecurityPolicy');

// Exports de Infrastructure
const SystemClock = require('./src/infrastructure/adapters/SystemClock');
const BcryptHasher = require('./src/infrastructure/adapters/BcryptHasher');
const JwtTokenService = require('./src/infrastructure/adapters/JwtTokenService');

module.exports = {
  // Domain
  entities: {
    User
  },
  valueObjects: {
    Email,
    HashedPassword
  },
  
  // Application
  useCases: {
    RegisterUser,
    AuthenticateUser,
    RefreshSession,
    Logout,
    RequestPasswordReset,
    ResetPassword
  },
  policies: {
    PasswordPolicy,
    SecurityPolicy
  },
  
  // Infrastructure
  adapters: {
    SystemClock,
    BcryptHasher,
    JwtTokenService
  }
};
