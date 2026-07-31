import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Media } from '../../media/entities/media.entity';

@Entity('testimonials')
export class Testimonial extends BaseEntity {
  @Column()
  name!: string;

  @Column({ nullable: true })
  role?: string;

  @Column('text')
  message!: string;

  @Column({ default: true })
  active!: boolean;

  @OneToMany(() => Media, (media) => media.testimonial)
  medias!: Media[];
}
