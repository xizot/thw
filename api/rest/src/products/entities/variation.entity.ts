import { VariationOption } from "./variationOption.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { CoreEntity } from "../../common/entities/core.entity";
import { Product } from "./product.entity";

@Entity()
export class Variation extends CoreEntity {

  @Column()
  title: string;

  @Column()
  price: number;

  @Column()
  sku: string;

  @Column({ default: false })
  is_disable: boolean;

  @Column({ default: false })
  is_digital: boolean;

  @Column()
  sale_price?: number;

  @Column()
  quantity: number;

  @OneToMany(() => VariationOption, (variationOption) => variationOption.variation, { cascade: true })
  options: VariationOption[];

  @ManyToOne(() => Product, (product) => product.variation_options, { onDelete: "CASCADE" })
  product: Product;
}