import { Address } from 'src/addresses/entities/address.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { Profile } from './profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Permission } from 'shop-shared/dist/auth';
import { Review } from "../../reviews/entities/review.entity";

@Entity()
export class User extends CoreEntity {
  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password?: string;

  @Column({ nullable: true })
  shop_id?: number;

  @Column({ type: 'simple-array' })
  permissions: Permission[];

  @Column({ nullable: true, default: true })
  is_active?: boolean;

  @Column({ nullable: true })
  email_verified_at?: Date;

  @OneToMany(() => Address, (address) => address.customer)
  address?: Address[];

  @OneToOne(() => Profile, (profile) => profile.customer, {
    cascade: true,
  })
  profile: Profile;

  @OneToOne(() => Shop, (shop) => shop.owner)
  shops?: Shop;

  @ManyToOne(() => Shop, (shop) => shop.staffs)
  @JoinColumn()
  managed_shop?: Shop;

  @OneToMany(() => Review, (review) => review.user)
  reviews?: Review[];

  // orders?: Order[];
}
