import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('messages')
export class Message extends BaseEntity {
  @Column()
  fullname!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  subject!: string;

  @Column('text')
  message!: string;

  @Column({ default: false })
  isRead!: boolean;
}
