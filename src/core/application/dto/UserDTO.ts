export interface UserDTO {
  id: string;
  email: string;
  nombre: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}
