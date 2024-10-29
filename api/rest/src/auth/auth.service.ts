import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import {
  AuthResponse,
  ChangePasswordDto,
  ForgetPasswordDto,
  LoginDto,
  OtpDto,
  OtpLoginDto,
  OtpResponse,
  ResetPasswordDto,
  SocialLoginDto,
  VerifyForgetPasswordDto,
  VerifyOtpDto,
  Permission,
  CreateUserDto,
  AuthPayloadResponse,
} from 'shop-shared/dist/auth';
import { CoreResponse } from './dto/create-auth.dto';
import { RedisService } from 'src/redis/redis.service';
import RedisTemplate from 'src/redis/redis.templates';
import { MailService } from 'src/mail/mail.service';
import { randomBytes } from 'crypto';
import { OnEvent } from '@nestjs/event-emitter';
import { USER_REGISTER } from 'src/common/events';
import { AddressesService } from 'src/addresses/addresses.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
    private readonly eventEmitter: EventEmitter2,
    private readonly usersService: UsersService,
    private readonly addressService: AddressesService,
  ) {}
  async register(createUserInput: CreateUserDto): Promise<AuthResponse> {
    const createdUser: User = await this.usersService.create({
      username: createUserInput.username,
      email: createUserInput.email,
      password: createUserInput.password,
      permissions: [Permission.CUSTOMER],
    });
    const { id, email, permissions, username } = createdUser;
    if (createdUser) {
      this.eventEmitter.emit(USER_REGISTER, createdUser);
    }
    return {
      token: await this.jwtService.signAsync({
        id,
        email,
        permissions,
        username,
      } as AuthPayloadResponse),
      permissions,
    };
  }

  async login(loginInput: LoginDto): Promise<AuthResponse> {
    const existingUser: User = await this.usersService.findUserByEmail(
      loginInput.email,
    );

    if (!existingUser) {
      throw new BadRequestException('Invalid Credentials');
    }

    const isPasswordMatch = bcrypt.compareSync(
      loginInput.password,
      existingUser.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid Credentials');
    }
    const { id, email, permissions, username } = existingUser;

    return {
      token: await this.jwtService.signAsync({
        id,
        email,
        permissions,
        username,
      } as AuthPayloadResponse),
      permissions,
    };
  }

  async changePassword(
    changePasswordInput: ChangePasswordDto,
    email: string,
  ): Promise<CoreResponse> {
    const { oldPassword, newPassword } = changePasswordInput;

    const existingUser = await this.usersService.findUserByEmail(email);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const isPasswordMatch = bcrypt.compareSync(
      oldPassword,
      existingUser.password,
    );
    if (!isPasswordMatch) {
      throw new BadRequestException('The old password is incorrect!');
    }
    await this.usersService.updatePasswordByEmail(email, newPassword);
    return {
      success: true,
      message: 'Password change successful',
    };
  }
  async forgetPassword(
    forgetPasswordInput: ForgetPasswordDto,
  ): Promise<CoreResponse> {
    const existingUser = await this.usersService.findUserByEmail(
      forgetPasswordInput.email,
    );
    if (!existingUser) {
      throw new NotFoundException('User not found!');
    }
    const existingRequestKey = RedisTemplate.buildForgetPasswordKey(
      forgetPasswordInput.email,
    );
    const keyAliveTime = await this.redisService.getTTLAsync(
      existingRequestKey,
    );
    if (keyAliveTime) {
      throw new ConflictException(
        `Please wait ${keyAliveTime} seconds before you try again.`,
      );
    }

    const token = randomBytes(32).toString('hex');
    const redisKey = RedisTemplate.buildForgetPasswordKey(
      forgetPasswordInput.email,
      token,
    );
    const result = await this.redisService.setAsync(
      redisKey,
      token,
      +process.env.REDIS_FORGET_PASSWORD_TTL * 60,
    );
    if (result !== 'OK') {
      throw new NotImplementedException('Redis error');
    }

    await this.mailService.sendEmailWithTemplateAsync(
      forgetPasswordInput.email,
      +process.env.FORGET_PASSWORD_TEMPLATE_ID,
      {
        name: existingUser.username,
        product_name: process.env.APP_NAME,
        action_url: process.env.SHOP_URL + `/reset-password?token=${token}`,
        minutes: process.env.REDIS_FORGET_PASSWORD_TTL,
      },
    );

    return {
      success: true,
      message: 'Reset password email was sent successfully',
    };
  }
  async verifyForgetPasswordToken(
    verifyForgetPasswordTokenInput: VerifyForgetPasswordDto,
  ): Promise<CoreResponse> {
    const { email, token } = verifyForgetPasswordTokenInput;
    const redisKey = RedisTemplate.buildForgetPasswordKey(email, token);
    const existingToken = await this.redisService.getAsync<string>(redisKey);
    if (existingToken !== token) {
      throw new BadRequestException('Token or email is not match');
    }

    return {
      success: true,
      message: 'Password change successful',
    };
  }
  async resetPassword(
    resetPasswordInput: ResetPasswordDto,
  ): Promise<CoreResponse> {
    const { email, token, password } = resetPasswordInput;
    const verify = await this.verifyForgetPasswordToken({
      email,
      token,
    } as VerifyForgetPasswordDto);
    if (!verify.success) {
      throw new BadRequestException('verifyForgetPasswordToken: Server error');
    }

    const updatedResult = await this.usersService.updatePasswordByEmail(
      email,
      password,
    );
    if (updatedResult.affected === 0) {
      throw new NotImplementedException('updatePasswordByEmail: Server error');
    }

    await this.redisService.removeAsync(
      RedisTemplate.buildForgetPasswordKey(email, token),
    );

    return {
      success: true,
      message: 'Password change successful',
    };
  }
  async socialLogin(socialLoginDto: SocialLoginDto): Promise<AuthResponse> {
    console.log(socialLoginDto);
    return {
      token: 'jwt token',
      permissions: [],
    };
  }
  async otpLogin(otpLoginDto: OtpLoginDto): Promise<AuthResponse> {
    console.log(otpLoginDto);
    return {
      token: 'jwt token',
      permissions: [],
    };
  }
  async verifyOtpCode(verifyOtpInput: VerifyOtpDto): Promise<CoreResponse> {
    console.log(verifyOtpInput);
    return {
      message: 'success',
      success: true,
    };
  }
  async sendOtpCode(otpInput: OtpDto): Promise<OtpResponse> {
    console.log(otpInput);
    return {
      message: 'success',
      success: true,
      id: '1',
      provider: 'google',
      phone_number: '+919494949494',
      is_contact_exist: true,
    };
  }

  // async getUsers({ text, first, page }: GetUsersArgs): Promise<UserPaginator> {
  //   const startIndex = (page - 1) * first;
  //   const endIndex = page * first;
  //   let data: User[] = this.users;
  //   if (text?.replace(/%/g, '')) {
  //     data = fuse.search(text)?.map(({ item }) => item);
  //   }
  //   const results = data.slice(startIndex, endIndex);
  //   return {
  //     data: results,
  //     paginatorInfo: paginate(data.length, page, first, results.length),
  //   };
  // }
  // public getUser(getUserArgs: GetUserArgs): User {
  //   return this.users.find((user) => user.id === getUserArgs.id);
  // }
  async me(usr: AuthPayloadResponse): Promise<User> {
    const user = await this.usersService.getMe(usr.id);
    delete user.password;
    return user;
  }

  // updateUser(id: number, updateUserInput: UpdateUserInput) {
  //   return `This action updates a #${id} user`;
  // }

  async validateUser(payload: AuthPayloadResponse): Promise<User> {
    return await this.usersService.getUserById(payload.id);
  }

  @OnEvent(USER_REGISTER)
  onResgister(customer: User) {
    this.usersService.createProfile(customer);
  }
}
