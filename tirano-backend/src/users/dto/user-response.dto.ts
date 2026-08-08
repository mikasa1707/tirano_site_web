import { User } from '../entities/user.entity';

export class UserResponseDto {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  job?: string;
  active?: boolean;
  medias: any[];
  created_at: Date;
  updated_at: Date;

  constructor(user: User) {
    this.id = user.id;

    this.firstname = user.firstname;

    this.lastname = user.lastname;

    this.email = user.email;

    this.role = user.role;

    this.job = user.job;

    this.active = user.is_active;

    this.medias = user.medias ?? [];

    this.created_at = user.created_at;

    this.updated_at = user.updated_at;
  }
}
