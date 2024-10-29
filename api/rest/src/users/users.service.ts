import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto, UserPaginator } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import Fuse from 'fuse.js';
import { User } from './entities/user.entity';
import usersJson from '@db/users.json';
import { paginate } from 'src/common/pagination/paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { AuthPayloadResponse, Permission } from 'shop-shared/dist/auth';
import { Profile } from './entities/profile.entity';
import { UpdateProfileDto } from 'shop-shared/dist/users';
import { CoreResponse } from 'src/auth/dto/create-auth.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { AttachmentFieldEnum } from 'shop-shared/dist/attachment';
const users = plainToClass(User, usersJson);

const options = {
  keys: ['name', 'type.slug', 'categories.slug', 'status'],
  threshold: 0.3,
};
const fuse = new Fuse(users, options);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (user) {
      throw new ConflictException('User already exists');
    }

    createUserDto.password = await this.hashPassword(createUserDto.password);
    // will generate token and return
    return await this.userRepository.save(createUserDto);
  }

  async getUsers({
    text,
    limit,
    page,
    search,
  }: GetUsersDto): Promise<UserPaginator> {
    if (!page) page = 1;
    if (!limit) limit = 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: User[] = await this.userRepository.find({
      relations: ['profile'],
    });

    if (text?.replace(/%/g, '')) {
      data = fuse.search(text)?.map(({ item }) => item);
    }

    if (search) {
      const parseSearchParams = search.split(';');
      const searchText: any = [];
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        // TODO: Temp Solution
        if (key !== 'slug') {
          searchText.push({
            [key]: value,
          });
        }
      }

      data = fuse
        .search({
          $and: searchText,
        })
        ?.map(({ item }) => item);
    }

    const results = data.slice(startIndex, endIndex);
    const url = `/users?limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  async getOwners(): Promise<User[]> {
    return this.userRepository.createQueryBuilder("user")
      .where("user.permissions like :permission", { permission: `%${Permission.STORE_OWNER}%` })
      .getMany()
  };


  async getUsersNotify({ limit }: GetUsersDto): Promise<User[]> {
    const data: any = await this.userRepository.find();
    return data?.slice(0, limit);
  }

  async findOne(id: string | number) {
    return await this.userRepository.findOne({
      where: {
        id: id
      }
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    user: AuthPayloadResponse,
  ) {
    const { email, password, username, permissions } = updateUserDto;

    const isSuperAdmin = user.permissions.includes(Permission.SUPER_ADMIN);

    if ((id !== Number(user.id) || email || permissions) && !isSuperAdmin) {
      throw new ForbiddenException("You don't have permissions");
    }
    const existingUser = await this.getUserById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (email && isSuperAdmin) {
      const isExistingEmail = await this.findUserByEmail(email);
      if (isExistingEmail) {
        throw new ConflictException('The email has already been used');
      }
      existingUser.email = email;
    }

    if (permissions && isSuperAdmin) {
      existingUser.permissions = permissions;
    }

    if (password) {
      existingUser.password = await this.hashPassword(password);
    }
    if (username) {
      existingUser.username = username;
    }

    const updatedUser = await this.userRepository.save(existingUser);
    delete updatedUser.password;

    return updatedUser;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async makeAdmin(user_id: string) {
    return await this.userRepository.find({
      where: {
        id: user_id,
      },
    });
  }

  async banUser(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    user.is_active = !user.is_active;

    return user;
  }

  async activeUser(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });

    user.is_active = !user.is_active;

    return user;
  }

  async getUserById(id: string | number): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .select()
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  private async hashPassword(password: string) {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async updatePasswordByEmail(email: string, password: string) {
    const hashPassword = await this.hashPassword(password);
    return this.userRepository.update(
      {
        email,
      },
      {
        password: hashPassword,
      },
    );
  }

  async getProfileByCustomerId(id: string | number) {
    return this.profileRepository.findOne({
      select: {
        avatar: true,
        bio: true,
        contact: true,
        id: true,
        socials: true,
        created_at: true,
        updated_at: true,
        customer: {
          id: true,
          username: true,
        },
      },
      where: {
        customer: {
          id,
        },
      },
      relations: {
        customer: true,
      },
    });
  }

  async getProfileById(id: string | number) {
    return this.profileRepository.findOne({
      select: {
        avatar: true,
        bio: true,
        contact: true,
        id: true,
        socials: true,
        created_at: true,
        updated_at: true,
        customer: {
          id: true,
        },
      },
      where: {
        id,
      },
      relations: {
        customer: true,
      },
    });
  }

  async updateProfile(
    updateProfileDto: UpdateProfileDto,
    user: AuthPayloadResponse,
  ): Promise<CoreResponse> {
    const currentUser = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: {
        profile: true,
      },
    });

    const { bio, username, contact } = updateProfileDto;

    if (bio) {
      currentUser.profile.bio = bio;
    }

    if (contact) {
      currentUser.profile.contact = contact;
    }

    if (username) {
      currentUser.username = username;
    }

    await this.userRepository.save(currentUser);

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  }

  async getMe(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
        address: true,
      },
    });
  }

  createProfile(customer: User) {
    const preProfile = this.profileRepository.create();
    preProfile.customer = customer;
    this.profileRepository.save(preProfile);
  }

  @OnEvent(AttachmentFieldEnum.USER_AVATAR)
  async updateAvatar(data: { userId: number; url: string }) {
    const { userId } = data;

    await this.profileRepository.update(
      {
        customer: {
          id: userId,
        },
      },
      {
        avatar: data.url,
      },
    );
  }
}
