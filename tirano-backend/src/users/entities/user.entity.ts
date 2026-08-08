import { Entity, Column, OneToMany } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { Media } from 'src/media/entities/media.entity';

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

@Entity('users')
export class User extends BaseEntity {
  @Column()
  firstname!: string;

  @Column()
  lastname!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  password!: string;

  @Column({
    nullable: true,
  })
  photo?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({
    type: 'enum',
    enum: UserJob,
    default: UserJob.OTHER,
  })
  job!: UserJob;

  @Column({
    nullable: true,
  })
  refreshToken?: string;

  @OneToMany(() => Media, (media) => media.user, {
    cascade: true,
  })
  medias!: Media[];
}
