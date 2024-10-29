import { CoreEntity } from "../../common/entities/core.entity";
import { Attachment } from "../../common/entities/attachment.entity";
import { Type } from "../../types/entities/type.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import slugify from "slugify";
import { ShopSocials } from "../../settings/entities/shop-social.entity";
import { Utils } from '../../utils/Utils';
import { Product } from "../../products/entities/product.entity";

@Entity()
export class Manufacturer extends CoreEntity {

  @Column({ type: "text", nullable: true })
  description?: string;


  @Column({ default: true })
  is_approved?: boolean;

  @Column()
  name: string;

  @Column({ nullable: true })
  products_count?: number;

  @Column()
  slug?: string;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      this.slug = Utils.buildSlug(this.name);
    }
  }

  @OneToMany(() => ShopSocials, (shopSocials) =>
    shopSocials.manufacturer, { nullable: true, cascade: true })
  socials?: ShopSocials[];

  @ManyToOne(() => Type, (type) => type.manufacturer, { onDelete: "CASCADE" })
  type: Type;

  @Column({ nullable: true })
  website?: string;

  @Column({ nullable: true })
  language?: string;

  @Column("simple-array", { nullable: true })
  translated_languages?: string[];

  @OneToMany(() => Product, (product) => product.type)
  products: Product[];

  // image?: Attachment;
  // cover_image?: Attachment;
}
