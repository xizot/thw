import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Shop } from './shop.entity';
import { Balance } from './balance.entity';

@Entity()
export class PaymentInfo extends CoreEntity {
  @Column({ nullable: true })
  account: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  bank: string;

  @OneToOne(() => Shop, (shop) => shop.paymentInfo)
  @JoinColumn()
  shop: Shop;

  @OneToOne(() => Balance, (balance) => balance.payment_info, { cascade: true })
  balance: Balance;
}
