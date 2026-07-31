import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  BeforeInsert,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'uuid',
    unique: true,
  })
  uuid!: string;

  @Column({
    default: true,
  })
  is_active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn()
  deleted_at!: Date | null;

  @Column({
    nullable: true,
  })
  created_by!: number;

  @Column({
    nullable: true,
  })
  updated_by!: number;

  @BeforeInsert()
  generateUuid() {
    if (!this.uuid) {
      this.uuid = uuid();
    }
  }
}
