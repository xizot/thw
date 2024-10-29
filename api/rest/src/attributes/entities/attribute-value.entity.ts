import { CoreEntity } from "src/common/entities/core.entity";
import { Attribute } from "./attribute.entity";
import { Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { Product } from "../../products/entities/product.entity";

@Entity()
export class AttributeValue extends CoreEntity {

  @Column()
  value: string;

  @Column({ nullable: true })
  meta?: string;

  @ManyToOne(() => Attribute, (attribute) => attribute.values, { onDelete: "CASCADE" })
  attribute: Attribute;

  @ManyToMany(() => Product, (product) => product.variations)
  products?: Product[];
}
