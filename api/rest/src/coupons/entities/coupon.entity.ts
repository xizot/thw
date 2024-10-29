import { CouponType } from 'shop-shared/dist/coupon';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Coupon extends CoreEntity {
  @Column({ nullable: false })
  code: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: false })
  minimum_cart_amount: number;

  // @OneToMany(() => Order, o => o.coupon)
  // @JoinColumn()
  // orders?: Order[];

  @Column({
    nullable: false,
    type: 'enum',
    enum: CouponType,
  })
  type: CouponType;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: false })
  is_valid: boolean;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false, type: 'datetime' })
  active_from: Date;

  @Column({ nullable: false, type: 'datetime' })
  expire_at: Date;

  @Column({ nullable: true })
  language?: string;

  @Column({ nullable: true, type: 'simple-array' })
  translated_languages?: string[];

  @ManyToOne(() => Shop)
  @JoinColumn()
  shop: Shop;
}
