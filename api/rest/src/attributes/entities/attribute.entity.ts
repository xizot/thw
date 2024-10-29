import { CoreEntity } from "src/common/entities/core.entity";
import { Shop } from "src/shops/entities/shop.entity";
import { AttributeValue } from "./attribute-value.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Utils } from "../../utils/Utils";

@Entity()
export class Attribute extends CoreEntity {
  @Column()
  name: string;

  @ManyToOne(() => Shop, (shop) => shop.attributes, { onDelete: "CASCADE" })
  shop: Shop;

  @Column()
  slug: string;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name) {
      this.slug = Utils.buildSlug(this.name);
    }
  }

  @OneToMany(() => AttributeValue, (attributeValue) => attributeValue.attribute, { cascade: true, nullable: true })
  values: AttributeValue[];

  @Column({ nullable: true })
  language?: string;

  @Column("simple-array", { nullable: true })
  translated_languages: string[];
}
