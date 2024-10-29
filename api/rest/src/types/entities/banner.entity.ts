import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Attachment } from '../../common/entities/attachment.entity';
import { Type } from './type.entity';
import { CoreEntity } from '../../common/entities/core.entity';

@Entity()
export class Banner extends CoreEntity {
  @Column({ nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  image?: string;

  @ManyToOne(() => Type, (type) => type.banners, { onDelete: 'CASCADE' })
  type: Type;
}
