import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Type } from './type.entity';
import { CoreEntity } from '../../common/entities/core.entity';
@Entity()
export class TypeSettings extends CoreEntity {
  @Column()
  isHome: boolean;

  @Column()
  layoutType: string;

  @Column()
  productCard: string;

  @OneToOne(() => Type, (type) => type.settings, { onDelete: 'CASCADE' })
  @JoinColumn()
  Type: Type;
}
