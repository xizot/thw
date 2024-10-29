import { Column, Entity, ManyToOne } from "typeorm";
import { CoreEntity } from "../../common/entities/core.entity";
import { Variation } from "./variation.entity";

@Entity()
export class VariationOption extends CoreEntity {

  @Column()
  name: string;

  @Column()
  value: string;

  @ManyToOne(() => Variation, (variation) => variation.options, { onDelete: "CASCADE" })
  variation: Variation;
}