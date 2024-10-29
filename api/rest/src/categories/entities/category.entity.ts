import { CoreEntity } from "src/common/entities/core.entity";
import { Type } from "src/types/entities/type.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, ManyToMany } from "typeorm";
import { Utils } from '../../utils/Utils';
import { Product } from "../../products/entities/product.entity";

@Entity()
export class Category extends CoreEntity {
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

  @ManyToOne(() => Category, (category) => category.children, {
    onDelete: "CASCADE"
  })
  parent?: Category;

  @OneToMany(() => Category, (category) => category.parent, { nullable: true })
  children?: Category[];

  @Column({ nullable: true })
  details?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ nullable: true })
  language: string;

  @Column("simple-array", { nullable: true })
  translated_languages?: string[];

  @ManyToOne(() => Type, (type) => type.categories, {
    onDelete: "CASCADE",
    nullable: true
  })
  type?: Type;

  @ManyToMany(() => Product, (product) => product.categories)
  products?: Product[];
}
