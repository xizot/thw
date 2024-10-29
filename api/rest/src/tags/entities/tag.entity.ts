import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Product } from 'src/products/entities/product.entity';
import { Type } from 'src/types/entities/type.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, ManyToOne } from "typeorm";
import { Utils } from "../../utils/Utils";

@Entity()
export class Tag extends CoreEntity {
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

  // parent: number;

  @Column({ type: "text", nullable: true })
  details?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  icon?: string;

  @ManyToOne(() => Type, (type) => type.tags, { onDelete: "CASCADE" })
  type: Type;

  @ManyToMany(() => Product, (product) => product.tags)
  products: Product[];

  @Column({ nullable: true })
  language?: string;

  @Column("simple-array", { nullable: true })
  translated_languages: string[];
}
