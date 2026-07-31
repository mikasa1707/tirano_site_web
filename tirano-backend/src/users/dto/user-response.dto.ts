import { User } from '../entities/user.entity';

export class UserResponseDto {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  photo?: string;
  role: string;
  created_at: Date;

  constructor(user: User) {
    this.id = user.id;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.email = user.email;
    this.photo = user.photo;
    this.role = user.role;
    this.created_at = user.created_at;
  }
}
