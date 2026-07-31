import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';

import { MediasType } from '../enums/media-type.enum';
import { SiteService } from 'src/site-services/entities/site-service.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Product } from 'src/products/entities/product.entity';
import { Testimonial } from 'src/testimonials/entities/testimonial.entity';
import { Setting } from 'src/settings/entities/setting.entity';
import { Article } from 'src/articles/entities/article.entity';

@Entity('media')
export class Media extends BaseEntity {
  @Column()
  filename!: string;

  @Column()
  originalName!: string;

  @Column()
  path!: string;

  @Column()
  mimeType!: string;

  @Column({
    type: 'enum',
    enum: MediasType,
  })
  type!: MediasType;

  @Column({
    nullable: true,
  })
  size!: number;

  @Column({
    nullable: true,
  })
  url!: string;

  @Column({
    nullable: true,
  })
  description!: string;

  @ManyToOne(() => SiteService, (service) => service.medias, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  siteService?: SiteService;

  @ManyToOne(() => Project, (project) => project.medias, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  project?: Project;

  @ManyToOne(() => Product, (product) => product.medias, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  product?: Product;

  @ManyToOne(() => Testimonial, (testimonial) => testimonial.medias, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  testimonial?: Testimonial;

  @ManyToOne(() => Setting, (setting) => setting.medias, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  setting?: Setting;

  @ManyToOne(() => Article, (article) => article.medias, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  article?: Article;
}
