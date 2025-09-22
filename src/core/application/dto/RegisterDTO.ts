export interface RegisterDTO {
  email: string;
  password: string;
  nombre: string;
  role?: 'alumno' | 'staff';
}
