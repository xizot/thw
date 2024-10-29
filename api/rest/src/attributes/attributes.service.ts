import { Injectable, NotFoundException } from "@nestjs/common";
import { Attribute } from './entities/attribute.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { ShopsService } from "../shops/shops.service";
import { AttributeValue } from "./entities/attribute-value.entity";
import { AttributeDto, AttributeUpdateDto } from "shop-shared/dist/attribute";

@Injectable()
export class AttributesService {

  constructor(@InjectRepository(Attribute)
              private readonly attributeRepository: Repository<Attribute>,
              @InjectRepository(AttributeValue)
              private readonly attributeValueRepository: Repository<AttributeValue>,
              private readonly shopService: ShopsService) {
  }

  async create(createAttributeDto: AttributeDto, userID: string): Promise<Attribute> {
    const { ...attributeData } = createAttributeDto;
    const attribute = this.attributeRepository.create(attributeData);

    const shop = await this.shopService.getShopByOwner(userID);
    if (shop) {
      attribute.shop = shop;
    }

    return this.attributeRepository.save(attribute);
  }

  findAll(): Promise<Attribute[]> {
    return this.attributeRepository.find({ relations: { values: true } });
  }

  findOne(id: number): Promise<Attribute> {
    return this.attributeRepository.findOne({ where: { id }, relations: { values: true } });
  }

  async update(id: number, updateAttributeDto: AttributeUpdateDto, userID: string): Promise<Attribute> {
    const { ...attributeData } = updateAttributeDto;

    const existingAttribute: Attribute = await this.attributeRepository.findOne({
      where: { id, shop: { owner: { id: userID } } },
      relations: {
        shop: true,
        values: true
      }
    });

    if (!existingAttribute) {
      throw new NotFoundException("Attribute not found");
    }

    Object.assign(existingAttribute, attributeData);


    return this.attributeRepository.save(existingAttribute);
  }

  async remove(id: number): Promise<void> {
    const existingAttribute: Attribute = await this.attributeRepository.findOne({
      where: { id }
    });

    if (!existingAttribute) {
      throw new NotFoundException("Attribute not found");
    }

    await this.attributeRepository.remove(existingAttribute);
  }

  async findAttributeValueByArrayId(ids: number[]): Promise<AttributeValue[]> {
    return this.attributeValueRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
}
