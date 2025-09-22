// Exports de Domain
const User = require('./domain/entities/User');
const Email = require('./domain/value-objects/Email');
const HashedPassword = require('./domain/value-objects/HashedPassword');

// Exports de Application
const RegisterUser = require('./application/use-cases/RegisterUser');
const AuthenticateUser = require('./application/use-cases/AuthenticateUser');
const RefreshSession = require('./application/use-cases/RefreshSession');
const Logout = require('./application/use-cases/Logout');
const RequestPasswordReset = require('./application/use-cases/RequestPasswordReset');
const ResetPassword = require('./application/use-cases/ResetPassword');

const PasswordPolicy = require('./application/policies/PasswordPolicy');
const SecurityPolicy = require('./application/policies/SecurityPolicy');

// Exports de Infrastructure
const SystemClock = require('./infrastructure/adapters/SystemClock');
const BcryptHasher = require('./infrastructure/adapters/BcryptHasher');
const JwtTokenService = require('./infrastructure/adapters/JwtTokenService');

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
