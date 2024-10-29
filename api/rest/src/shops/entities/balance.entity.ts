import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Shop } from './shop.entity';
import { PaymentInfo } from './payment-info.entity';
import { CoreEntity } from 'src/common/entities/core.entity';

@Entity()
export class Balance extends CoreEntity {
  @Column({ nullable: true })
  id: number;

  @Column({ nullable: true })
  admin_commission_rate: number;

  @OneToOne(() => Shop, (shop) => shop.balance)
  @JoinColumn()
  shop: Shop;

  @Column({ nullable: true })
  total_earnings: number;

  @Column({ nullable: true })
  withdrawn_amount: number;

  @Column({ nullable: true })
  current_balance: number;

  @OneToOne(() => PaymentInfo, (paymentInfo) => paymentInfo.balance)
  @JoinColumn()
  payment_info: PaymentInfo;
}
