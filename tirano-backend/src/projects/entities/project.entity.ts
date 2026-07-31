import { Entity, Column, OneToMany } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';

import { Media } from '../../media/entities/media.entity';

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
    nullable: true,
  })
  realizationDate?: Date;

  @Column({
    default: true,
  })
  active!: boolean;

  @OneToMany(() => Media, (media) => media.project, {
    cascade: true,
  })
  medias!: Media[];
}
