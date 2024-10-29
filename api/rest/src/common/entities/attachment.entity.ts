import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Type } from '../../types/entities/type.entity';

@Entity()
export class Attachment extends CoreEntity {
  @Column({ nullable: true })
  thumbnail: string;

  @Column({ nullable: true })
  original: string;

  @ManyToOne(() => Type, (type) => type.promotional_sliders)
  promotionalSlidersImage: Type;

  // product image
}
