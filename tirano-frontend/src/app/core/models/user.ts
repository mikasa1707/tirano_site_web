import { Media } from './media';

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  USER = 'USER',
}

export enum UserJob {
  DIRECTOR = 'DIRECTEUR',
  MANAGER = 'MANAGER',
  SECRETARY = 'SECRETAIRE',
  ACCOUNTANT = 'COMPTABLE',
  COMMERCIAL = 'COMMERCIAL',
  TECHNICIAN = 'TECHNICIEN',
  DRIVER = 'CHAUFFEUR',
  OPERATOR = 'OPERATEUR',
  OTHER = 'AUTRE',
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  photo?: string;
  role: UserRole;
  job: UserJob;
  refreshToken?: string;
  medias?: Media[];
  active: boolean;
  created_at?: string;
  updated_at?: string;
}
