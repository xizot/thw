import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Banner } from './banner.entity';
import { TypeSettings } from './typeSettings.entity';
import { Category } from '../../categories/entities/category.entity';
import { Manufacturer } from "../../manufacturers/entities/manufacturer.entity";
import { Utils } from "../../utils/Utils";
import { Tag } from "../../tags/entities/tag.entity";
import { Product } from "../../products/entities/product.entity";

@Entity()
export class Type extends CoreEntity {
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

  @Column()
  icon: string;

  @OneToMany(() => Banner, (banner) => banner.type, { nullable: true, cascade: true })
  banners?: Banner[];

  @OneToMany(
    () => Attachment,
    (attachment) => attachment.promotionalSlidersImage,
    {
      nullable: true,
      onDelete: 'CASCADE',
    },
  )
  promotional_sliders?: Attachment[];

  @OneToOne(() => TypeSettings, (typeSettings) => typeSettings.Type, {
    nullable: true,
    cascade: true
  })
  settings?: TypeSettings;

  @Column()
  language: string;

  @Column("simple-array", { nullable: true })
  translated_languages?: string[];

  @OneToMany(() => Category, (category) => category.type)
  categories: Category[];

  @OneToMany(() => Manufacturer, (manufacturer) => manufacturer.type)
  manufacturer: Manufacturer[];

  @OneToMany(() => Tag, (tag) => tag.type)
  tags: Tag[];

  @OneToMany(() => Product, (product) => product.type)
  products: Product[];
}
