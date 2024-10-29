import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAddressDto, UpdateAddressDto } from 'shop-shared/dist/addresses';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { User } from 'src/users/entities/user.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { USER_REGISTER } from 'src/common/events';
import { AuthPayloadResponse } from 'shop-shared/dist/auth';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly userService: UsersService
  ) { }

  async createAddress(createAddressDto: CreateAddressDto, user: AuthPayloadResponse) {
    const existingUser = await this.userService.getUserById(user.id);
    if (!existingUser) {
      throw new NotFoundException("User not found.")
    }
    return this.addressRepository.save({ ...createAddressDto, default: false, customer: existingUser })
  }

  findAll(user: AuthPayloadResponse) {
    return this.addressRepository.find({
      where: {
        customer: {
          id: user.id
        }
      }
    });
  }

  findOne(id: number, user: AuthPayloadResponse) {
    return this.addressRepository.findOne({
      where: {
        id,
        customer: {
          id: user.id
        }
      }
    })
  }

  async update(id: number, updateAddressDto: UpdateAddressDto, user: AuthPayloadResponse) {
    const existingAddress = await this.findOne(id, user);
    if (!existingAddress) {
      throw new NotFoundException("Address not found or you dont have permission.")
    }

    if (updateAddressDto.default) {
      await this.addressRepository.update({
        customer: {
          id: user.id,
        },
        type: updateAddressDto.type
      }, {
        default: false
      })
    }

    return this.addressRepository.save({ ...existingAddress, ...updateAddressDto })
  }

  async remove(id: number, user: AuthPayloadResponse) {
    const existingAddress = await this.findOne(id, user);
    if (!existingAddress) {
      throw new NotFoundException("Address not found or you dont have permission.")
    }

    return this.addressRepository.remove(existingAddress);
  }
}
