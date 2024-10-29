import { Injectable, NotFoundException } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { Shop } from "./entities/shop.entity";
import shopsJson from "@db/shops.json";
import Fuse from "fuse.js";
import { GetShopsDto } from "./dto/get-shops.dto";
import { paginate } from "src/common/pagination/paginate";
import { GetStaffsDto } from "./dto/get-staffs.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Address } from "src/addresses/entities/address.entity";
import { ShopSettings } from "./entities/shop-setting.entity";
import { PaymentInfo } from "./entities/payment-info.entity";
import { CreateShopDto, PaymentInfoDto, ShopAddressDto, ShopSettingsDto, UpdateShopDto } from "shop-shared/dist/shop";
import { ShopSocials } from "src/settings/entities/shop-social.entity";
import { OnEvent } from "@nestjs/event-emitter";
import { AttachmentFieldEnum } from "shop-shared/dist/attachment";
import { UsersService } from "../users/users.service";

const shops = plainToClass(Shop, shopsJson);
const options = {
  keys: ['name', 'type.slug', 'is_active'],
  threshold: 0.3,
};
const fuse = new Fuse(shops, options);

@Injectable()
export class ShopsService {
  private shops: Shop[] = shops;
  /**
   *
   */
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(PaymentInfo)
    private readonly paymentInfoRepository: Repository<PaymentInfo>,
    @InjectRepository(ShopSettings)
    private readonly shopSettingsRepository: Repository<ShopSettings>,
    private readonly usersService: UsersService
  ) {}

  async createShopAddress(address: ShopAddressDto, shop: Shop) {
    const createdAddress = this.addressRepository.create(address);
    createdAddress.shop = shop;
    await this.addressRepository.save(createdAddress);
  }

  async createShopPaymentInfo(paymentInfo: PaymentInfoDto, shop: Shop) {
    const createdPaymentInfo = this.paymentInfoRepository.create(paymentInfo);
    createdPaymentInfo.shop = shop;
    await this.paymentInfoRepository.save(createdPaymentInfo);
  }

  async createShopSettings(settings: ShopSettingsDto, shop: Shop) {
    const createdSettings = this.shopSettingsRepository.create();
    createdSettings.shop = shop;
    createdSettings.socials = settings.socials as ShopSocials[];
    await this.shopSettingsRepository.save(createdSettings);
  }

  async create(createShopDto: CreateShopDto) {
    const { address, paymentInfo, settings, owner, ...shopData } =
      createShopDto;

    const alreadyExist = await this.shopRepository.findOne({
      where: { owner: { id: owner } },
    });

    if (alreadyExist) {
      throw new NotFoundException('You only can have one shop');
    }

    if (!await this.usersService.findOne(owner)) throw new NotFoundException("Owner not found");

    const createdShop = this.shopRepository.create({
      ...shopData,
      owner: { id: owner },
    });

    // await Promise.all([
    //   // this.createShopAddress(address, shop),
    //   // this.createShopPaymentInfo(paymentInfo, shop),
    //   // this.createShopSettings(settings, shop),
    // ]);

    return await this.shopRepository.save(createdShop);
  }

  async getShops({ search, limit, page }: GetShopsDto) {
    if (!page) page = 1;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data = await this.shopRepository.find({
      relations: ["owner"]
    });
    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        // data = data.filter((item) => item[key] === value);
        data = fuse.search(value)?.map(({ item }) => item);
      }
    }
    // if (text?.replace(/%/g, '')) {
    //   data = fuse.search(text)?.map(({ item }) => item);
    // }
    const results = data.slice(startIndex, endIndex);
    const url = `/shops?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  getStaffs({ shop_id, limit, page }: GetStaffsDto) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let staffs: Shop['staffs'] = [];
    if (shop_id) {
      staffs = [].find((p) => p.id === shop_id)?.staffs ?? [];
    }
    const results = staffs?.slice(startIndex, endIndex);
    const url = `/staffs?limit=${limit}`;

    return {
      data: results,
      ...paginate(staffs?.length, page, limit, results?.length, url),
    };
  }

  getShop(slug: string): Shop {
    return [].find((p) => p.slug === slug);
  }

  async update(id: number, updateShopDto: UpdateShopDto, owner: string) {
    const { address, paymentInfo, settings, ...shopData } =
      updateShopDto;
    const shop = await this.shopRepository.findOne({
      where: { id, owner: { id: owner } },
      relations: { owner: true, address: true, settings: { location: true, socials: true } }
    });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    Object.assign(shop, shopData);

    if (address) {
      Object.assign(shop.address, address);
      await this.addressRepository.save(shop.address);
    }


    if (settings) {
      const { location, socials, ...settingData } =
        settings;
      if (location) Object.assign(shop.settings.location, location);

      if (socials) {
        Object.assign(shop.settings.socials, socials);
      }

      Object.assign(shop.settings, settingData);
      await this.shopSettingsRepository.save(shop.settings);
    }

    return this.shopRepository.save(shop);
  }

  approve(id: number) {
    return `This action removes a #${id} shop`;
  }

  remove(id: number) {
    return `This action removes a #${id} shop`;
  }

  disapproveShop(id: string) {
    const shop = this.shops.find((s) => s.id === id);
    shop.is_active = false;

    return shop;
  }

  approveShop(id: string) {
    const shop = this.shops.find((s) => s.id === id);
    shop.is_active = true;
    return shop;
  }

  async findOne(id: number): Promise<Shop> {
    return this.shopRepository.findOne({
      where: { id }
    });
  }

  @OnEvent(AttachmentFieldEnum.SHOP_LOGO)
  async uploadShopLogo(data: { userId: string; url: string }) {
    const shop = await this.shopRepository.findOne({
      where: { owner: { id: data.userId } },
    });
    if (!shop) throw new NotFoundException('Shop not found');
    shop.logo = data.url;
    await this.shopRepository.save(shop);
  }

  @OnEvent(AttachmentFieldEnum.SHOP_COVER)
  async uploadShopCover(data: { userId: string; url: string }) {
    const shop = await this.shopRepository.findOne({
      where: { owner: { id: data.userId } },
    });
    if (!shop) throw new NotFoundException('Shop not found');
    shop.cover_image = data.url;
    await this.shopRepository.save(shop);
  }

  async getShopByOwner(ownerId: number | string): Promise<Shop> {
    return this.shopRepository.findOne({
      where: {
        owner: {
          id: ownerId
        }
      }, relations: {
        owner: true,
        address: true,
        settings: { location: true, socials: true }
      }
    });
  }
}
