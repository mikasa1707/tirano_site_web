import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Media } from '../../media/entities/media.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  name!: string;

  @Column({ nullable: true })
  reference!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: true })
  active!: boolean;

  @Column({ default: 0 })
  price!: number;

  @OneToMany(() => Media, (media) => media.product)
  medias!: Media[];
}
