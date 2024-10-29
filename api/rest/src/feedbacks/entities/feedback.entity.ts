import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Feedback extends CoreEntity {
  @ManyToOne(() => User)
  @JoinColumn()
  customer: User;

  @Column({ nullable: false })
  model_type: string;

  @Column({ nullable: false })
  model_id: string;

  @Column({ nullable: true })
  positive?: boolean;

  @Column({ nullable: true })
  negative?: boolean;
}
