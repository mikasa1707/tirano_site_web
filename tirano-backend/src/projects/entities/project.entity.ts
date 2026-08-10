import { Entity, Column, OneToMany } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { Media } from '../../media/entities/media.entity';

export enum ProjectStatus {
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  A_VENIR = 'A_VENIR',
}

@Entity('projects')
export class Project extends BaseEntity {
  @Column()
  title!: string;

  @Column({
    type: 'text',
  })
  description!: string;

  @Column({
    nullable: true,
  })
  client?: string;

  @Column({
    nullable: true,
  })
  location?: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  realizationDate?: Date;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.A_VENIR,
  })
  status!: ProjectStatus;

  @Column({
    default: true,
  })
  active!: boolean;

  @OneToMany(() => Media, (media) => media.project, {
    cascade: true,
  })
  medias!: Media[];
}