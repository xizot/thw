import { CoreEntity } from 'src/common/entities/core.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

  export enum AddressType {
    BILLING = 'billing',
    SHIPPING = 'shipping',
  }

  @Entity()
  export class Address extends CoreEntity {
    @Column({ nullable: true })
    title: string;

    @Column({ nullable: false, default: true })
    default: boolean;

    @Column({ nullable: true, type: 'enum', enum: AddressType })
    type: AddressType;

    @Column({ nullable: true })
    street_address: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    zip: string;

    @ManyToOne(() => User, (user) => user.address)
    @JoinColumn()
    customer: User;

    @OneToOne(() => Shop, (shop) => shop.address)
    @JoinColumn()
    shop: Shop;
  }

@Entity()
export class UserAddress extends CoreEntity{
  @Column({ nullable: false })
  street_address: string;
  
  @Column({ nullable: false })
  country: string;
  
  @Column({ nullable: false })
  city: string;
  
  @Column({ nullable: false })
  state: string;
  
  @Column({ nullable: false })
  zip: string;
}
