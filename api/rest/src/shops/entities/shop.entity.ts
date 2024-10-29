import { Address } from 'src/addresses/entities/address.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { ShopSettings } from './shop-setting.entity';
import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Balance } from './balance.entity';
import { PaymentInfo } from './payment-info.entity';
import { Attribute } from "../../attributes/entities/attribute.entity";
import { Product } from "../../products/entities/product.entity";
import { Review } from "../../reviews/entities/review.entity";

@Entity()
export class Shop extends CoreEntity {
  @OneToMany(() => User, (user) => user.managed_shop)
  staffs?: User[];

  @Column({ nullable: false, default: true })
  is_active: boolean;

  @OneToOne(() => Balance, (balance) => balance.shop)
  balance?: Balance;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  cover_image: string;

  @Column({ nullable: true })
  logo?: string;

  @OneToOne(() => Address, (address) => address.shop)
  address: Address;

  @OneToOne(() => ShopSettings, (shopSettings) => shopSettings.shop)
  settings?: ShopSettings;

  @ManyToOne(() => User, (user) => user.shops)
  @JoinColumn()
  owner: User;

  @OneToOne(() => PaymentInfo, (paymentInfo) => paymentInfo.shop)
  paymentInfo: PaymentInfo;

  @OneToMany(() => Attribute, (attribute) => attribute.shop)
  attributes?: Attribute[];

  @OneToMany(() => Product, (product) => product.shop)
  products?: Product[];

  @OneToMany(() => Review, (review) => review.shop)
  reviews?: Review[];
}
