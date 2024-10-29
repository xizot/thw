import { ZodValidationPipe } from 'src/zod-validation.pipe';
import { Controller, Get, Post, Body, UsePipes, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  ForgetPasswordDto,
  LoginDto,
  OtpDto,
  OtpLoginDto,
  ResetPasswordDto,
  SocialLoginDto,
  VerifyForgetPasswordDto,
  VerifyOtpDto,
  CreateUserSchema,
  CreateUserDto,
  LoginSchema,
  ForgetPasswordSchema,
  ResetPasswordSchema,
  ChangePasswordSchema,
  VerifyForgetPasswordSchema,
  VerifyOtpSchema,
  OtpLoginSchema,
  OtpSchema,
  SocialLoginSchema,
} from 'shop-shared/dist/auth';
import { Request } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthGuard } from './decorator/auth.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  createAccount(@Body() registerDto: CreateUserDto) {
    return this.authService.register(registerDto);
  }
  @Post('token')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('social-login-token')
  @UsePipes(new ZodValidationPipe(SocialLoginSchema))
  socialLogin(@Body() socialLoginDto: SocialLoginDto) {
    return this.authService.socialLogin(socialLoginDto);
  }
  @Post('otp-login')
  @UsePipes(new ZodValidationPipe(OtpLoginSchema))
  otpLogin(@Body() otpLoginDto: OtpLoginDto) {
    return this.authService.otpLogin(otpLoginDto);
  }
  @Post('send-otp-code')
  @UsePipes(new ZodValidationPipe(OtpSchema))
  sendOtpCode(@Body() otpDto: OtpDto) {
    return this.authService.sendOtpCode(otpDto);
  }
  @Post('verify-otp-code')
  @UsePipes(new ZodValidationPipe(VerifyOtpSchema))
  verifyOtpCode(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtpCode(verifyOtpDto);
  }
  @Post('forget-password')
  @UsePipes(new ZodValidationPipe(ForgetPasswordSchema))
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto);
  }
  @Post('reset-password')
  @UsePipes(new ZodValidationPipe(ResetPasswordSchema))
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
  @Post('change-password')
  @AuthGuard()
  @UsePipes(new ZodValidationPipe(ChangePasswordSchema))
  changePassword(@Req() request: Request, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto, request.user.email);
  }
  @Post('logout')
  async logout(): Promise<boolean> {
    return true;
  }
  @Post('verify-forget-password-token')
  @UsePipes(new ZodValidationPipe(VerifyForgetPasswordSchema))
  verifyForgetPassword(
    @Body() verifyForgetPasswordDto: VerifyForgetPasswordDto,
  ) {
    return this.authService.verifyForgetPasswordToken(verifyForgetPasswordDto);
  }

  @Get('me')
  @AuthGuard()
  me(@Req() request: Request) {
    return this.authService.me(request.user);
  }
  @Post('add-points')
  @AuthGuard()
  addWalletPoints(@Req() request: Request, @Body() addPointsDto: any) {
    return this.authService.me(request.user);
  }
  @Post('contact-us')
  contactUs(@Body() addPointsDto: any) {
    return {
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon.',
    };
  }
}
