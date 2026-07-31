import { Entity, Column, OneToMany } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';

import { Media } from '../../media/entities/media.entity';

import { ArticleType } from '../enums/article-type.enum';

@Entity('articles')
export class Article extends BaseEntity {
  @Column()
  title!: string;

  @Column({
    unique: true,
  })
  slug!: string;

  @Column({
    type: 'text',
  })
  content!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  excerpt?: string;

  @Column({
    type: 'enum',
    enum: ArticleType,
    default: ArticleType.NEWS,
  })
  type!: ArticleType;

  @Column({
    nullable: true,
  })
  source?: string;

  @Column({
    nullable: true,
  })
  publishedAt?: Date;

  @Column({
    default: true,
  })
  active!: boolean;

  @OneToMany(() => Media, (media) => media.article)
  medias!: Media[];
}
