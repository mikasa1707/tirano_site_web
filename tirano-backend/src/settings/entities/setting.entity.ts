import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Media } from '../../media/entities/media.entity';

@Entity('settings')
export class Setting extends BaseEntity {
  @Column()
  siteName!: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  facebook?: string;

  @Column({ nullable: true })
  instagram?: string;

  @Column({ nullable: true })
  linkedin?: string;

  @Column({ nullable: true })
  youtube?: string;

  @Column({ default: false })
  maintenance!: boolean;

  @OneToMany(() => Media, (media) => media.setting)
  medias!: Media[];
}
