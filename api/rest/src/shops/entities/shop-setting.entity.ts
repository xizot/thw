import { CoreEntity } from 'src/common/entities/core.entity';
import { Location } from 'src/settings/entities/location.entity';
import { ShopSocials } from 'src/settings/entities/shop-social.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Shop } from './shop.entity';

@Entity()
export class ShopSettings extends CoreEntity {
  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  contact: string;

  @OneToOne(() => Location, (location) => location.shopSettings, {
    cascade: true,
  })
  location: Location;

  @OneToMany(() => ShopSocials, (socials) => socials.shopSettings, {
    cascade: true,
  })
  socials: ShopSocials[];

  @OneToOne(() => Shop, (shopSettings) => shopSettings.settings)
  @JoinColumn()
  shop: Shop;
}
