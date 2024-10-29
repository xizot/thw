import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ShopSettings } from 'src/shops/entities/shop-setting.entity';
import { Manufacturer } from '../../manufacturers/entities/manufacturer.entity';

@Entity()
export class ShopSocials extends CoreEntity {
  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  url: string;

  @ManyToOne(() => ShopSettings, (socials) => socials.socials)
  @JoinColumn()
  shopSettings: ShopSettings;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.socials, {
    onDelete: 'CASCADE',
  })
  manufacturer: Manufacturer;
}
