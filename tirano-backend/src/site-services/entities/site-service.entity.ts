import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Media } from 'src/media/entities/media.entity';

@Entity('site_services')
export class SiteService extends BaseEntity {
  @Column()
  title!: string;

  @Column({
    type: 'text',
  })
  description!: string;

  @Column({
    nullable: true,
  })
  shortDescription?: string;

  @Column({
    default: true,
  })
  active!: boolean;

  @OneToMany(() => Media, (media) => media.siteService)
  medias!: Media[];
}
