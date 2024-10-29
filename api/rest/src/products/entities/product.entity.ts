import { AttributeValue } from "src/attributes/entities/attribute-value.entity";
import { Category } from "src/categories/entities/category.entity";
import { Attachment } from "src/common/entities/attachment.entity";
import { CoreEntity } from "src/common/entities/core.entity";
import { Order } from "src/orders/entities/order.entity";
import { Shop } from "src/shops/entities/shop.entity";
import { Tag } from "src/tags/entities/tag.entity";
import { Type } from "src/types/entities/type.entity";
import { Review } from "../../reviews/entities/review.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, ManyToOne, OneToMany, JoinTable } from "typeorm";
import { Utils } from "../../utils/Utils";
import { Variation } from "./variation.entity";
import { Manufacturer } from "../../manufacturers/entities/manufacturer.entity";

export enum ProductStatus {
  PUBLISH = "publish",
  DRAFT = "draft",
}

export enum ProductType {
  SIMPLE = "simple",
  VARIABLE = "variable",
}

@Entity()
export class Product extends CoreEntity {

  @Column()
  name: string;

  @Column()
  slug: string;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      this.slug = Utils.buildSlug(this.name);
    }
  }

  @ManyToOne(() => Type, (type) => type.products, { onDelete: "CASCADE" })
  type: Type;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.products, { onDelete: "CASCADE" })
  manufacturer: Manufacturer;

  @Column({
    type: "enum",
    enum: ProductType,
    default: ProductType.SIMPLE
  })
  product_type: ProductType;

  @ManyToMany(() => Category, (category) => category.products, {
    cascade: true
  })
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => Tag, (tag) => tag.products, {
    cascade: true
  })
  @JoinTable()
  tags?: Tag[];

  @ManyToMany(() => AttributeValue, (attributeValue) => attributeValue.products, {
    cascade: true
  })
  @JoinTable()
  variations?: AttributeValue[];


  @OneToMany(() => Variation, (variation) => variation.product, { cascade: true })
  variation_options?: Variation[];

  // pivot?: OrderProductPivot;
  // orders?: Order[];

  @ManyToOne(() => Shop, (shop) => shop.products, { onDelete: "CASCADE" })
  shop: Shop;

  // related_products?: Product[];

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ default: false })
  in_stock: boolean;

  @Column({ default: false })
  is_taxable: boolean;

  @Column({ nullable: true })
  sale_price?: number;

  @Column({ nullable: true })
  max_price?: number;

  @Column({ nullable: true })
  min_price?: number;

  @Column({ nullable: true })
  sku?: string;

  // gallery?: Attachment[];

  @Column({ nullable: true })
  image?: string;

  @Column({
    type: "enum",
    enum: ProductStatus,
    default: ProductStatus.DRAFT
  })
  status: ProductStatus;

  @Column({ nullable: true })
  height?: string;

  @Column({ nullable: true })
  length?: string;

  @Column({ nullable: true })
  width?: string;

  @Column({ nullable: true })
  price?: number;

  @Column()
  quantity: number;

  @Column()
  unit: string;

  @Column({ nullable: true })
  ratings: number;

  @Column({ default: false })
  in_wishlist: boolean;

  @OneToMany(() => Review, (review) => review.product)
  my_review?: Review[];

  @Column({ nullable: true })
  language?: string;

  @Column("simple-array", { nullable: true })
  translated_languages?: string[];
}

export class OrderProductPivot {
  variation_option_id?: number;
  order_quantity: number;
  unit_price: number;
  subtotal: number;
}

export class File extends CoreEntity {
  attachment_id: number;
  url: string;
  fileable_id: number;
}
