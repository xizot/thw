import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
export class CoreEntity {
  @PrimaryGeneratedColumn()
  id: number | string;

  @Column({ nullable: true, default: new Date() })
  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true, default: new Date() })
  @UpdateDateColumn()
  updated_at: Date;
}
