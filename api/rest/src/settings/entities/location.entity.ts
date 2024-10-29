import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { ShopSettings } from 'src/shops/entities/shop-setting.entity';

@Entity()
export class Location extends CoreEntity {
  @Column({ type: 'float' })
  lat: number;

  @Column({ type: 'float' })
  lng: number;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  zip?: string;

  @Column({ nullable: true })
  formattedAddress: string;

  @OneToOne(() => ShopSettings, (shopSettings) => shopSettings.location)
  @JoinColumn()
  shopSettings: ShopSettings;
}
