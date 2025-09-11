import { AuthService } from '../../core/application/ports/AuthService';
import { User } from '../../core/domain/entities/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Simulación de base de datos (reemplazar por acceso real en producción)
const users: User[] = [
  {
    id: '1',
    email: 'admin@uct.cl',
    passwordHash: bcrypt.hashSync('admin123', 10),
  },
];

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export class AuthServiceImpl implements AuthService {
  async login(email: string, password: string) {
    const user = users.find((u) => u.email === email);
    if (!user) return { error: 'Invalid credentials' };
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return { error: 'Invalid credentials' };
    const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return { token };
  }
}
