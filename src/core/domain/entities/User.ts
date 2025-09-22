export interface IUser {
  id: string;
  email: string;
  nombre: string;
  role: 'alumno' | 'staff' | 'admin';
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export class User implements IUser {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly nombre: string,
    public readonly role: 'alumno' | 'staff' | 'admin',
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly lastLogin?: Date
  ) {}

  static fromJSON(data: any): User {
    return new User(
      data.id,
      data.email,
      data.nombre,
      data.role,
      data.isActive, 
      new Date(data.createdAt),
      data.lastLogin ? new Date(data.lastLogin) : undefined
    );
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  isStaff(): boolean {
    return this.role === 'staff' || this.role === 'admin';
  }
}